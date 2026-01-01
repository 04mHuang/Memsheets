from flask import Blueprint, session, redirect, url_for, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from database.models import User, Sheet, Event
from database.db import db
from extensions import google

gCal_bp = Blueprint("gCal_bp", __name__, url_prefix="/cal")

# Fetch list of all events
# Using Google Calendar API since user can create events directly in Google Calendar
# Adding sheet association (sheet_id, group_id, etc.) to response using Memsheets database
@gCal_bp.route("/get-events", methods=["GET"])
@jwt_required()
def get_all_events():
  token = session.get("google_token", None)
  if not token:
    return redirect(url_for("user.login_google"))
  user_id = get_jwt_identity()
  if not user_id:
      return {"error": "Invalid token"}, 401
  user = User.query.filter_by(id=user_id).first()
  response = google.get(
    f"https://www.googleapis.com/calendar/v3/calendars/{user.google_calendar_id}/events?timeMin=2020-01-01T00:00:00Z&singleEvents=true&orderBy=startTime",
    token=token
  )
  events = response.json().get("items", [])
  
  # Add sheet information to events
  events_data = []
  for event in events:
    # Look up sheet association from database
    db_event = Event.query.filter_by(
      google_event_id=event.get('id')
    ).first()
    
    sheet = None
    if db_event:
      sheet = Sheet.query.get(db_event.sheet_id)
    e_data = {
      "id": event.get('id'),
      "summary": event.get('summary'),
      "description": event.get('description', ''),
      "start": event.get('start'),
      "end": event.get('end'),
      "recurrence": event.get('recurrence'),
      "color": sheet.color if sheet else "#999999",
      "sheet_name": sheet.name if sheet else None,
      "sheet_id": sheet.id if sheet else None,
      "group_id": sheet.groups[0].id if sheet and sheet.groups else None
    }
    events_data.append(e_data)
  
  return events_data, 200

@gCal_bp.route("/<int:sheet_id>/create", methods=["POST"])
@jwt_required()
def create_google_event(sheet_id):
  try:
    token = session.get("google_token", None)
    if not token:
      return redirect(url_for("user.login_google"))
    
    user_id = get_jwt_identity()
    if not user_id:
      return {"error": "Invalid token"}, 401
    
    sheet = Sheet.query.filter_by(id=sheet_id, user_id=user_id).first()
    if not sheet:
      return {"error": "Sheet not found"}, 404
    
    user = User.query.filter_by(id=user_id).first()
    data = request.json
    event_date = data.get("event_date")
    
    # Create Google Calendar event
    event_body = {
      "summary": data["summary"] if data["summary"].strip() else "Untitled Event",
      "description": data["description"],
      "start": {
        "date": event_date
      },
      "end": {
        "date": event_date
      }
    }
    
    # Add recurrence if specified
    recurrence_type = data["recurrence"].upper()
    if recurrence_type != "NONE":
      event_body["recurrence"] = [f"RRULE:FREQ={recurrence_type}"]
    
    response = google.post(
      f"https://www.googleapis.com/calendar/v3/calendars/{user.google_calendar_id}/events",
      json=event_body,
      token=token
    )
    
    if response.status_code == 200:
      # Save association to database
      google_event_id = response.json().get('id')
      event_record = Event(
        google_event_id=google_event_id,
        sheet_id=sheet_id,
        summary=data["summary"] if data["summary"].strip() else "Untitled Event"
      )
      db.session.add(event_record)
      db.session.commit()
      
      return {"message": "Google Calendar event created successfully"}, 201
    else:
      return {"error": "Failed to create Google Calendar event"}, 500
      
  except Exception as e:
    print(f"Error creating Google Calendar event: {e}")
    return {"error": "Event creation failed"}, 500

@gCal_bp.route("/<int:sheet_id>", methods=["GET"])
@jwt_required()
def get_events_by_sheet(sheet_id):
  try:
    token = session.get("google_token", None)
    if not token:
      return redirect(url_for("user.login_google"))
    user_id = get_jwt_identity()
    if not user_id:
      return {"error": "Invalid token"}, 401
    
    sheet = Sheet.query.filter_by(id=sheet_id, user_id=user_id).first()
    if not sheet:
      return {"error": "Sheet not found"}, 404
    
    # Get Google Calendar event IDs associated with this sheet
    db_events = Event.query.filter_by(
      sheet_id=sheet_id
    ).filter(Event.google_event_id.isnot(None)).all()
    
    if not db_events:
      return {"events": []}, 200
    
    user = User.query.filter_by(id=user_id).first()
    events_data = []
    
    for db_event in db_events:
      # Fetch event from Google Calendar
      response = google.get(
        f"https://www.googleapis.com/calendar/v3/calendars/{user.google_calendar_id}/events/{db_event.google_event_id}",
        token=token
      )
      
      if response.status_code == 200:
        event = response.json()
        events_data.append({
          "id": event.get('id'),
          "summary": event.get('summary'),
          "description": event.get('description', ''),
          "start": event.get('start'),
          "end": event.get('end'),
          "recurrence": event.get('recurrence')
        })
    
    return {"events": events_data}, 200
    
  except Exception as e:
    print(f"Error fetching sheet events: {e}")
    return {"error": "Failed to fetch events"}, 500