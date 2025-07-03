#! /bin/bash

# Exporting the environment variables
set -a
source .env
set +a

# Some users may not have a password set for superuser postgres
sudo -u postgres psql \
  -v db_user="$DB_USER" \
  -v db_password="$DB_PASSWORD" \
  -f database/init.sql

python3 -m database.db_init