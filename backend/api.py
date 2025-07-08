import os
from dotenv import load_dotenv
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask import Flask, request

from database.db import db
from database.models import User, Group, Sheet
from jwt_util import create_token, check_auth_header
from sqlalchemy import or_

load_dotenv()

# Setting up the app and connecting to database
app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@localhost:5432/memsheets"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)


@app.route("/signup", methods=["POST"])
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


@app.route("/login", methods=["POST"])
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


@app.route("/groups", methods=["GET"])
def get_groups():
    user_id = check_auth_header(request.headers.get("Authorization"))
    if not user_id:
        return {"error": "Invalid token"}, 401

    groups = Group.query.filter_by(user_id=user_id).all()
    groups_data = [{"id": g.id, "name": g.name, "color": g.color} for g in groups]
    return {"groups": groups_data}, 200


@app.route("/new-group", methods=["POST"])
def create_group():
    try:
        user_id = check_auth_header(request.headers.get("Authorization"))
        if not user_id:
            return {"error": "Invalid token"}, 401
        data = request.json
        if not data or "name" not in data:
            return {"error": "Invalid input"}, 400
        new_group = Group(user_id=user_id, name=data["name"] if data["name"].strip() else "Untitled Group", color=data["color"])
        db.session.add(new_group)
        db.session.commit()
        return {"message": "Successful group creation"}, 201
    except Exception as e:
        print(f"Error creating group: {e}")
        return {"error": "New group creation failed"}, 500


@app.route("/groups/<int:group_id>", methods=["GET"])
def get_sheets_by_group(group_id):
    try:
        user_id = check_auth_header(request.headers.get("Authorization"))
        if not user_id:
            return {"error": "Invalid token"}, 401

        group = Group.query.filter_by(id=group_id, user_id=user_id).first()
        if not group:
            return {"error": "Group not found"}, 404

        # Get all sheets associated with this group
        sheets_data = [
            {"id": s.id, "name": s.name, "color": s.color} for s in group.sheets
        ]
        return {"sheets": sheets_data}, 200
    except Exception as e:
        print(f"Error fetching sheets: {e}")
        return {"error": "Fetching sheets failed"}, 500


@app.route("/new-sheet", methods=["POST"])
def create_sheet():
    try:
        user_id = check_auth_header(request.headers.get("Authorization"))
        if not user_id:
            return {"error": "Invalid token"}, 401
        data = request.json
        if not data or "name" not in data or "group_id" not in data:
            return {"error": "Invalid input"}, 400
        group_id = data["group_id"]
        new_sheet = Sheet(
            user_id=user_id,
            name=data["name"] if data["name"].strip() else "Untitled Sheet",
            color=data.get("color"),
            nickname=data.get("nickname") if data.get("nickname", "").strip() else "N/A",
            pronouns=data.get("pronouns") if data.get("pronouns", "").strip() else "N/A",
            birthday=data.get("birthday") if data.get("birthday", "").strip() else "",
            likes=data.get("likes") if data.get("likes", "").strip() else "N/A",
            dislikes=data.get("dislikes") if data.get("dislikes", "").strip() else "N/A",
            allergies=data.get("allergies") if data.get("allergies", "").strip() else "N/A",
            notes=data.get("notes") if data.get("notes", "").strip() else "N/A",
        )
        db.session.add(new_sheet)
        db.session.commit()
        # Add association between new sheet and correct group
        group = Group.query.get(group_id)
        new_sheet.groups.append(group)
        db.session.commit()
        return {"message": "Sheet created successfully"}, 201
    except Exception as e:
        print(f"Error creating sheet {e}")
        return {"error": "New sheet creation failed"}, 500


@app.route("/sheets/<int:sheet_id>", methods=["GET"])
def get_sheet(sheet_id):
    user_id = check_auth_header(request.headers.get("Authorization"))
    if not user_id:
        return {"error": "Invalid token"}, 401
    sheet = Sheet.query.filter_by(user_id=user_id, id=sheet_id).first()
    if not sheet:
        return {"error": "Sheet not found"}, 404
    sheet_data = [
        {
            "name": sheet.name,
            "color": sheet.color,
            "nickname": sheet.nickname,
            "pronouns": sheet.pronouns,
            "birthday": sheet.birthday.isoformat() if sheet.birthday else "",
            "likes": sheet.likes,
            "dislikes": sheet.dislikes,
            "allergies": sheet.allergies,
            "notes": sheet.notes,
        }
    ]
    return {"sheet": sheet_data}, 200


@app.route("/sheets/<int:sheet_id>/edit", methods=["POST"])
def update_sheet(sheet_id):
    user_id = check_auth_header(request.headers.get("Authorization"))
    if not user_id:
        return {"error": "Invalid token"}, 401
    sheet = Sheet.query.filter_by(user_id=user_id, id=sheet_id).first()
    if not sheet:
        return {"error": "Sheet not found"}, 404
    data = request.json
    for key, value in data.items():
        if key == "name" and not value.strip():
            setattr(sheet, key, "Untitled Sheet")
        elif key in ["nickname", "pronouns", "likes", "dislikes", "allergies", "notes"] and not value.strip():
            setattr(sheet, key, "N/A")
        elif key == "birthday" and not value.strip():
            setattr(sheet, key, None)
        else:
            setattr(sheet, key, value)
    db.session.commit()
    return {
        "message": "Sheet updated successfully",
        "sheet": {
            "name": sheet.name,
            "color": sheet.color,
            "nickname": sheet.nickname,
            "pronouns": sheet.pronouns,
            "birthday": sheet.birthday.isoformat() if sheet.birthday else "",
            "likes": sheet.likes,
            "dislikes": sheet.dislikes,
            "allergies": sheet.allergies,
            "notes": sheet.notes,
        },
    }, 200


@app.route("/search/groups", methods=["GET"])
def search_group():
  user_id = check_auth_header(request.headers.get("Authorization"))
  if not user_id:
      return {"error": "Invalid token"}, 401
  query = request.args.get('q', '').strip()
  if query:
    results = Group.query.filter(Group.user_id == user_id ,Group.name.ilike(f"%{query}%")).all()
    groups_data = [{"id": g.id, "name": g.name, "color": g.color} for g in results]
    return { "results": groups_data }, 200
  return { "results": [] }, 200


@app.route("/search/sheets", methods=["GET"])
def search_sheet():
  user_id = check_auth_header(request.headers.get("Authorization"))
  if not user_id:
      return {"error": "Invalid token"}, 401
  query = request.args.get('q', '').strip()
  if query:
      search_fields = ['name', 'nickname', 'pronouns', 'likes', 'dislikes', 'allergies', 'notes']
      filters = [getattr(Sheet, field).ilike(f'%{query}%') for field in search_fields]
      results = Sheet.query.filter(Sheet.user_id == user_id, or_(*filters)).all()
      sheets_data = [{"id": s.id, "name": s.name, "color": s.color} for s in results]
      return { "results": sheets_data }, 200
  return { "results": [] }, 200


if __name__ == "__main__":
    app.run(debug=True)
