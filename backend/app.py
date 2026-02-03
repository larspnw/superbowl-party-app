#!/usr/bin/env python3
"""Super Bowl Party Dish Organizer Backend"""

from flask import Flask, jsonify, request, render_template_string
from flask_cors import CORS
import json
import uuid
from datetime import datetime

app = Flask(__name__)
CORS(app, origins=['*'])

# Data storage
CATEGORIES = [
    {"id": "appetizers", "name": "Appetizers", "max_items": 3},
    {"id": "sides", "name": "Sides", "max_items": 3},
    {"id": "main", "name": "Main Dishes", "max_items": 3},
    {"id": "desserts", "name": "Desserts", "max_items": 3}
]

data = {
    "categories": [{**cat, "cards": []} for cat in CATEGORIES]
}

@app.route('/')
def index():
    return jsonify({"message": "Super Bowl Party Dish Organizer", "version": "1.0.0"})

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get all categories with cards"""
    return jsonify(data["categories"])

@app.route('/api/categories/<category_id>/cards', methods=['GET'])
def get_cards(category_id):
    """Get cards for a specific category"""
    category = next((cat for cat in data["categories"] if cat["id"] == category_id), None)
    if not category:
        return jsonify({"error": "Category not found"}), 404
    return jsonify(category["cards"])

@app.route('/api/cards', methods=['POST'])
def create_card():
    """Create a new card"""
    try:
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
        return jsonify(new_card), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/cards/<card_id>/category', methods=['PUT'])
def update_card_category(card_id):
    """Update card category (drag & drop)"""
    try:
        data = request.json
        new_category_id = data.get('category_id')
        
        if not new_category_id:
            return jsonify({"error": "Category ID required"}), 400
        
        # Find card and move it
        for category in data["categories"]:
            for card in category["cards"]:
                if card["id"] == card_id:
                    # Remove from current category
                    category["cards"] = [c for c in category["cards"] if c["id"] != card_id]
                    
                    # Add to new category
                    new_category = next((cat for cat in data["categories"] if cat["id"] == new_category_id), None)
                    if not new_category:
                        return jsonify({"error": "New category not found"}), 404
                    
                    if len(new_category["cards"]) >= new_category["max_items"]:
                        return jsonify({"error": "New category is full"}), 400
                    
                    card["category_id"] = new_category_id
                    new_category["cards"].append(card)
                    return jsonify(card), 200
        
        return jsonify({"error": "Card not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
