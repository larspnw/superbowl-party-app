# Backend models and data handling

import json
import uuid
from datetime import datetime

# Global data storage (JSON-based)
data = {
    "categories": [
        {
            "id": "appetizers",
            "name": "Appetizers",
            "max_items": 3,
            "cards": []
        },
        {
            "id": "sides",
            "name": "Sides",
            "max_items": 3,
            "cards": []
        },
        {
            "id": "main",
            "name": "Main Dishes",
            "max_items": 3,
            "cards": []
        },
        {
            "id": "desserts",
            "name": "Desserts",
            "max_items": 3,
            "cards": []
        }
    ]
}

def get_all_categories():
    """Get all categories with cards"""
    return data["categories"]

def create_card(card_data):
    """Create a new card"""
    new_card = {
        "id": str(uuid.uuid4()),
        "couple_name": card_data['couple_name'].strip(),
        "dish_name": card_data['dish_name'].strip(),
        "dietary_restrictions": card_data['dietary_restrictions'].strip(),
        "category_id": card_data['category_id'],
        "created_at": datetime.now().isoformat()
    }
    
    # Find category and add card
    category = next((cat for cat in data["categories"] if cat["id"] == card_data['category_id']), None)
    if category and len(category["cards"]) < category["max_items"]:
        category["cards"].append(new_card)
        return new_card
    else:
        raise Exception("Category not found or full")

def update_card_category(card_id, new_category_id):
    """Update card category (drag & drop)"""
    # Find card in current category
    for category in data["categories"]:
        for card in category["cards"]:
            if card["id"] == card_id:
                # Remove from current category
                category["cards"] = [c for c in category["cards"] if c["id"] != card_id]
                
                # Add to new category
                new_category = next((cat for cat in data["categories"] if cat["id"] == new_category_id), None)
                if new_category and len(new_category["cards"]) < new_category["max_items"]:
                    card["category_id"] = new_category_id
                    new_category["cards"].append(card)
                    return card
                else:
                    raise Exception("New category not found or full")
    
    return None
