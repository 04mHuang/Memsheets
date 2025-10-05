import os
import psycopg2
from dotenv import load_dotenv
from flask import Flask

from .db import db
# models not used but needed for table creation
from .models import User, Group, Sheet, Event

load_dotenv()

DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_NAME = 'memsheets'
DB_HOST = 'localhost'
DB_PORT = 5432

def create_database():
  try:
    # Connect to default postgres database to create new database
    conn = psycopg2.connect(
      dbname='postgres',
      user=DB_USER,
      password=DB_PASSWORD,
      host=DB_HOST,
      port=DB_PORT
    )
    conn.autocommit = True
    cursor = conn.cursor()
    
    # Check if database exists
    cursor.execute('SELECT 1 FROM pg_database WHERE datname = %s', (DB_NAME,))
    db_exists = cursor.fetchone()
    if not db_exists:
      cursor.execute(f'CREATE DATABASE {DB_NAME} OWNER {DB_USER}')
      print(f'Database {DB_NAME} created and owned by {DB_USER}')
    else:
      print(f'Database {DB_NAME} already exists')
      
  except Exception as e:
    print(f'Error creating database: {e}')
  finally:
    cursor.close()
    conn.close()

if __name__ == '__main__':
  create_database()