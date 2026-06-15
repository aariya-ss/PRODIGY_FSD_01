import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Unauthorized from './pages/Unauthorized';

// Prevent logged-in users from visiting auth pages (login/register)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null; // Avoid fast flash redirect before auth verification check finishes
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

// Root route dispatcher
const HomeRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col pb-10">
        <Navbar />
        
        {/* Main route view container */}
        <main className="flex-grow container mx-auto px-4 py-4 max-w-7xl">
          <Routes>
            {/* Root dispatcher */}
            <Route path="/" element={<HomeRedirect />} />

            {/* Auth routes (guests only) */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } 
            />

            {/* Protected dashboard routes (all logged-in users) */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            {/* Protected Admin routes (only logged-in users with role === 'admin') */}
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />

            {/* Permission rejection info view */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Catch-all unknown paths */}
            <Route path="*" element={<HomeRedirect />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
