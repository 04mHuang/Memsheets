from flask import Blueprint, request, jsonify, url_for
from flask_jwt_extended import create_access_token, set_access_cookies, unset_jwt_cookies
from database.models import User, Group
from extensions import bcrypt
from database.db import db
from dotenv import load_dotenv
from authlib.integrations.flask_client import OAuth
import os

user_bp = Blueprint("user_bp", __name__, url_prefix="/users")
load_dotenv()

oauth = OAuth()
google = oauth.register(
        name="google",
        client_id=os.getenv("GOOGLE_CLIENT_ID"),
        client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
        access_token_url="https://oauth2.googleapis.com/token",
        authorize_url="https://accounts.google.com/o/oauth2/auth",
        client_kwargs={
          "scope": "openid profile email",
          "prompt": "consent",
          "access_type": "offline",
        },
    )

@user_bp.route("/signup", methods=["POST"])
def signup():
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
        # UNIQUE constraint violation handling for email
        if "duplicate key value violates unique constraint" in str(e):
            return {"error": "Email in use"}, 400
        return {"error": "Registration failed"}, 500


@user_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        if not data or "email" not in data or "password" not in data:
            return {"error": "Invalid input"}, 400

        # Search for user with the inputted email
        user = User.query.filter_by(email=data["email"]).first()
        if user and bcrypt.check_password_hash(user.password, data["password"]):
            # Create and return JWT to client
            # Must be cast to string for flask-jwt-extended's function
            access_token = create_access_token(identity=str(user.id))
            response = jsonify({"message": "Successful login"})
            set_access_cookies(response, access_token)
            return response
        else:
            return {"error": "Invalid email or password"}, 401
    except Exception as e:
        print(f"Error logging in user: {e}")
        return {"error": "Login failed"}, 500
    

@user_bp.route("/login/google")
def google_login():
    return google.authorize_redirect(url_for("auth.authorize_google", _external=True))

@user_bp.route("/login/google/callback")
def authorize_google():
    try:
        token = google.authorize_access_token()
        user_info = google.get("userinfo").json()
        user = User.query.filter_by(email=user_info["email"]).first()
        if not user:
            # Create new user if not exists
            user = User(
                username=user_info["name"],
                email=user_info["email"],
            )
            db.session.add(user)
            db.session.commit()
            # Create default 'Miscellaneous' group for new user
            default_group = Group(
                user_id=user.id, name="Miscellaneous", color="#999999"
            )
            db.session.add(default_group)
            db.session.commit()
        access_token = create_access_token(identity=str(user.id))
        response = jsonify({"message": "Successful login"})
        set_access_cookies(response, access_token)
        return response
    except Exception as e:
        print(f"Error during Google OAuth: {e}")
        return {"error": "Google login failed"}, 500

@user_bp.route("/logout", methods=["POST"])
def logout():
  response = jsonify({"message": "Logout successful"})
  unset_jwt_cookies(response)
  return {"message": "Successful logout"}, 200