# Initialize bcrypt and google in its own module 
# to prevent circular dependency between api.py and the routes
from flask_bcrypt import Bcrypt
from authlib.integrations.flask_client import OAuth
import os
from dotenv import load_dotenv

load_dotenv()

bcrypt = Bcrypt()
oauth = OAuth()
google = oauth.register(
        name="google",
        client_id=os.getenv("GOOGLE_CLIENT_ID"),
        client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
        # Automatically configures Google's OAuth 2.0 endpoints
        server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
        client_kwargs={
          "scope": "openid profile email https://www.googleapis.com/auth/calendar",
        },
    )