from flask import Blueprint, session, redirect, url_for
from extensions import google

gCal_bp = Blueprint("gCal_bp", __name__, url_prefix="/cal")

@gCal_bp.route("/get-events", methods=["GET"])
def get_events():
  token = session.get("google_token", None)
  if not token:
    return redirect(url_for("user.login_google"))
  response = google.get(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    token=token
  )
  return response.json()