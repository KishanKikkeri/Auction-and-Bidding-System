import jwt
import datetime
import bcrypt ,os
from config.db import db
from models.user import User  # Import User model
from dotenv import load_dotenv
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")

def login_user(email, password):
    """Authenticates a user and returns a JWT token with role"""
    try:
        
        user = User.query.filter_by(email=email).first()

        if user:
            
            if bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')): 
                
                token_payload = {
                    "user_id": user.id,
                    "email": user.email,
                    "role": user.role, 
                    "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
                }
                token = jwt.encode(token_payload, SECRET_KEY, algorithm="HS256")
                
                return {
                    "success": True,
                    "message": "Login successful",
                    "token": token,
                    "email": user.email,
                    "username": user.username,
                    "role": user.role,
                }
            else:
                return {"success": False, "message": "Invalid email or password"}
        else:
            return {"success": False, "message": "User not found"}

    except Exception as e:
        return {"success": False, "message": f"An error occurred: {str(e)}"}
