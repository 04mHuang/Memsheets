from .db import db

# Association table for many-to-many relationship between sheets and groups
sheet_groups = db.Table('sheet_groups',
    db.Column('sheet_id', db.Integer, db.ForeignKey('sheets.id'), primary_key=True),
    db.Column('group_id', db.Integer, db.ForeignKey('groups.id'), primary_key=True)
)

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    def __repr__(self):
        return f'<User {self.username}>'
    
class Sheet(db.Model):
    __tablename__ = 'sheets'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    # color = db.Column(db.String(7), nullable=False)
    nickname = db.Column(db.Text)
    pronouns = db.Column(db.Text)
    birthday = db.Column(db.Date)
    likes = db.Column(db.Text)
    dislikes = db.Column(db.Text)
    allergies = db.Column(db.Text)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    # Associates sheet with groups table
    groups = db.relationship('Group', secondary=sheet_groups, back_populates='sheets')
    
    def __repr__(self):
        return f'<Sheet {self.title}>'

class Group(db.Model):
    __tablename__ = 'groups'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    color = db.Column(db.String(7), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    # Associates group with sheets table
    sheets = db.relationship('Sheet', secondary=sheet_groups, back_populates='groups')
    
    def __repr__(self):
        return f'<Group {self.name}>'