📘 HOUSE OF BARREL
Bar Reservation & Takeaway Order Management System
📌 Project Description

House of Barrel is a full-stack web application developed for managing:

🍽 Table Reservations

🛍 Takeaway Orders

🔐 Admin Dashboard

📊 Sales & Reports

The system allows customers to register, login, place reservations and orders.
Admins can manage reservations, update order status, and monitor activity.

🛠 Technologies Used
Frontend

HTML5

CSS3

JavaScript

Backend

Python

FastAPI

Uvicorn

Database

MongoDB

📂 Project Structure
HOUSE-OF-BARREL/
│
├── config/            # Database configuration
├── models/            # Data models (Order, Reservation, User)
├── routes/            # API routes
├── main.py            # FastAPI main file
│
├── index.html         # Home page
├── login.html         # Customer login
├── admin.html         # Admin dashboard
├── styles.css         # Frontend styling
├── admin-script.js    # Admin logic
│
└── README.txt

🚀 How To Run The Project
1️⃣ Install Required Software

Install Python 3.10+

Install MongoDB

Install VS Code (optional)

2️⃣ Install Required Python Packages

Open terminal inside project folder:

pip install fastapi uvicorn pymongo python-dotenv


OR if using requirements file:

pip install -r requirements.txt

3️⃣ Start MongoDB

Make sure MongoDB service is running.

4️⃣ Run Backend Server
uvicorn main:app --reload


Server will start at:

http://127.0.0.1:8000


Swagger API Documentation:

http://127.0.0.1:8000/docs

5️⃣ Open Frontend

Open:

index.html


using Live Server or browser.

🔐 Admin Login Credentials (Demo)
Email: admin@test.com
Password: admin123

✅ Features

User Registration & Login

Admin Authentication

Create Reservation

Create Takeaway Orders

Update Order Status

View All Reservations

Sales Overview Dashboard

MongoDB Data Storage

🎯 Learning Outcomes

This project demonstrates:

REST API development using FastAPI

CRUD operations with MongoDB

Authentication & Role-based access

Full-stack integration

Responsive UI design

👨‍💻 Developed By

Reno George
Bar Reservation & Management System


**Customer Login:**
- Email: customer@houseofbarrel.com
- Password: customer123

**Admin Login:**
- Email: admin@houseofbarrel.com
- Password: admin123

