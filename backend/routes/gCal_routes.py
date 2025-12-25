from flask import Blueprint, session, redirect, url_for
from flask_jwt_extended import get_jwt_identity, jwt_required
from database.models import User
from extensions import google

gCal_bp = Blueprint("gCal_bp", __name__, url_prefix="/cal")

@gCal_bp.route("/get-events", methods=["GET"])
@jwt_required()
def get_events():
  token = session.get("google_token", None)
  if not token:
    return redirect(url_for("user.login_google"))
  user_id = get_jwt_identity()
  if not user_id:
      return {"error": "Invalid token"}, 401
  user = User.query.filter_by(id=user_id).first()
  response = google.get(
    f"https://www.googleapis.com/calendar/v3/calendars/{user.google_calendar_id}/events",
    token=token
  )
  events = response.json().get("items", [])
  print(events)
  return events, 200