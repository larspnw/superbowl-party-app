#!/usr/bin/env python3
"""Super Bowl Party Dish Organizer Backend - Production Ready"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import uuid
from datetime import datetime
import os
import json

app = Flask(__name__)

# Configure CORS for production - allow all Render origins
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=False)

# Persistent storage file
DATA_FILE = os.environ.get('DATA_FILE', '/tmp/superbowl_data.json')

# Default categories
DEFAULT_CATEGORIES = [
    {"id": "appetizers", "name": "Appetizers", "max_items": 3, "cards": []},
    {"id": "sides", "name": "Sides", "max_items": 3, "cards": []},
    {"id": "main", "name": "Main Dishes", "max_items": 3, "cards": []},
    {"id": "desserts", "name": "Desserts", "max_items": 3, "cards": []}
]

def load_data():
    """Load data from persistent storage"""
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r') as f:
                return json.load(f)
    except Exception as e:
        print(f"Error loading data: {e}")
    return {"categories": [dict(c) for c in DEFAULT_CATEGORIES]}

def save_data(data):
    """Save data to persistent storage"""
    try:
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        print(f"Error saving data: {e}")

# Load initial data
data = load_data()

@app.route('/')
def index():
    """Health check endpoint"""
    return jsonify({
        "message": "Super Bowl Party Dish Organizer API",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check for Render"""
    return jsonify({"status": "healthy", "service": "superbowl-party-api"})

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get all categories with cards"""
    try:
        return jsonify(data["categories"])
    except Exception as e:
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
        
        # Check if category exists and has space
        category = next((cat for cat in data["categories"] if cat["id"] == card_data['category_id']), None)
        if not category:
            return jsonify({"error": "Category not found"}), 404
        
        if len(category["cards"]) >= category["max_items"]:
            return jsonify({"error": "Category is full (max 3 items)"}), 400
        
        # Create card
        new_card = {
            "id": str(uuid.uuid4()),
            "couple_name": card_data['couple_name'].strip(),
            "dish_name": card_data['dish_name'].strip(),
            "dietary_restrictions": card_data['dietary_restrictions'].strip(),
            "category_id": card_data['category_id'],
            "created_at": datetime.now().isoformat()
        }
        
        category["cards"].append(new_card)
        save_data(data)
        return jsonify(new_card), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/cards/<card_id>', methods=['PUT'])
def update_card(card_id):
    """Update a card's details"""
    try:
        if not request.is_json:
            return jsonify({"error": "Content-Type must be application/json"}), 400
        
        updates = request.json
        
        # Find the card
        for category in data["categories"]:
            for card in category["cards"]:
                if card["id"] == card_id:
                    # Update allowed fields
                    if 'dish_name' in updates:
                        card['dish_name'] = updates['dish_name'].strip()
                    if 'dietary_restrictions' in updates:
                        card['dietary_restrictions'] = updates['dietary_restrictions'].strip()
                    if 'couple_name' in updates:
                        card['couple_name'] = updates['couple_name'].strip()
                    
                    save_data(data)
                    return jsonify(card), 200
        
        return jsonify({"error": "Card not found"}), 404
    except Exception as e:
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
        
        # Find the new category
        new_category = next((cat for cat in data["categories"] if cat["id"] == new_category_id), None)
        if not new_category:
            return jsonify({"error": "Category not found"}), 404
        
        # Check if new category has space
        if len(new_category["cards"]) >= new_category["max_items"]:
            return jsonify({"error": "Category is full (max 3 items)"}), 400
        
        # Find and remove card from current category
        card = None
        for category in data["categories"]:
            for c in category["cards"]:
                if c["id"] == card_id:
                    card = c
                    category["cards"].remove(c)
                    break
            if card:
                break
        
        # If card not found, it might be a pre-made card being added for the first time
        if not card:
            # Create a new card for pre-made couples
            couple_name = req_data.get('couple_name', card_id.replace('pre-', '').title())
            dish_name = req_data.get('dish_name', 'TBD')
            
            card = {
                "id": card_id,
                "couple_name": couple_name,
                "dish_name": dish_name,
                "dietary_restrictions": req_data.get('dietary_restrictions', ''),
                "category_id": new_category_id,
                "created_at": datetime.now().isoformat()
            }
        else:
            card["category_id"] = new_category_id
        
        # Add to new category
        new_category["cards"].append(card)
        save_data(data)
        
        return jsonify(card), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/cards/<card_id>', methods=['DELETE'])
def delete_card(card_id):
    """Delete a card"""
    try:
        for category in data["categories"]:
            for card in category["cards"]:
                if card["id"] == card_id:
                    category["cards"].remove(card)
                    save_data(data)
                    return jsonify({"message": "Card deleted"}), 200
        return jsonify({"error": "Card not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Use PORT from environment (Render provides this)
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)