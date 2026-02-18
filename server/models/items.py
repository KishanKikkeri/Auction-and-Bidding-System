from config.db import db
from sqlalchemy.sql import func

class Item(db.Model):
    __tablename__ = "items"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.String(500), nullable=True)
    starting_price = db.Column(db.Float, nullable=False)
    current_price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(100), nullable=True)
    condition = db.Column(db.String(50), nullable=True)  
    seller_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    auction_end = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(50), default="active", nullable=False)
    created_at = db.Column(db.DateTime, default=func.now(), nullable=False)
    winner_id = db.Column(db.Integer, nullable=True)  
   
    seller = db.relationship("User", backref="items")

    def to_dict(self):
        """Convert item object to dictionary for API responses."""
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "seller_name": self.seller.username if self.seller else None,
            "image_url": self.image_url,
            "starting_price": self.starting_price,
            "current_price": self.current_price,
            "category": self.category,
            "condition": self.condition,
            "seller_id": self.seller_id,
            "winner_id":self.winner_id if self.winner_id else None,
            "auction_end": self.auction_end.isoformat(),
            "status": self.status,
            "created_at": self.created_at.isoformat()
        }
