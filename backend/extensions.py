# Initialize bcrypt in its own module 
# to prevent circular dependency between api.py and the routes
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()