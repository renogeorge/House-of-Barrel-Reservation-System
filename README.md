# House of Barrel | Bar Reservation & Takeaway Management System

## Project Overview

House of Barrel is a full-stack web-based bar reservation and takeaway management system developed to simplify table reservations, online takeaway ordering and menu management.

The system provides customers with an interactive platform to explore the menu, reserve tables and place takeaway orders, while administrators can manage reservations, orders and menu information through an administrative dashboard.

## Problem Statement

Traditional bar reservation and takeaway processes can involve manual booking, order management and record keeping. House of Barrel aims to streamline these operations through a centralized web-based platform.

## Key Features

### Customer Features
- User Registration and Login
- Browse Drinks and Menu Items
- Table Reservation System
- Online Takeaway Ordering
- Shopping Cart
- Order Management

### Admin Features
- Admin Authentication
- Dashboard Overview
- Reservation Management
- Takeaway Order Management
- Menu Management
- Sales and Performance Monitoring

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML | Frontend Structure |
| CSS | Styling and Layout |
| JavaScript | Frontend Functionality |
| Python | Backend Development |
| FastAPI | Backend API Framework |
| MongoDB | Database |
| JWT | Authentication |
| Uvicorn | Backend Server |

## System Architecture

The application follows a client-server architecture.

- Frontend: HTML, CSS and JavaScript.
- Backend: Python with FastAPI.
- Database: MongoDB.
- Authentication: JWT-based authentication.

The frontend communicates with backend APIs to process reservations, authentication, menu operations and takeaway orders.

## Screenshots

### Homepage
![Homepage](screenshots/homepage.png)

### Menu1
![Menu](screenshots/menu1.png)

### Menu2
![Menu](screenshots/menu2.png)

### Reservation
![Reservation](screenshots/reservation.png)

### Admin Dashboard
![Admin Dashboard](screenshots/admin-dashboard.png)

## Project Structure

The project consists of frontend files, backend API routes, authentication utilities, database configuration and administrative dashboard components.

## How to Run

### Backend

1. Install Python dependencies.
2. Start MongoDB.
3. Configure the MongoDB connection.
4. Start the FastAPI server using:

`uvicorn main:app --reload`

5. Access the API documentation at:

`http://127.0.0.1:8000/docs`

### Frontend

1. Open the frontend folder in Visual Studio Code.
2. Run `index.html` using Live Server.
3. Access the website through your browser.

## Future Enhancements

- Online payment integration.
- Improved sales analytics.
- Enhanced reporting.
- Additional customer order tracking features.

## Author

Reno George

## Project Type

Final Year B.Sc. Information Technology Project
