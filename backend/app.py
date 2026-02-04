#!/usr/bin/env python3
"""Super Bowl Party Dish Organizer Backend - Production Ready with SQLite"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import uuid
from datetime import datetime
import os
import sqlite3
import json

app = Flask(__name__)

# Configure CORS for production
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=False)

# Database file - use persistent directory on Render
DB_FILE = os.environ.get('DB_FILE', '/opt/render/project/src/superbowl.db')
# Fallback for local dev
if not os.path.exists(os.path.dirname(DB_FILE)) and DB_FILE.startswith('/opt'):
    DB_FILE = 'superbowl.db'

print(f"Database file: {DB_FILE}")

# Default categories
DEFAULT_CATEGORIES = [
    {"id": "appetizers", "name": "Appetizers", "max_items": 3},
    {"id": "sides", "name": "Sides", "max_items": 3},
    {"id": "main", "name": "Main Dishes", "max_items": 3},
    {"id": "desserts", "name": "Desserts", "max_items": 3}
]

def get_db():
    """Get database connection"""
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize database tables"""
    conn = get_db()
    cursor = conn.cursor()
    
    # Create categories table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS categories (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            max_items INTEGER DEFAULT 3
        )
    ''')
    
    # Create cards table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS cards (
            id TEXT PRIMARY KEY,
            couple_name TEXT NOT NULL,
            dish_name TEXT NOT NULL,
            dietary_restrictions TEXT DEFAULT '',
            category_id TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (category_id) REFERENCES categories(id)
        )
    ''')
    
    # Insert default categories if empty
    cursor.execute('SELECT COUNT(*) FROM categories')
    if cursor.fetchone()[0] == 0:
        for cat in DEFAULT_CATEGORIES:
            cursor.execute(
                'INSERT INTO categories (id, name, max_items) VALUES (?, ?, ?)',
                (cat['id'], cat['name'], cat['max_items'])
            )
    
    conn.commit()
    conn.close()
    print("Database initialized")

# Initialize on startup
init_db()

