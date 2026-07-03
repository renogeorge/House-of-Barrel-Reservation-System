# 🍺 House of Barrel - Bar Reservation System API

A Python backend API using **FastAPI** and **MongoDB** for managing bar table reservations.

## 📋 Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running in VS Code](#running-in-vs-code)
- [API Endpoints](#api-endpoints)
- [Testing the API](#testing-the-api)

## ✨ Features

- ✅ Create new reservations
- ✅ List all reservations (admin)
- ✅ Delete reservations by ID (admin)
- ✅ MongoDB integration with pymongo
- ✅ Input validation with Pydantic
- ✅ CORS enabled for frontend integration
- ✅ Automatic API documentation (Swagger UI)

## 📁 Project Structure

```
house-of-barrel-dashboard-python/
├── config/
│   ├── __init__.py
│   └── database.py          # MongoDB connection management
├── models/
│   ├── __init__.py
│   └── reservation.py       # Pydantic models for validation
├── routes/
│   ├── __init__.py
│   └── reservations.py      # API route handlers
├── main.py                  # FastAPI application entry point
├── requirements.txt         # Python dependencies
├── .env.example            # Environment variable template
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## 🔧 Prerequisites

Before running this project, ensure you have the following installed:

1. **Python 3.8+** - [Download Python](https://www.python.org/downloads/)
2. **MongoDB** - [Download MongoDB Community Server](https://www.mongodb.com/try/download/community)
3. **VS Code** (recommended) - [Download VS Code](https://code.visualstudio.com/)

### Verify MongoDB Installation

Open a terminal/command prompt and run:
```bash
mongod --version
```

If MongoDB is not in your PATH, you may need to start it manually or install it as a service.

## 📦 Installation

### Step 1: Clone or Navigate to Project Directory

Open VS Code and navigate to the project folder:
```bash
cd c:\Users\Asus\OneDrive\Desktop\house-of-barrel-dashboard-python
```

### Step 2: Create Virtual Environment

Create a Python virtual environment:

**Windows (PowerShell):**
```powershell
python -m venv venv
```

**macOS/Linux:**
```bash
python3 -m venv venv
```

### Step 3: Activate Virtual Environment

**Windows (PowerShell):**
```powershell
.\venv\Scripts\Activate
```

**Windows (Command Prompt):**
```cmd
venv\Scripts\activate.bat
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt.

### Step 4: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 5: Set Up Environment Variables

Copy the example environment file:
```bash
copy .env.example .env
```

Edit `.env` file if you need to change MongoDB connection settings:
```env
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=house_of_barrel
```

### Step 6: Start MongoDB

Make sure MongoDB is running. 

**Windows** (if MongoDB is installed as a service):
```powershell
net start MongoDB
```

**macOS/Linux**:
```bash
sudo systemctl start mongod
# or
sudo service mongod start
```

Alternatively, run MongoDB manually:
```bash
mongod
```

## 🚀 Running in VS Code

### Method 1: Using Integrated Terminal

1. **Open VS Code** and open the project folder
2. **Open Terminal** in VS Code (`Ctrl + `` ` `` or `Terminal → New Terminal`)
3. **Activate virtual environment** (see Step 3 above)
4. **Run the application:**

```bash
uvicorn main:app --reload
```

The API will start at: `http://127.0.0.1:8000`

### Method 2: Using VS Code Debug Configuration

1. Create a `.vscode` folder in your project root (if it doesn't exist)
2. Create a file `.vscode/launch.json` with the following content:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python: FastAPI",
            "type": "python",
            "request": "launch",
            "module": "uvicorn",
            "args": [
                "main:app",
                "--reload",
                "--host", "0.0.0.0",
                "--port", "8000"
            ],
            "jinja": true,
            "justMyCode": true,
            "env": {
                "PYTHONPATH": "${workspaceFolder}"
            }
        }
    ]
}
```

3. Press `F5` or click **Run → Start Debugging**
4. The API will start with debugging enabled

### Access the API

- **API Base URL**: `http://127.0.0.1:8000`
- **Interactive API Docs (Swagger)**: `http://127.0.0.1:8000/docs`
- **Alternative API Docs (ReDoc)**: `http://127.0.0.1:8000/redoc`

