from .db import db
from datetime import date

# Association table for many-to-many relationship between sheets and groups
sheet_groups = db.Table('sheet_groups',
    db.Column('sheet_id', db.Integer, db.ForeignKey('sheets.id'), primary_key=True),
    db.Column('group_id', db.Integer, db.ForeignKey('groups.id'), primary_key=True)
)

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, index=True)
    email = db.Column(db.String(100), unique=True, nullable=False, index=True)
    password = db.Column(db.String(255), nullable=True)
    oauth_provider = db.Column(db.String(50), nullable=True)
    google_calendar_id = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    
    __table_args__ = (
        db.CheckConstraint(
            '(password IS NOT NULL AND oauth_provider IS NULL) OR (password IS NULL AND oauth_provider IS NOT NULL)',
            name='password_oauth_check'
        ),
    )

    def __repr__(self):
        return f'<User {self.username}>'
    
class Sheet(db.Model):
    __tablename__ = 'sheets'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    name = db.Column(db.String(200), default="Untitled Sheet")
    avatar = db.Column(db.String(200), default="/avatars/0_bunny.webp")
    color = db.Column(db.String(7), default='#999999')
    nickname = db.Column(db.Text)
    pronouns = db.Column(db.Text)
    birthday = db.Column(db.Date)
    likes = db.Column(db.Text)
    dislikes = db.Column(db.Text)
    allergies = db.Column(db.Text)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp(), index=True)
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    # Associates sheet with groups table
    groups = db.relationship('Group', secondary=sheet_groups, back_populates='sheets')
    
    def __repr__(self):
        return f'<Sheet {self.name}>'

class Group(db.Model):
    __tablename__ = 'groups'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), default="Untitled Group")
    color = db.Column(db.String(7), default='#999999')
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    # Associates group with sheets table
    sheets = db.relationship('Sheet', secondary=sheet_groups, back_populates='groups')
    
    def __repr__(self):
        return f'<Group {self.name}>'

class Event(db.Model):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)
    sheet_id = db.Column(db.Integer, db.ForeignKey('sheets.id'), nullable=False)
    # Same essential fields as Google Calendar API
    summary = db.Column(db.String(100), default="Untitled Event")
    description = db.Column(db.String(250), nullable=True)
    # {"dateTime": "2025-12-26T03:00:00Z", "timeZone": "America/New_York"} or { date": "2025-12-26" }
    start = db.Column(db.JSON, nullable=True)
    end = db.Column(db.JSON, nullable=True)
    # ["RRULE:FREQ=WEEKLY;UNTIL=20250701T170000Z"]
    recurrence = db.Column(db.JSON, nullable=True)  
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    def __repr__(self):
        return f'<Event {self.name}>'