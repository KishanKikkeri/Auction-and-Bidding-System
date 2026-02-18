from flask import Blueprint , jsonify
from middlewares import token_required
from services import get_purchase_history
history = Blueprint("history" , __name__)

@history.route("/get-history")
@token_required
def get_history(user):
    try:
        if not user:
            return jsonify({"message" : "User not authorized" , "success" : False}),401
        
        result = get_purchase_history(user)
        if not result:
            return jsonify({"message" : "No purchases so far" , "success" : True}),200
        
        return jsonify(result),200
    
    except Exception as e:
        return jsonify({"message" : f'error {e}' , "success" : False}), 500