import os
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask import Flask, request
from database.db import db
from database.models import User

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@localhost:5432/memsheets"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

@app.route('/signup', methods=['POST'])
def create_user():
    try:
      data = request.json
      if not data or "username" not in data or "email" not in data or "password" not in data:
        return {'error': 'Invalid input'}, 400
      new_user = User(
          username=data['username'],
          email=data['email'],
          password=data['password']
      )
      print(f"Creating: {new_user.username}, {new_user.email}")
      db.session.add(new_user)
      db.session.commit()
      return {'message': 'User created successfully'}, 201
    except Exception as e:
      print(f"Error creating user: {e}")
      return {'error': str(e)}, 500

if __name__ == '__main__':
    app.run(debug=True)