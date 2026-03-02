# Full Stack Final Assignment

Professional documentation for the Full Stack Assignment project. This application provides a comprehensive e-commerce experience with a clean user interface and robust backend functionality.

## Tech Stack

The project is built using the following technologies:

- Frontend: React, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB
- Media Storage: Cloudinary
- Authentication: JWT (JSON Web Tokens)

## Features

### Authentication

- Secure user registration and login functionality.
- Password hashing and token-based authentication.
- Protected routes for authenticated users.

### Product Management

- Browse products with detailed descriptions and images.
- Fetch product data from a remote database.
- Product search and category filtering.

### Cart and Orders

- Add products to a shopping cart.
- Modify quantities and remove items from the cart.
- Place orders and track order history.

### User Profile

- View and update personal profile information.
- Manage contact details and shipping addresses.

### Admin Dashboard

- Dedicated dashboard for administrative tasks.
- Manage products (Add, Edit, Delete).
- View and process customer orders.
- Monitor user activity.

## Setup Instructions

### Backend Setup

1. Navigate to the Backend directory.
2. Install dependencies: `npm install`
3. Create a `.env` file and configure:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
4. Start the server: `npm start`

### Frontend Setup

1. Navigate to the Frontend directory.
2. Install dependencies: `npm install || npm install --legacy-peer-deps`
3. Start the development server: `npm run dev`

## Folder Structure

### Backend

- `Configs`: Server and database configurations.
- `Controllers`: Logic for handling API requests.
- `Models`: Database schemas for users, products, and orders.
- `Routes`: API endpoints definitions.
- `Middlewares`: Authentication and error handling logic.

### Frontend

- `Pages`: Main views including Dashboard, Profile, and Auth.
- `Components`: Reusable UI elements.
- `Context`: Global state management for Auth and Cart.
- `Assets`: Images and static files.

## Conclusion

This project demonstrates the integration of a modern tech stack to build a scalable and efficient full-stack application.
