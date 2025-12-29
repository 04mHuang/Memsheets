from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from database.models import Sheet, Event
from database.db import db
from datetime import datetime

event_bp = Blueprint("event_bp", __name__, url_prefix="/events")

# Fetch list of all events
@event_bp.route("/", methods=["GET"])
@jwt_required()
def get_all_events():
    user_id = get_jwt_identity()
    if not user_id:
        return {"error": "Invalid token"}, 401

    sheets = Sheet.query.filter_by(user_id=user_id).all()
    sheet_ids = [sheet.id for sheet in sheets]

    events = Event.query.filter(Event.sheet_id.in_(sheet_ids)).all()
    events_data = [{"id": e.id, "sheet_id": e.sheet_id, "name": e.name, "description": e.description, "date": e.date.isoformat() if e.date else None, "reminder": e.reminder} for e in events]
    return {"events": events_data}, 200

# Fetch list of all events for a sheet
@event_bp.route("/<int:sheet_id>", methods=["GET"])
@jwt_required()
def get_events_by_sheet(sheet_id):
    user_id = get_jwt_identity()
    if not user_id:
        return {"error": "Invalid token"}, 401

    sheet = Sheet.query.filter_by(id=sheet_id, user_id=user_id).first()
    if not sheet:
        return {"error": "Sheet not found"}, 404

    events = Event.query.filter_by(sheet_id=sheet_id).all()
    events_data = [{"id": e.id, "name": e.name, "description": e.description, "date": e.date.isoformat() if e.date else None, "reminder": e.reminder} for e in events]
    return {"events": events_data}, 200
  
# Create a new event for a sheet
@event_bp.route("/<int:sheet_id>/create", methods=["POST"])
@jwt_required()
def create_event(sheet_id):
    try:
        user_id = get_jwt_identity()
        if not user_id:
            return {"error": "Invalid token"}, 401
        sheet = Sheet.query.filter_by(id=sheet_id, user_id=user_id).first()
        if not sheet:
            return {"error": "Sheet not found"}, 404
        data = request.json
        if not data or "name" not in data or "description" not in data:
            return {"error": "Invalid input"}, 400
        
        new_event = Event(
            sheet_id=sheet_id,
            name=data["name"] if data["name"].strip() else "Untitled Event",
            description=data["description"],
            date=data.get("date"),
            reminder=data.get("reminder", "none"),
        )
        db.session.add(new_event)
        db.session.commit()
        return {"message": "Successful event creation", "id": new_event.id}, 201
    except Exception as e:
        print(f"Error creating event: {e}")
        return {"error": "New event creation failed"}, 500