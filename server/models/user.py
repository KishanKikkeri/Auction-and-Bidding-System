# models/user.py
from config.db import db
from sqlalchemy import Column, Integer, String, Float, Text, TIMESTAMP, DECIMAL
from sqlalchemy.sql import func

class User(db.Model):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)  
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=True)
    address = Column(Text, nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    zip_code = Column(String(20), nullable=True)
    country = Column(String(100), nullable=True)
    role = Column(String(20), nullable=False, default="user")
    wallet = Column(Float, default=0.0, nullable=False)
    img = Column(String(1000), nullable=True)
    phone = Column(String(20), nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f"<User {self.username} ({self.role})>"