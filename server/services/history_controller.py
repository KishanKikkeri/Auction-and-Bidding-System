
from models.history import History

def get_purchase_history(user):
    try:
        user_id = user.id  
        
        
        history_records = History.query.filter_by(buyer_id=user_id).all()

        if not history_records:
            return {"message": "No purchase history found.", "success": True}

        history_data = [
            {
                "item_name": record.item_name,
                "final_price": record.final_price,
                "seller_id": record.seller_id,
                "purchase_date": record.purchase_date.strftime('%Y-%m-%d %H:%M:%S')
            }
            for record in history_records
        ]

        return {"message": "History fetched successfully", "success": True, "history": history_data}

    except Exception as e:
        return {"message": f"Error occurred: {e}", "success": False}