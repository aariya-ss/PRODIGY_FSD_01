# Secure User Authentication System

A secure, responsive, role-based user authentication system built with a React.js (Vite + Tailwind CSS + Framer Motion) frontend and a Node.js (Express + SQLite + JWT + bcrypt) backend.

## Tech Stack

* **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Axios, React Router v6, Lucide Icons
* **Backend**: Node.js, Express.js, JWT (`jsonwebtoken`), Password Hashing (`bcryptjs`), rate limiting (`express-rate-limit`), security headers (`helmet`), cookie parsing (`cookie-parser`)
* **Database**: SQLite (local serverless file database)

---

## Features

1. **User Registration & Validation**: Email verification formatting, client-side input validations, and dynamic password complexity indicators.
2. **Secure Login & Session Handling**: Issues secure JSON Web Tokens (JWT) inside **HttpOnly** cookies with `sameSite: 'lax'` protection (defending against XSS and CSRF).
3. **Remember Me Toggle**: Toggle session cookie lifespan between standard session (1 hour) and persisted session (7 days).
4. **Role-Based Access Control (RBAC)**: Route guards intercept unauthorized visitors. Custom API middleware validates standard `user` vs `admin` roles.
5. **Admin Panel**: Dashboard displaying aggregate registration stats and a user records registry table.
6. **Rate Limiting**: Protects registration and login routes against brute-force attacks.

---

## Directory Structure

```
├── backend/
│   ├── src/
│   │   ├── config/          # SQLite database setup (db.js)
│   │   ├── controllers/     # Auth and Admin controller logic
│   │   ├── middleware/      # Auth check, rate limiting, and error parsing
│   │   ├── routes/          # Express route definitions
│   │   ├── utils/           # Zod input schemas (validation.js)
│   │   └── server.js        # Main entry script
│   ├── .env                 # Environment variables
│   ├── package.json
│   └── database.sqlite      # SQLite database file (created on startup)
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, PasswordStrength indicator, Route guards
│   │   ├── context/         # AuthContext keeping login session states
│   │   ├── pages/           # Login, Register, Dashboard, Admin, Unauthorized
│   │   ├── services/        # Axios API client helper (api.js)
│   │   ├── App.jsx          # Route mappings
│   │   ├── index.css        # Tailwind directives and glassmorphic stylings
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
```

---

## Installation & Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v16.x or higher recommended)
* npm (comes with Node)

### 1. Configure the Backend
Navigate to the `backend` directory:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` root:
```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```
Start the backend development server:
```bash
npm run dev
```
The server will run on [http://localhost:5000/](http://localhost:5000/) and initialize a `database.sqlite` file automatically.

### 2. Configure the Frontend
Navigate to the `frontend` directory:
```bash
cd ../frontend
npm install --legacy-peer-deps
```
Start the frontend development server:
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

---

## API Endpoints

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Public | Register a new user (with Zod validation & password hashing) |
| **POST** | `/api/auth/login` | Public | Login credentials check; signs JWT and sets HttpOnly cookie |
| **POST** | `/api/auth/logout` | Public | Clears session cookie |
| **GET** | `/api/auth/me` | User | Verifies session cookie and returns current user details |
| **GET** | `/api/admin/dashboard` | Admin | Returns aggregated user statistics and full user database registry |
