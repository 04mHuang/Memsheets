from flask import Blueprint, request
from sqlalchemy import or_

from jwt_util import check_auth_header
from database.models import Group, Sheet, sheet_groups
from database.db import db

sheet_bp = Blueprint("sheet_bp", __name__, url_prefix="/sheets")


@sheet_bp.route("/new", methods=["POST"])
def create_sheet():
    try:
        user_id = check_auth_header(request.headers.get("Authorization"))
        if not user_id:
            return {"error": "Invalid token"}, 401
        data = request.json
        if not data or "name" not in data or "group_id" not in data:
            return {"error": "Invalid input"}, 400
        group_id = data["group_id"]
        # Create a new sheet with default inputs if field is empty
        new_sheet = Sheet(
            user_id=user_id,
            name=data["name"] if data["name"].strip() else "Untitled Sheet",
            color=data.get("color"),
            nickname=(
                data.get("nickname") if data.get("nickname", "").strip() else "N/A"
            ),
            pronouns=(
                data.get("pronouns") if data.get("pronouns", "").strip() else "N/A"
            ),
            birthday=data.get("birthday") if data.get("birthday", "").strip() else "",
            likes=data.get("likes") if data.get("likes", "").strip() else "N/A",
            dislikes=(
                data.get("dislikes") if data.get("dislikes", "").strip() else "N/A"
            ),
            allergies=(
                data.get("allergies") if data.get("allergies", "").strip() else "N/A"
            ),
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


@sheet_bp.route("/<int:sheet_id>", methods=["GET"])
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
    groups_data = []
    for group in sheet.groups:
        if group.user_id == user_id:
            groups_data.append(
                {"id": group.id, "name": group.name, "color": group.color}
            )
    return {"sheet": sheet_data, "groups": groups_data}, 200


@sheet_bp.route("/<int:sheet_id>/edit", methods=["POST"])
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
        elif (
            key in ["nickname", "pronouns", "likes", "dislikes", "allergies", "notes"]
            and not value.strip()
        ):
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


@sheet_bp.route("/<int:sheet_id>/edit/group-list", methods=["POST"])
def update_group_list(sheet_id):
    user_id = check_auth_header(request.headers.get("Authorization"))
    if not user_id:
        return {"error": "Invalid token"}, 401
    sheet = Sheet.query.filter_by(user_id=user_id, id=sheet_id).first()
    if not sheet:
        return {"error": "Sheet not found"}, 404
    data = request.json
    # Override associations
    group_ids = [item['id'] for item in data]
    groups = Group.query.filter(Group.user_id == user_id, Group.id.in_(group_ids)).all()
    sheet.groups = groups
    db.session.commit()
    return {"message": "Success"}, 200


@sheet_bp.route(
    "/delete/<int:group_id>/<int:sheet_id>/<int:del_sheet>", methods=["DELETE"]
)
def delete_sheet(group_id, sheet_id, del_sheet):
    user_id = check_auth_header(request.headers.get("Authorization"))
    if not user_id:
        return {"error": "Invalid token"}, 401
    sheet = Sheet.query.filter_by(user_id=user_id, id=sheet_id).first()
    if not sheet:
        return {"error": "Sheet not found"}, 404
    # If user opts to delete all instances of the sheets, clear associations
    if del_sheet:
        sheet.groups.clear()
        db.session.delete(sheet)
    else:
        group = Group.query.filter_by(user_id=user_id, id=group_id).first()
        sheet.groups.remove(group)
    db.session.commit()
    return {"message": "Success"}, 200


@sheet_bp.route("/search/<int:group_id>", methods=["GET"])
def search_sheet(group_id):
    user_id = check_auth_header(request.headers.get("Authorization"))
    if not user_id:
        return {"error": "Invalid token"}, 401
    query = request.args.get("q", "").strip()
    if query:
        search_fields = [
            "name",
            "nickname",
            "pronouns",
            "likes",
            "dislikes",
            "allergies",
            "notes",
        ]
        filters = [getattr(Sheet, field).ilike(f"%{query}%") for field in search_fields]
        # Filter out for sheets in current group that match the query
        results = (
            Sheet.query.join(sheet_groups, Sheet.id == sheet_groups.c.sheet_id)
            .join(Group, sheet_groups.c.group_id == Group.id)
            .filter(Group.id == group_id, Group.user_id == user_id, or_(*filters))
            .all()
        )
        sheets_data = [{"id": s.id, "name": s.name, "color": s.color} for s in results]
        return {"results": sheets_data}, 200
    return {"results": []}, 200
