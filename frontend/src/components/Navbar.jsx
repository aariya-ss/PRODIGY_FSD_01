import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LayoutDashboard, Settings, LogOut, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-panel sticky top-0 z-50 px-6 py-3.5 mx-4 my-3 rounded-2xl flex justify-between items-center transition-all duration-300">
      {/* Brand logo */}
      <Link to="/" className="flex items-center space-x-2 text-xl font-bold tracking-wider text-brand-400">
        <Shield className="w-6 h-6 text-brand-500 animate-pulse" />
        <span>SecureAuth</span>
      </Link>

      {/* Nav Actions */}
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <Link
              to="/dashboard"
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive('/dashboard')
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            {user.role === 'admin' && (
              <Link
                to="/admin"
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive('/admin')
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Admin Panel</span>
              </Link>
            )}

            <div className="h-6 w-px bg-slate-800"></div>

            <div className="flex items-center space-x-3">
              <div className="flex flex-col text-right hidden sm:flex">
                <span className="text-sm font-semibold text-slate-200">{user.name}</span>
                <span className="text-[10px] text-brand-400 font-semibold tracking-wider uppercase">{user.role}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center justify-center p-2 rounded-xl text-red-400 hover:bg-red-500/15 hover:text-red-300 transition-all border border-transparent hover:border-red-500/20"
                title="Logout"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={`flex items-center space-x-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive('/login')
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Link>

            <Link
              to="/register"
              className="flex items-center space-x-1 px-4 py-2 rounded-xl text-sm font-medium bg-brand-600 hover:bg-brand-500 text-white transition-all shadow-lg shadow-brand-600/20 hover:shadow-brand-500/35 border border-brand-500"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
