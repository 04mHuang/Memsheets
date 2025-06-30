import os
import jwt
import datetime

def create_token(user_id):
   payload = {
      'user_id': user_id,
      'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)
   }
   return jwt.encode(payload, os.getenv('SECRET_KEY'), algorithm='HS256')

def verify_token(token):
   try:
      data = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
      return data['user_id']
   except:
    return None