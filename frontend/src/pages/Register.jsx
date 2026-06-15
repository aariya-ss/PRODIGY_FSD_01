import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus, AlertCircle, ShieldAlert } from 'lucide-react';
import PasswordStrength from '../components/PasswordStrength';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const { register, error: authError, setError } = useAuth();
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    const errors = {};
    if (!name) errors.name = 'Name is required';
    if (!email) errors.email = 'Email is required';
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      setIsSubmitting(true);
      await register(name, email, password, role);
      navigate('/dashboard');
    } catch (err) {
      if (err.errors) {
        const backendErrors = {};
        err.errors.forEach(e => {
          backendErrors[e.field] = e.message;
        });
        setValidationErrors(backendErrors);
      } else if (err.message) {
        setError(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-panel p-8 rounded-3xl"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 bg-brand-500/10 text-brand-400 rounded-2xl mb-3 border border-brand-500/20">
            <UserPlus className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Create Account</h2>
          <p className="text-slate-400 text-sm mt-1">Sign up for a secure profile</p>
        </div>

        {authError && !Object.keys(validationErrors).length && (
          <div className="mb-5 p-4 bg-red-500/10 border border-red-500/20 text-red-300 rounded-2xl flex items-start space-x-2.5 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className={`w-full pl-12 pr-4 py-3 rounded-2xl glass-input ${
                  validationErrors.name ? 'border-red-500/55 focus:border-red-500' : ''
                }`}
              />
            </div>
            {validationErrors.name && (
              <p className="text-xs text-red-400 font-medium">{validationErrors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className={`w-full pl-12 pr-4 py-3 rounded-2xl glass-input ${
                  validationErrors.email ? 'border-red-500/55 focus:border-red-500' : ''
                }`}
              />
            </div>
            {validationErrors.email && (
              <p className="text-xs text-red-400 font-medium">{validationErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-12 pr-4 py-3 rounded-2xl glass-input ${
                  validationErrors.password ? 'border-red-500/55 focus:border-red-500' : ''
                }`}
              />
            </div>
            <PasswordStrength password={password} />
            {validationErrors.password && (
              <p className="text-xs text-red-400 font-medium">{validationErrors.password}</p>
            )}
          </div>

          {/* Role selection for demo */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Account Role (Demo)</label>
            <div className="flex gap-4">
              <label className="flex-1 flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/50 cursor-pointer transition-all">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={role === 'user'}
                    onChange={() => setRole('user')}
                    className="w-4 h-4 text-brand-500 focus:ring-brand-500 focus:ring-offset-slate-900 bg-slate-800 border-slate-700"
                  />
                  <span className="text-sm font-medium text-slate-300">Regular User</span>
                </div>
              </label>

              <label className="flex-1 flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800/50 cursor-pointer transition-all">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={role === 'admin'}
                    onChange={() => setRole('admin')}
                    className="w-4 h-4 text-purple-500 focus:ring-purple-500 focus:ring-offset-slate-900 bg-slate-800 border-slate-700"
                  />
                  <span className="text-sm font-medium text-slate-300">Administrator</span>
                </div>
                <ShieldAlert className="w-4 h-4 text-purple-400" />
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl font-bold bg-brand-600 hover:bg-brand-500 text-white transition-all shadow-lg shadow-brand-600/15 hover:shadow-brand-500/30 flex items-center justify-center space-x-2 border border-brand-500 mt-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                <span>Register</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
            Log in here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
