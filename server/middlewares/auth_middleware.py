from flask import request, jsonify
import jwt, os
from functools import wraps
from dotenv import load_dotenv
from models.user import User  

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")

        if not token:
            return jsonify({"message": "Token is missing", "success": False}), 401

        try:
            token = token.split(" ")[1]  # Extract actual token (Bearer token)
            decoded_data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            user_id = decoded_data.get("user_id")

            if not user_id:
                return jsonify({"message": "Invalid token", "success": False}), 401

            user = User.query.get(user_id)
            if not user:
                return jsonify({"message": "User not found", "success": False}), 401

        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expired", "success": False}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token", "success": False}), 401

        return f(user, *args, **kwargs)  # ✅ Pass `user` as an argument

    return decorated
