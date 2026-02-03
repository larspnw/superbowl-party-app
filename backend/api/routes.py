from flask import Blueprint, jsonify, request
from models import get_all_categories, create_card, update_card_category

api_bp = Blueprint('api', __name__)

@api_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all categories with cards"""
    return jsonify(get_all_categories())

@api_bp.route('/categories/<category_id>/cards', methods=['GET'])
def get_cards(category_id):
    """Get cards for a specific category"""
    category = next((cat for cat in get_all_categories() if cat["id"] == category_id), None)
    if not category:
        return jsonify({"error": "Category not found"}), 404
    return jsonify(category["cards"])

@api_bp.route('/cards', methods=['POST'])
def create_card():
    """Create a new card"""
    try:
        card_data = request.json
        
        # Basic validation
        required_fields = ['couple_name', 'dish_name', 'dietary_restrictions', 'category_id']
        for field in required_fields:
            if field not in card_data:
                return jsonify({"error": f"Missing field: {field}"}), 400
        
        new_card = create_card(card_data)
        return jsonify(new_card), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route('/cards/<card_id>/category', methods=['PUT'])
def update_card_category(card_id):
    """Update card category (drag & drop)"""
    try:
        data = request.json
        new_category_id = data.get('category_id')
        
        if not new_category_id:
            return jsonify({"error": "Category ID required"}), 400
        
        updated_card = update_card_category(card_id, new_category_id)
        if updated_card:
            return jsonify(updated_card), 200
        else:
            return jsonify({"error": "Card not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
