# Memsheets

### You will need 1 terminal for the server and 1 terminal for the client

## Server Setup
In one terminal, navigate to backend folder: 
```
cd backend
```

Create a .env file such as:
```
DB_USER=<INSERT ANYTHING>
DB_PASSWORD=<INSERT ANYTHING>
SECRET_KEY=<INSERT ANYTHING>
```
Set up virtual environment and run server:
```
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
Set up the database:
```
chmod +x database/init_wrapper.sh
./database/init_wrapper.sh
```
Run server:
```
flask run
```
## Client Setup
In another terminal, navigate to frontend folder: 
```
cd frontend
```
Create a .env file:
```
NEXT_PUBLIC_SERVER_ADDRESS = http://localhost:5000/
```
Set up and run client:
```
npm install
npm run dev
```