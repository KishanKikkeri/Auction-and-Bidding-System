from flask import Flask
from flask_cors import CORS
from config.db import init_db
from routes import auth, profile, items, wallet , bids , history

def create_app(config=None):
    app = Flask(__name__)

    if config:
        app.config.from_object(config)

    init_db(app)

    CORS(app, resources={
        r"/*": {
            "origins": ["*"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "Content_Type"],
            "supports_credentials": True
        }
    })



    app.register_blueprint(auth, url_prefix='/auth')
    app.register_blueprint(profile, url_prefix='/profile')
    app.register_blueprint(items, url_prefix="/items")
    app.register_blueprint(wallet, url_prefix="/wallet")
    app.register_blueprint(bids, url_prefix="/bids")
    app.register_blueprint(history, url_prefix="/history")
   

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True) 