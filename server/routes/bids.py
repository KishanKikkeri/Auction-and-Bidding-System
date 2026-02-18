from flask import jsonify, request , Blueprint
from pymysql import NULL
from config.db import db
from models import Bids, Item, User , History
from datetime import datetime
from middlewares import token_required
import logging
from services import deduct_wallet , add_wallet
bids = Blueprint("bids" , __name__)

@bids.route("/place_bid", methods=["POST"])
@token_required
def place_bid(user):
    """Handles new bids via HTTP request."""
    data = request.json
    item_id = data.get("item_id")
    bid_amount = data.get("bid_amount")

    
    item = Item.query.get(item_id)
    if not item or item.auction_end < datetime.utcnow():
        return jsonify({"message": "Auction ended or item not found", "success": False}), 400

    if bid_amount <= item.current_price:
        return jsonify({"message": "Bid must be higher than the current price", "success": False}), 400

   
    user = User.query.get(user.id)
    if not user:
        return jsonify({"message": "User not found", "success": False}), 400

    if float(bid_amount) > float(user.wallet):
        return jsonify({"message": "Insufficient balance", "success": False}), 200

    if user.id == item.seller_id:
        return jsonify({"message": "Can't bid on item you have listed", "success": False}), 200

    
    prev_bid = Bids.query.filter_by(item_id=item.id).order_by(Bids.current_price.desc()).first()
    if prev_bid:
        prev_bid.winner_id = None  

    
    existing_bid = Bids.query.filter_by(item_id=item_id, user_id=user.id).first()
    if existing_bid:
        db.session.delete(existing_bid)

   
    new_bid = Bids(
        item_id=item_id,
        user_id=user.id,
        username=user.username,
        user_email=user.email,
        current_price=bid_amount,
        created_at=datetime.utcnow(),
        winner_id=user.id 
    )
    db.session.add(new_bid)

    
    item.current_price = bid_amount
    db.session.commit()

    return jsonify({
        "message": "Bid placed successfully",
        "item_id": item_id,
        "current_price": bid_amount,
        "bidder": user.username
    }), 200

@bids.route("/item/<int:item_id>", methods=["GET"])
@token_required
def get_item(user ,item_id):
    item = Item.query.get(item_id)
    if not item:
        return jsonify({"message": "Item not found"}), 404

    winner = None
    if item.auction_end < datetime.utcnow():
        highest_bid = Bids.query.filter_by(item_id=item_id).order_by(Bids.current_price.desc()).first()
        winner = True if highest_bid and highest_bid.winner_id == user.id else False
    return jsonify({
        "id": item.id,
        "title": item.title,
        "image_url": item.image_url,
        "current_price": item.current_price,
        "auction_end": item.auction_end,
        "winner": winner
    })

@bids.route("/get-bidders/<int:item_id>", methods=["GET"])
@token_required
def get_bidders(user, item_id):
    """Fetch all bidders for a given item."""
    try:
        
        if not user:
            return jsonify({"message": "User is not authorized"}), 401
        

        bid_list = Bids.query.filter_by(item_id=item_id).order_by(Bids.created_at.desc()).all()
        
        if not bid_list:
            return jsonify({"success" : False,"message": "No bids found for this item", "bids": []}), 200

      
        bid_data = [
            {
                "id": bid.bid_id,
                "username": bid.username,
                "amount": bid.current_price,
                "bid_time": bid.created_at
            }
            for bid in bid_list
        ]
        logging.info(bid_data)

        return jsonify({"success": True, "bids": bid_data , "message":"Fetch successfull"}), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500


@bids.route("/complete-purchase" , methods=["POST"])
@token_required
def complete_item_purchase(user):
    try:
        data = request.get_json()
        item_id = data.get('item_id')
        price = data.get('current_price')
        og_price = float(price) + 20
        bid_item = Bids.query.filter_by(item_id=item_id , user_id = user.id).first()

        if not user:
            logging.info("error in user")
            return jsonify({"message": "User is not authorized"}), 401
        
        item = Item.query.filter_by(id=item_id).first()

        if not item :
            logging.info("error in item")
            return jsonify({"message": "No item found"}), 400
        
        item.status = "Order Placed"

        deducted = deduct_wallet(user ,og_price )
        if deducted["success"] == False:
            logging.info("error in deducted")
            return jsonify({"message": "Error occured while deducting from wallet"}), 400
        
        added = add_wallet(item.seller_id , price)
        if added["success"] == False:
            logging.info("error in added")
            return jsonify({"message": "Error  occured"}), 400
        print(f"Buyer ID: {user.id}, Seller ID: {item.seller_id}, Item ID: {item.id}, Item Name: {item.title}, Price: {og_price}")

        new_history = History(
            buyer_id=user.id,
            seller_id=item.seller_id,
            item_id=item.id,
            item_name=item.title,
            final_price=og_price,

        )
        db.session.add(new_history)
        db.session.commit()
       
        return jsonify({"message":"Order placed" , "success":True}),200
            
    except Exception as e:
        logging.error(e)
        logging.info(e)
        return jsonify({f"message":"Error occured {e}" , "success":False}),500
    

@bids.route("/get-bids", methods=["GET"])
@token_required
def get_bids(user):
    try:
        if not user:
            return jsonify({"message": "User is not authorized"}), 401

        bids = db.session.query(Bids, Item.title).join(Item, Bids.item_id == Item.id).filter(Bids.user_id == user.id).all()

        if not bids:
            return jsonify({"message": "No bids to show", "success": True}), 200

        bid_data = [
            {
                "id": bid.bid_id,
                "item_name": item_title, 
                "amount": bid.current_price,
                "bid_time": bid.created_at,
            }
            for bid, item_title in bids  
        ]

        return jsonify({"message": "Fetch successful", "success": True, "bids": bid_data}), 200

    except Exception as e:
        return jsonify({"message": f'Error occurred: {e}', "success": False}), 500
