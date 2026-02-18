import os
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()

def init_db(app):
    DB_USER = os.getenv('DB_USER')
    DB_PASSWORD = os.getenv('DB_PASSWORD')
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_NAME = os.getenv('DB_NAME')

    if not all([DB_USER, DB_PASSWORD, DB_HOST, DB_NAME]):
        raise ValueError("One or more DB environment variables are missing")

    db_url = f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"

    app.config['SQLALCHEMY_DATABASE_URI'] = db_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    migrate.init_app(app, db)
