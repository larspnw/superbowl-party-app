#!/usr/bin/env python3
"""Super Bowl Party Dish Organizer Backend with CORS fix"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import uuid
from datetime import datetime

app = Flask(__name__)
# Update CORS to allow GitHub Pages
CORS(app, origins=['https://larspnw.github.io', 'http://localhost:3000', 'http://127.0.0.1:3000'])

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)