@app.route('/')
def index():
    """Health check endpoint"""
    return jsonify({
        "message": "Super Bowl Party Dish Organizer API",
        "version": "1.0.4",
        "status": "running",
        "database": DB_FILE,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check for Render"""
    return jsonify({"status": "healthy", "service": "superbowl-party-api", "version": "1.0.4"})

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get all categories with cards"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Get categories
        cursor.execute('SELECT id, name, max_items FROM categories')
        categories = []
        for row in cursor.fetchall():
            cat = {
                'id': row['id'],
                'name': row['name'],
                'max_items': row['max_items'],
                'cards': []
            }
            
            # Get cards for this category
            cursor.execute(
                'SELECT id, couple_name, dish_name, dietary_restrictions, category_id, created_at FROM cards WHERE category_id = ?',
                (row['id'],)
            )
            for card_row in cursor.fetchall():
                cat['cards'].append({
                    'id': card_row['id'],
                    'couple_name': card_row['couple_name'],
                    'dish_name': card_row['dish_name'],
                    'dietary_restrictions': card_row['dietary_restrictions'],
                    'category_id': card_row['category_id'],
                    'created_at': card_row['created_at']
                })
            
            categories.append(cat)
        
        conn.close()
        return jsonify(categories)
    except Exception as e:
        print(f"Error getting categories: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/cards', methods=['POST'])
def create_card():
    """Create a new card"""
    try:
        if not request.is_json:
            return jsonify({"error": "Content-Type must be application/json"}), 400
            
        card_data = request.json
        
        # Validate required fields
        required_fields = ['couple_name', 'dish_name', 'dietary_restrictions', 'category_id']
        for field in required_fields:
            if field not in card_data:
                return jsonify({"error": f"Missing field: {field}"}), 400
        
        # Basic validation
        if not card_data['couple_name'].strip() or not card_data['dish_name'].strip():
            return jsonify({"error": "Couple name and dish name are required"}), 400
        
        conn = get_db()
        cursor = conn.cursor()
        
        # Check if category exists
        cursor.execute('SELECT id, max_items FROM categories WHERE id = ?', (card_data['category_id'],))
        category = cursor.fetchone()
        if not category:
            conn.close()
            return jsonify({"error": "Category not found"}), 404
        
        # Check if category has space
        cursor.execute('SELECT COUNT(*) FROM cards WHERE category_id = ?', (card_data['category_id'],))
        count = cursor.fetchone()[0]
        if count >= category['max_items']:
            conn.close()
            return jsonify({"error": "Category is full (max 3 items)"}), 400
        
        # Create card
        card_id = str(uuid.uuid4())
        created_at = datetime.now().isoformat()
        
        cursor.execute(
            'INSERT INTO cards (id, couple_name, dish_name, dietary_restrictions, category_id, created_at) VALUES (?, ?, ?, ?, ?, ?)',
            (card_id, card_data['couple_name'].strip(), card_data['dish_name'].strip(), 
             card_data['dietary_restrictions'].strip(), card_data['category_id'], created_at)
        )
        conn.commit()
        
        new_card = {
            "id": card_id,
            "couple_name": card_data['couple_name'].strip(),
            "dish_name": card_data['dish_name'].strip(),
            "dietary_restrictions": card_data['dietary_restrictions'].strip(),
            "category_id": card_data['category_id'],
            "created_at": created_at
        }
        
        conn.close()
        print(f"Created card: {new_card['couple_name']} - {new_card['dish_name']}")
        return jsonify(new_card), 201
    except Exception as e:
        print(f"Error creating card: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/cards/<card_id>', methods=['PUT'])
def update_card(card_id):
    """Update a card's details"""
    try:
        if not request.is_json:
            return jsonify({"error": "Content-Type must be application/json"}), 400
        
        updates = request.json
        conn = get_db()
        cursor = conn.cursor()
        
        # Check if card exists
        cursor.execute('SELECT * FROM cards WHERE id = ?', (card_id,))
        card = cursor.fetchone()
        if not card:
            conn.close()
            return jsonify({"error": "Card not found"}), 404
        
        # Build update query
        update_fields = []
        values = []
        if 'dish_name' in updates:
            update_fields.append('dish_name = ?')
            values.append(updates['dish_name'].strip())
        if 'dietary_restrictions' in updates:
            update_fields.append('dietary_restrictions = ?')
            values.append(updates['dietary_restrictions'].strip())
        if 'couple_name' in updates:
            update_fields.append('couple_name = ?')
            values.append(updates['couple_name'].strip())
        
        if update_fields:
            values.append(card_id)
            cursor.execute(f'UPDATE cards SET {", ".join(update_fields)} WHERE id = ?', values)
            conn.commit()
        
        # Get updated card
        cursor.execute('SELECT * FROM cards WHERE id = ?', (card_id,))
        updated = cursor.fetchone()
        
        result = {
            'id': updated['id'],
            'couple_name': updated['couple_name'],
            'dish_name': updated['dish_name'],
            'dietary_restrictions': updated['dietary_restrictions'],
            'category_id': updated['category_id'],
            'created_at': updated['created_at']
        }
        
        conn.close()
        print(f"Updated card: {result['couple_name']}")
        return jsonify(result), 200
    except Exception as e:
        print(f"Error updating card: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/cards/<card_id>/category', methods=['PUT'])
def update_card_category(card_id):
    """Move a card to a different category"""
    try:
        if not request.is_json:
            return jsonify({"error": "Content-Type must be application/json"}), 400
        
        req_data = request.json
        new_category_id = req_data.get('category_id')
        
        if not new_category_id:
            return jsonify({"error": "category_id is required"}), 400
        
        conn = get_db()
        cursor = conn.cursor()
        
        # Check if new category exists and has space
        cursor.execute('SELECT id, max_items FROM categories WHERE id = ?', (new_category_id,))
        category = cursor.fetchone()
        if not category:
            conn.close()
            return jsonify({"error": "Category not found"}), 404
        
        cursor.execute('SELECT COUNT(*) FROM cards WHERE category_id = ?', (new_category_id,))
        count = cursor.fetchone()[0]
        if count >= category['max_items']:
            conn.close()
            return jsonify({"error": "Category is full (max 3 items)"}), 400
        
        # Check if card exists
        cursor.execute('SELECT * FROM cards WHERE id = ?', (card_id,))
        card = cursor.fetchone()
        
        if card:
            # Update existing card
            cursor.execute('UPDATE cards SET category_id = ? WHERE id = ?', (new_category_id, card_id))
            conn.commit()
            
            result = {
                'id': card['id'],
                'couple_name': card['couple_name'],
                'dish_name': card['dish_name'],
                'dietary_restrictions': card['dietary_restrictions'],
                'category_id': new_category_id,
                'created_at': card['created_at']
            }
        else:
            conn.close()
            return jsonify({"error": "Card not found"}), 404
        
        conn.close()
        print(f"Moved card {result['couple_name']} to {new_category_id}")
        return jsonify(result), 200
    except Exception as e:
        print(f"Error moving card: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/cards/<card_id>', methods=['DELETE'])
def delete_card(card_id):
    """Delete a card"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('SELECT id FROM cards WHERE id = ?', (card_id,))
        if not cursor.fetchone():
            conn.close()
            return jsonify({"error": "Card not found"}), 404
        
        cursor.execute('DELETE FROM cards WHERE id = ?', (card_id,))
        conn.commit()
        conn.close()
        
        print(f"Deleted card: {card_id}")
        return jsonify({"message": "Card deleted"}), 200
    except Exception as e:
        print(f"Error deleting card: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)
