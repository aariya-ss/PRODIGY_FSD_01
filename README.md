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

---

## Security Features

✅ **HttpOnly Cookies**: JWT tokens stored in secure HttpOnly cookies to prevent XSS attacks  
✅ **Password Hashing**: Passwords hashed with bcryptjs (salt rounds: 10)  
✅ **CORS Protection**: Configured with explicit origin validation  
✅ **Helmet Security Headers**: Adds security headers (CSP, X-Frame-Options, etc.)  
✅ **Rate Limiting**: Brute-force protection on login & registration endpoints  
✅ **JWT Validation**: Token expiration and signature verification  
✅ **Role-Based Access Control**: Middleware enforces user vs admin permissions  

---

## Usage

### Register a New Account
1. Navigate to the **Register** page
2. Enter email, password, and confirm password
3. Password strength indicator shows complexity in real-time
4. Click **Register**

### Login
1. Navigate to the **Login** page
2. Enter email and password
3. Optional: Check **Remember Me** to extend session to 7 days
4. Click **Login**

### Admin Dashboard (Admin Only)
- View total user count and registration stats
- Browse user registry table with email and registration date
- Accessible only to accounts with `admin` role

### User Dashboard
- View personalized welcome message
- Navigate to admin panel if admin, or view unauthorized message if standard user
- Secure logout functionality

---

## Environment Variables

### Backend (.env)
```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend (.env - Optional)
```env
VITE_API_URL=http://localhost:5000
```

---

## Testing the Application

### Create Test Account
1. Register with email: `test@example.com`, password: `Test@12345`

### Test Admin Access
- Contact the repository owner to set up an admin account
- Admin credentials are configured at database initialization

### API Testing (cURL Examples)
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Test@12345","confirmPassword":"Test@12345"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Test@12345"}' \
  -c cookies.txt

# Get Current User
curl -X GET http://localhost:5000/api/auth/me \
  -b cookies.txt
```

---

## Troubleshooting

### Backend won't start
- Ensure Node.js v16+ is installed: `node --version`
- Check if port 5000 is available
- Verify `.env` file exists in backend directory
- Run: `npm install` and `npm run dev`

### Frontend dependency error
- Use `npm install --legacy-peer-deps` for lucide-react compatibility
- Clear node_modules: `rm -rf node_modules && npm install --legacy-peer-deps`

### Database not initializing
- Delete `backend/database.sqlite` and restart the backend
- Check backend logs for SQL errors

### CORS errors
- Verify `CLIENT_URL` in `.env` matches your frontend URL
- Ensure frontend is running on http://localhost:5173

### Login not working
- Clear browser cookies and retry
- Check browser console for error messages
- Verify JWT_SECRET in .env is not empty

---

## Project Structure Details

### Backend Architecture
- **server.js**: Express app initialization, middleware setup, route registration
- **config/db.js**: SQLite connection and table creation
- **controllers/**: Business logic for authentication and admin operations
- **middleware/**: Auth verification, error handling, rate limiting
- **routes/**: API endpoint definitions
- **utils/validation.js**: Zod schemas for input validation

### Frontend Architecture
- **App.jsx**: Route configuration and app structure
- **AuthContext.jsx**: Global authentication state management
- **ProtectedRoute.jsx**: Route guard component for authenticated routes
- **AdminRoute.jsx**: Route guard for admin-only pages
- **services/api.js**: Axios instance and API calls

---

## Performance Optimizations

- Vite for fast frontend bundling
- Code splitting for optimized load times
- SQLite for lightweight local database
- JWT for stateless session management
- Rate limiting to prevent resource exhaustion

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

This project is open source and available under the MIT License.

---

## Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the project maintainer.

---

## Author

Created by **shanzie21** - Secure Authentication System (2026)
