#! /bin/bash

# Exporting the environment variables
set -a
source .env
set +a

# Use default port and hostname
sudo -u postgres psql \
  -v db_user="$DB_USER" \
  -v db_password="$DB_PASSWORD" \
  -v db_name="memsheets" \
  -f database/init.sql