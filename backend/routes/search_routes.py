from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from database.models import Sheet, Group, Event
from database.db import db

search_bp = Blueprint("search_bp", __name__, url_prefix="/search")

@search_bp.route("", methods=["GET"])
@jwt_required()
def global_search():
    user_id = get_jwt_identity()
    if not user_id:
        return {"error": "Invalid token"}, 401
    
    query = request.args.get("q", "").strip()
    if not query:
        return {"results": {"groups": [], "sheets": [], "events": []}}, 200
    
    # Search groups
    groups = Group.query.filter(
        Group.user_id == user_id,
        Group.name.ilike(f"%{query}%")
    ).all()
    
    # Search sheets
    sheets = Sheet.query.filter(
        Sheet.user_id == user_id,
        Sheet.name.ilike(f"%{query}%")
    ).all()
    
    # Search events (events in database includes summary field for local and Google Calendar events)
    sheet_ids = [sheet.id for sheet in Sheet.query.filter_by(user_id=user_id).all()]
    events = Event.query.filter(
        Event.sheet_id.in_(sheet_ids),
        Event.summary.ilike(f"%{query}%"),
        Event.summary.isnot(None)
    ).all()
    
    results = {
        "groups": [{
            "id": g.id, 
            "name": g.name, 
            "color": g.color,
            "sheet_count": len(g.sheets)
        } for g in groups],
        "sheets": [{
            "id": s.id, 
            "name": s.name, 
            "color": s.color,
            "group_names": [group.name for group in s.groups]
        } for s in sheets],
        "events": [{
            "id": e.id, 
            "summary": e.summary, 
            "sheet_id": e.sheet_id,
            "group_id": Sheet.query.get(e.sheet_id).groups[0].id if Sheet.query.get(e.sheet_id) and Sheet.query.get(e.sheet_id).groups else None,
            "sheet_name": Sheet.query.get(e.sheet_id).name if Sheet.query.get(e.sheet_id) else None,
            "sheet_color": Sheet.query.get(e.sheet_id).color if Sheet.query.get(e.sheet_id) else "#999999"
        } for e in events]
    }
    
    return {"results": results}, 200