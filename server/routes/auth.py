from flask import Blueprint, request, jsonify
from auth.login import login_user
from auth.register import register_user

auth = Blueprint("auth", __name__)

@auth.route('/login', methods=["POST"])
def login():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"success": False, "message": "Email and password are required"}), 400
        
        result = login_user(email, password)
        
        if not result.get("success", False):
            return jsonify(result), 401  # Unauthorized
        
        return jsonify(result), 200  # OK

    except Exception as e:
        print(f"Login Error: {e}")  # Debugging logs
        return jsonify({"success": False, "message": "An unexpected error occurred"}), 500


@auth.route('/register', methods=["POST"])
def register():
    try:
        data = request.json
        email = data.get("email")
        username = data.get("username")
        password = data.get("password")

        if not email or not username or not password:
            return jsonify({"success": False, "message": "All fields must be filled"}), 400
        
       
        if len(password) < 8:
            return jsonify({"success": False, "message": "Password must be at least 8 characters long"}), 400

        result = register_user(username, email, password)
        
        if not result.get("success", False):
            return jsonify(result), 403 
        
        return jsonify(result), 201  

    except Exception as e:
        print(f"Register Error: {e}")  # Debugging logs
        return jsonify({"success": False, "message": "An unexpected error occurred"}), 500
