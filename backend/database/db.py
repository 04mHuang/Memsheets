# Shared instance of SQLAlchemy for backend/api.py and models.py

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()