## 📡 API Endpoints

### 1. Health Check
```http
GET /
```

Response:
```json
{
  "message": "🍺 House of Barrel Reservation System API",
  "status": "running",
  "version": "1.0.0"
}
```

### 2. Create Reservation
```http
POST /reservation
Content-Type: application/json
```

Request Body:
```json
{
  "name": "John Doe",
  "phone": "+1234567890",
  "date": "2024-02-15",
  "time": "19:00",
  "guests": 4,
  "tableType": "VIP",
  "specialRequests": "Window seating preferred"
}
```

Response (201 Created):
```json
{
  "id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "name": "John Doe",
  "phone": "+1234567890",
  "date": "2024-02-15",
  "time": "19:00",
  "guests": 4,
  "tableType": "VIP",
  "specialRequests": "Window seating preferred",
  "createdAt": "2024-01-30T10:30:00"
}
```

### 3. Get All Reservations (Admin)
```http
GET /admin/reservations
```

Response (200 OK):
```json
[
  {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "phone": "+1234567890",
    "date": "2024-02-15",
    "time": "19:00",
    "guests": 4,
    "tableType": "VIP",
    "specialRequests": "Window seating preferred",
    "createdAt": "2024-01-30T10:30:00"
  }
]
```

### 4. Delete Reservation (Admin)
```http
DELETE /admin/reservation/{id}
```

Response (204 No Content)

## 🧪 Testing the API

### Using Swagger UI (Recommended)

1. Start the server
2. Navigate to `http://127.0.0.1:8000/docs`
3. Click on any endpoint to expand it
4. Click **"Try it out"**
5. Fill in the request body (for POST)
6. Click **"Execute"**

### Using cURL

**Create a reservation:**
```bash
curl -X POST "http://127.0.0.1:8000/reservation" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Jane Smith\",\"phone\":\"+9876543210\",\"date\":\"2024-02-20\",\"time\":\"20:00\",\"guests\":2,\"tableType\":\"Standard\",\"specialRequests\":\"Quiet area\"}"
```

**Get all reservations:**
```bash
curl -X GET "http://127.0.0.1:8000/admin/reservations"
```

**Delete a reservation:**
```bash
curl -X DELETE "http://127.0.0.1:8000/admin/reservation/YOUR_RESERVATION_ID"
```

### Using Python Requests

```python
import requests

# Create reservation
response = requests.post("http://127.0.0.1:8000/reservation", json={
    "name": "Test User",
    "phone": "+1234567890",
    "date": "2024-03-01",
    "time": "18:30",
    "guests": 3,
    "tableType": "Outdoor",
    "specialRequests": "Birthday celebration"
})
print(response.json())

# Get all reservations
response = requests.get("http://127.0.0.1:8000/admin/reservations")
print(response.json())
```

## 🛠️ Development Tips

### VS Code Extensions (Recommended)

- **Python** (Microsoft) - Python language support
- **Pylance** - Fast Python language server
- **REST Client** - Test HTTP requests directly in VS Code
- **MongoDB for VS Code** - View and manage MongoDB data

### Hot Reload

The `--reload` flag automatically restarts the server when code changes are detected. This is enabled by default in development mode.

### Viewing MongoDB Data

You can use MongoDB Compass (GUI) to view your data:
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect to `mongodb://localhost:27017`
3. Navigate to `house_of_barrel` → `reservations`

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` or check Windows services
- Verify connection string in `.env` file
- Check MongoDB is listening on port 27017

### Module Not Found Error
- Ensure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`

### Port Already in Use
- Change port in uvicorn command: `uvicorn main:app --reload --port 8001`

## 📄 License

This project is provided as-is for the House of Barrel reservation system.

---

**Enjoy building your bar reservation system! 🍻**
