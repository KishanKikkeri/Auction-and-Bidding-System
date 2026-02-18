import jwt ,os
import datetime
import bcrypt
from config.db import db
from models.user import User  
from dotenv import load_dotenv
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")


def register_user(username, email, password, role="user"):  
    """Registers a new user and returns a JWT token"""
    try:
        
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            if existing_user.email == email or existing_user.username == username:
                return {"success": False, "message": "Email or username already in use"}
       
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        new_user = User(username=username, email=email, password_hash=hashed_password, role=role, wallet=0.0)

        print(new_user)
       
        db.session.add(new_user)
        db.session.commit()

        token_payload = {
            "user_id": new_user.id,
            "email": email,
            "role": role,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }
        token = jwt.encode(token_payload, SECRET_KEY, algorithm="HS256")

        return {
            "success": True,
            "message": "User registered successfully",
            "token": token,
            "email": email,
            "username": username,
            "role": role,
            "wallet": new_user.wallet or 0,
        }

    except Exception as e:
        db.session.rollback() 
        return {"success": False, "message": f"An error occurred: {str(e)}"}
