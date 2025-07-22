from flask import Blueprint, request
from jwt_util import create_token
from database.models import User, Group
from extensions import bcrypt
from database.db import db


user_bp = Blueprint("user_bp", __name__)

@user_bp.route("/signup", methods=["POST"])
def create_user():
    try:
        data = request.json
        if (
            not data
            or "username" not in data
            or "email" not in data
            or "password" not in data
        ):
            return {"error": "Invalid input"}, 400
        # flask_bcrypt automatically salts and hashes
        hashed_password = bcrypt.generate_password_hash(data["password"]).decode(
            "utf-8"
        )
        # Create a new user using models.py
        new_user = User(
            username=data["username"], email=data["email"], password=hashed_password
        )
        db.session.add(new_user)
        db.session.commit()

        # Create default 'Miscellaneous' group for new user
        default_group = Group(
            user_id=new_user.id, name="Miscellaneous", color="#999999"
        )
        db.session.add(default_group)
        db.session.commit()

        return {"message": "User created successfully"}, 201
    except Exception as e:
        print(f"Error creating user: {e}")
        # UNIQUE constraint violation handling for email
        if "duplicate key value violates unique constraint" in str(e):
            return {"error": "Email in use"}, 400
        return {"error": "Registration failed"}, 500


@user_bp.route("/login", methods=["POST"])
def login_user():
    try:
        data = request.json
        if not data or "email" not in data or "password" not in data:
            return {"error": "Invalid input"}, 400

        # Search for user with the inputted email
        user = User.query.filter_by(email=data["email"]).first()
        if user and bcrypt.check_password_hash(user.password, data["password"]):
            # Create and return JWT to client
            token = create_token(user.id)
            return {"token": token}, 200
        else:
            return {"error": "Invalid email or password"}, 401
    except Exception as e:
        print(f"Error logging in user: {e}")
        return {"error": "Login failed"}, 500