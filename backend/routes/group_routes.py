from flask import Blueprint, request

from jwt_util import check_auth_header
from database.models import Group, Sheet
from database.db import db

group_bp = Blueprint("group_bp", __name__, url_prefix="/groups")


# Fetch list of all groups
@group_bp.route("", methods=["GET"])
def get_groups():
    user_id = check_auth_header(request.headers.get("Authorization"))
    if not user_id:
        return {"error": "Invalid token"}, 401

    groups = Group.query.filter_by(user_id=user_id).all()
    groups_data = [{"id": g.id, "name": g.name, "color": g.color} for g in groups]
    return {"groups": groups_data}, 200


# Create a new group
@group_bp.route("/create", methods=["POST"])
def create_group():
    try:
        user_id = check_auth_header(request.headers.get("Authorization"))
        if not user_id:
            return {"error": "Invalid token"}, 401
        data = request.json
        if not data or "name" not in data:
            return {"error": "Invalid input"}, 400
        new_group = Group(
            user_id=user_id,
            name=data["name"] if data["name"].strip() else "Untitled Group",
            color=data["color"],
        )
        db.session.add(new_group)
        db.session.commit()
        # Add association between added existing sheets and new group
        for sheet in data["sheets"]:
            added_sheet = Sheet.query.filter_by(
                user_id=user_id, id=sheet["value"]
            ).first()
            if added_sheet:
                new_group.sheets.append(added_sheet)
        db.session.commit()
        return {"message": "Successful group creation", "id": new_group.id}, 201
    except Exception as e:
        print(f"Error creating group: {e}")
        return {"error": "New group creation failed"}, 500


# Fetch a specific group
@group_bp.route("/<int:group_id>", methods=["GET"])
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
        return {"name": group.name, "color": group.color, "sheets": sheets_data}, 200
    except Exception as e:
        print(f"Error fetching sheets: {e}")
        return {"error": "Fetching sheets failed"}, 500


# Edit a specific group
@group_bp.route("/edit/<int:group_id>", methods=["POST"])
def update_group(group_id):
    user_id = check_auth_header(request.headers.get("Authorization"))
    if not user_id:
        return {"error": "Invalid token"}, 401
    group = Group.query.filter_by(user_id=user_id, id=group_id).first()
    if not group:
        return {"error": "Group not found"}, 404
    data = request.json
    for key, value in data.items():
        # Group names must not be whitespace
        if key == "name" and not value.strip():
            setattr(group, key, "Untitled Group")
        elif key == "sheets":
            # Override associations
            sheet_ids = [sheet["value"] for sheet in value]
            sheets = Sheet.query.filter(Sheet.id.in_(sheet_ids)).all()
            group.sheets = sheets
            # Check for sheets that now belong to no group and add to default group Miscellaneous
            misc_group = Group.query.filter_by(
                user_id=user_id, name="Miscellaneous"
            ).first()
            orphaned_sheets = (
                Sheet.query.filter_by(user_id=user_id).filter(~Sheet.groups.any()).all()
            )
            for sheet in orphaned_sheets:
                misc_group.sheets.append(sheet)
        else:
            setattr(group, key, value)
    db.session.commit()
    return {"message": "Group updated successfully"}, 200


# Delete a specific group (through DeletionModal)
@group_bp.route("/delete/<int:group_id>/<int:del_sheets>", methods=["DELETE"])
def delete_group(group_id, del_sheets):
    user_id = check_auth_header(request.headers.get("Authorization"))
    if not user_id:
        return {"error": "Invalid token"}, 401
    group = Group.query.filter_by(user_id=user_id, id=group_id).first()
    if not group:
        return {"error": "Group not found"}, 404
    # If user opts to delete associated sheets, clear relevant association table entries
    if del_sheets:
        for sheet in group.sheets:
            sheet.groups.clear()
            db.session.delete(sheet)
    else:
        group.sheets.clear()
    db.session.delete(group)
    db.session.commit()
    return {"message": "Success"}, 200


# Search used in both search bar and create/edit groups list (through GroupTagsModal)
@group_bp.route("/search", methods=["GET"])
def search_groups_for_select():
    try:
        user_id = check_auth_header(request.headers.get("Authorization"))
        if not user_id:
            return {"error": "Invalid token"}, 401
        query = request.args.get("q", "").strip()
        if query:
            results = Group.query.filter(
                Group.user_id == user_id, Group.name.ilike(f"%{query}%")
            ).all()
            groups_data = [
                {"id": g.id, "name": g.name, "color": g.color} for g in results
            ]
            return {"results": groups_data}, 200
        return {"results": []}, 200
    except Exception as e:
        print(f"Error fetching sheets {e}")
        return {"error": "Fetching sheets"}


# Remove group from group list (through GroupTagsModal)
@group_bp.route("/remove/<int:sheet_id>/<int:group_id>", methods=["DELETE"])
def remove_group(sheet_id, group_id):
    try:
        user_id = check_auth_header(request.headers.get("Authorization"))
        if not user_id:
            return {"error": "Invalid token"}, 401
        sheet = Sheet.query.filter_by(user_id=user_id, id=sheet_id).first()
        if not sheet:
            return {"error": "Sheet not found"}, 404
        group = Group.query.filter_by(user_id=user_id, id=group_id).first()
        if not group:
            return {"error": "Group not found"}, 404
        sheet.groups.remove(group)
        if len(sheet.groups) == 0:
            # Check if sheet belongs to no group and add to default group Miscellaneous
            # Cannot delete a sheet through removing its groups
            misc_group = Group.query.filter_by(
                user_id=user_id, name="Miscellaneous"
            ).first()
            sheet.groups.append(misc_group)
        db.session.commit()
    except Exception as e:
        print(f"Error fetching sheets {e}")
        return {"error": "Fetching sheets"}
    return {"message": "Success"}, 200
