# Secure Auth System

A secure authentication application built with Node.js and Express that demonstrates JWT-based login, password hashing, cookie storage, rate limiting, and role-based access control.

## Overview
This project is a small full-stack authentication demo that shows how to protect routes and manage user access securely. It includes a simple frontend interface for login, registration, dashboard access, and admin-only pages.

## Features
- User registration and login
- JWT-based authentication
- Secure cookie-based session handling
- Password hashing with bcrypt
- Login attempt rate limiting
- Role-based access control for admin and regular users
- Protected dashboard and admin pages

## Tech Stack
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [JSON Web Token (JWT)](https://jwt.io/)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [cookie-parser](https://www.npmjs.com/package/cookie-parser)
- [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)

## Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```

## Usage
- Open the app in your browser at http://localhost:3000
- Register a new account or log in with an existing one
- Access the dashboard after authentication
- Admin-only routes are available for users with the admin role

## Project Structure
- [server.js](server.js) - Main server entry point
- [controllers/](controllers/) - Authentication and admin logic
- [middleware/](middleware/) - Auth and access control middleware
- [models/](models/) - Database access layer
- [public/](public/) - Frontend HTML, CSS, and JS files
- [data/](data/) - JSON data storage

## Security Notes
- Passwords are hashed before storage
- JWTs are used for stateless authentication
- Sensitive routes are protected with middleware
- Basic rate limiting helps reduce brute-force attempts
