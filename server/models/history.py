from datetime import datetime
from config.db import db
class History(db.Model):
    __tablename__ = 'history'
    
    id = db.Column(db.Integer, primary_key=True , autoincrement=True)
    buyer_id = db.Column(db.Integer, nullable=False)  # Buyer
    seller_id = db.Column(db.Integer, nullable=False)  # Seller
    item_id = db.Column(db.Integer, nullable=False)  # Item reference
    item_name = db.Column(db.String(255), nullable=False)  # Store the item name
    final_price = db.Column(db.Float, nullable=False)  # Price at purchase
    purchase_date = db.Column(db.DateTime, default=datetime.utcnow)  # Auto timestamp
    
    def __init__(self, buyer_id, seller_id, item_id, item_name, final_price):
        self.buyer_id = buyer_id
        self.seller_id = seller_id
        self.item_id = item_id
        self.item_name = item_name
        self.final_price = final_price

    def to_dict(self):
        """Convert object to dictionary (useful for JSON responses)"""
        return {
            "id": self.id,
            "buyer_id": self.buyer_id,
            "seller_id": self.seller_id,
            "item_id": self.item_id,
            "item_name": self.item_name,
            "final_price": self.final_price,
            "purchase_date": self.purchase_date.strftime('%Y-%m-%d %H:%M:%S')
        }
