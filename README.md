# Courier Tracking System with Admin Panel

This project is a Courier Tracking System with an admin panel. It allows users to check their package details based on the tracking number, and it provides admin functionalities such as adding packages, updating status and location, and deleting packages. Authentication is required for admin access to perform these operations.

## Technologies Used

- Frontend: React
- Backend: Node.js
- Database: SQL

## Functionality

### User:

- **Check Package Details**: Users can check their package details by entering the tracking number.

### Admin:

- **Login**: Admin authentication is required to access admin functionalities.
- **Add Package**: Admin can add new packages to the system.
- **Update Package**: Admin can update the status and location of existing packages.
- **Delete Package**: Admin can delete packages from the system.

## Setup Instructions

### Frontend (React)

1. Ensure you have Node.js and npm installed on your machine.
2. Navigate to the frontend directory.
3. Run `npm install` to install the required dependencies.
4. Start the development server by running `npm start`.

### Backend (Node.js)

1. Ensure you have Node.js installed on your machine.
2. Navigate to the backend directory.
3. Run `npm install` to install the required dependencies.
4. Set up the SQL database and configure the connection in the backend code.
5. Start the backend server by running `npm start`.

## Authentication

Admin authentication is implemented to secure admin functionalities. Only authenticated admins can perform operations such as adding, updating, and deleting packages.

## Database

The backend uses a SQL database to store package information. Make sure to set up the database schema and configure the connection in the backend code.

## Usage

- Users can visit the website and enter their tracking number to check package details.
- Admins need to log in with their credentials to access admin functionalities.
- After authentication, admins can perform operations such as adding, updating, and deleting packages.

## Routes
"/": Renders the UserTracking component.
"/admin": Renders the AdminLogin component.
"/admin-dashboard": Renders the AdminDashboard component, but only after logging in.
