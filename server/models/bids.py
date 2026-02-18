from config.db import db
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

class Bids(db.Model):
    __tablename__ = "bids"

    bid_id = Column(Integer, primary_key=True, autoincrement=True)
    item_id = Column(Integer, nullable=False)
    user_id = Column(Integer, nullable=False)
    current_price = Column(Integer , nullable=False)
    user_email = Column(String(100), nullable=False)  
    username = Column(String(50), nullable=False)  
    created_at = Column(DateTime, default=datetime.utcnow)
    winner_id = Column(Integer)

    