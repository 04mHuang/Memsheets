import os
from dotenv import load_dotenv
from flask_cors import CORS
from flask import Flask
from flask_jwt_extended import JWTManager
from datetime import timedelta

from database.db import db
from extensions import bcrypt

load_dotenv()

# Import blueprints after extensions to avoid circular imports
from routes.user_routes import user_bp
from routes.group_routes import group_bp
from routes.sheet_routes import sheet_bp

def create_app():
    # Setting up the app and connecting to database
    app = Flask(__name__)
    
    app.config["SQLALCHEMY_DATABASE_URI"] = (
        f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@localhost:5432/memsheets"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    
    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
    # False in development only
    app.config["JWT_COOKIE_SECURE"] = False
    # Access token cookie will be sent with every request
    app.config["JWT_ACCESS_COOKIE_PATH"] = "/"
    app.config["JWT_SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=10)
    JWTManager(app)

    bcrypt.init_app(app)
    CORS(app, supports_credentials=True)
    db.init_app(app)
    
    app.register_blueprint(user_bp)
    app.register_blueprint(group_bp)
    app.register_blueprint(sheet_bp)
    
    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
