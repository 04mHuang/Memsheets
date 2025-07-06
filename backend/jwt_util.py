# This file contains jwt-related utility functions
import os
import jwt
import datetime

SECRET_KEY = os.getenv('SECRET_KEY')

# TODO: notify the user of the expiry
def create_token(user_id):
   payload = {
      'user_id': user_id,
      'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=12)
   }
   return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def verify_token(token):
   try:
      data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
      return data['user_id']
   except:
    return None

# Return user_id on success
def check_auth_header(auth):
  if not auth:
      return None
  # auth is currently Bearer <TOKEN>
  token = auth.split(' ')[1]
  user_id = verify_token(token)
  return user_id