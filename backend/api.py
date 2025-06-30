import os
from dotenv import load_dotenv
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask import Flask, request

from database.db import db
from database.models import User, Group
from jwt_util import create_token, check_auth_header

load_dotenv()

# Setting up the app and connecting to database
app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@localhost:5432/memsheets'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

@app.route('/signup', methods=['POST'])
def create_user():
    try:
      data = request.json
      if not data or 'username' not in data or 'email' not in data or 'password' not in data:
        return {'error': 'Invalid input'}, 400
      # flask_bcrypt automatically salts and hashes
      hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
      # Create a new user using models.py
      new_user = User(
          username=data['username'],
          email=data['email'],
          password=hashed_password
      )
      db.session.add(new_user)
      db.session.commit()
      return {'message': 'User created successfully'}, 201
    except Exception as e:
      print(f'Error creating user: {e}')
      # UNIQUE constraint violation handling for email
      if 'duplicate key value violates unique constraint' in str(e):
        return {'error': 'Email in use'}, 400
      return {'error': 'Registration failed'}, 500

@app.route('/login', methods=['POST'])
def login_user():
    try:
        data = request.json
        if not data or 'email' not in data or 'password' not in data:
            return {'error': 'Invalid input'}, 400
        
        # Search for user with the inputted email
        user = User.query.filter_by(email=data['email']).first()
        if user and bcrypt.check_password_hash(user.password, data['password']):
            # Create and return JWT to client
            token = create_token(user.id)
            return {'token': token}, 200
        else:
            return {'error': 'Invalid email or password'}, 401
    except Exception as e:
        print(f'Error logging in user: {e}')
        return {'error': 'Login failed'}, 500

@app.route('/groups', methods=['GET'])
def get_groups():
  auth = request.headers.get('Authorization')
  user_id = check_auth_header(auth)
  if not user_id:
     return { 'error': 'Invalid token'}, 401
  return { 'message': 'success' }, 200

@app.route('/new-group', methods=['POST'])
def create_group():
    try:
      data = request.json
      auth = request.headers.get('Authorization')
      user_id = check_auth_header(auth)
      if not user_id:
        return { 'error': 'Invalid token'}, 401
      new_group = Group(
         user_id=user_id,
         name=data['name'],
         color=data['color']
      )
      db.session.add(new_group)
      db.session.commit()
      return {'message': 'Successful group creation'}, 201
    except Exception as e:
      print(f'Error creating group: {e}')
      return {'error': 'New group creation failed'}, 500


if __name__ == '__main__':
    app.run(debug=True)