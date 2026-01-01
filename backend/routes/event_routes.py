from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from database.models import Sheet, Event
from database.db import db
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta

event_bp = Blueprint("event_bp", __name__, url_prefix="/events")

# Fetch list of all events
@event_bp.route("/get-events", methods=["GET"])
@jwt_required()
def get_all_events():
    user_id = get_jwt_identity()
    if not user_id:
        return {"error": "Invalid token"}, 401

    sheets = Sheet.query.filter_by(user_id=user_id).all()
    sheet_ids = [sheet.id for sheet in sheets]

    events = Event.query.filter(Event.sheet_id.in_(sheet_ids)).all()
    events_data = []
    for e in events:
        sheet = Sheet.query.get(e.sheet_id)
        events_data.append({
            "id": e.id, 
            "sheet_id": e.sheet_id, 
            "summary": e.summary, 
            "description": e.description, 
            "start": e.start, 
            "end": e.end, 
            "recurrence": e.recurrence,
            "color": sheet.color if sheet else "#999999",
            "sheet_name": sheet.name if sheet else "Unknown Sheet",
            "group_id": sheet.groups[0].id if sheet and sheet.groups else None
        })
    return events_data, 200

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
    events_data = [{"id": e.id, "summary": e.summary, "description": e.description, "start": e.start, "end": e.end, "recurrence": e.recurrence} for e in events]
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
        event_date = data.get("event_date")
        timezone = data.get("timezone", "UTC")
        
        # Create all-day event with dateTime format for RRULE compatibility
        start_datetime = f"{event_date}T00:00:00"
        end_datetime = f"{event_date}T23:59:59"
        
        start_json = {
            "dateTime": start_datetime,
            "timeZone": timezone
        }
        end_json = {
            "dateTime": end_datetime,
            "timeZone": timezone
        }
        # Create RRULE for recurrence
        recurrence_type = data["recurrence"].upper()
        recurrence_rule = None
        
        if recurrence_type != "NONE":
            base_date = datetime.strptime(event_date, "%Y-%m-%d").date()
            dtstart = event_date.replace('-', '')
            
            if recurrence_type == "WEEKLY":
                until_date = base_date + timedelta(weeks=36)
            elif recurrence_type == "MONTHLY":
                until_date = base_date + relativedelta(months=12)
            elif recurrence_type == "YEARLY":
                until_date = base_date + relativedelta(years=1)
            
            until_str = until_date.strftime('%Y%m%d')
            bysetpos = ";BYMONTHDAY=-1" if recurrence_type == "MONTHLY" and base_date.day >= 29 else ""
            recurrence_rule = [f"RRULE:FREQ={recurrence_type}{bysetpos};DTSTART={dtstart}T000000;UNTIL={until_str}T235959"]

        new_event = Event(
            sheet_id=sheet_id,
            summary=data["summary"] if data["summary"].strip() else "Untitled Event",
            description=data["description"],
            start=start_json,
            end=end_json,
            recurrence=recurrence_rule,
        )
        db.session.add(new_event)
        db.session.commit()
        return {"message": "Successful event creation", "id": new_event.id}, 201
    except Exception as e:
        print(f"Error creating event: {e}")
        return {"error": "New event creation failed"}, 500