from config.db import db
from sqlalchemy import Column, Integer, String


class Admin(db.Model):
    __tablename__ = "admin"

    admin_id= Column(Integer, primary_key=True, autoincrement=True)
    user_email = Column(String(100), nullable=False)  
    username = Column(String(50), nullable=False) 
    