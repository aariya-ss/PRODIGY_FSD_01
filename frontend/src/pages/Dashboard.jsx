import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Calendar, Key, FileLock2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        {/* Welcome Banner */}
        <div className="glass-panel p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-brand-500/10 blur-3xl"></div>
          
          <div className="space-y-2 text-center md:text-left z-10">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Hello, <span className="text-brand-400">{user.name}</span>!
            </h1>
            <p className="text-slate-400 text-sm md:text-base">
              You are securely logged into your dashboard.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 z-10">
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all text-sm border border-purple-500 flex items-center justify-center space-x-2 shadow-lg shadow-purple-600/10 hover:shadow-purple-500/25"
              >
                <Shield className="w-4 h-4" />
                <span>Go to Admin Panel</span>
              </Link>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Details */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h2 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center space-x-2">
              <User className="w-5 h-5 text-brand-400" />
              <span>Profile Details</span>
            </h2>

            <div className="space-y-3.5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">User ID</span>
                <span className="text-slate-300 font-mono bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800/80">#{user.id}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-500" /> Name
                </span>
                <span className="text-slate-200 font-semibold">{user.name}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-slate-500" /> Email
                </span>
                <span className="text-slate-200 font-semibold">{user.email}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-slate-500" /> System Role
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  user.role === 'admin' ? 'bg-purple-500/15 text-purple-300 border border-purple-500/20' : 'bg-brand-500/15 text-brand-300 border border-brand-500/20'
                }`}>
                  {user.role}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-500" /> Created At
                </span>
                <span className="text-slate-300 font-medium">{formatDate(user.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Security Information */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h2 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center space-x-2">
              <Key className="w-5 h-5 text-brand-400" />
              <span>Session Security</span>
            </h2>

            <div className="space-y-4 text-sm">
              <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800/80 space-y-2">
                <div className="flex items-center space-x-2">
                  <FileLock2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-200 font-semibold">HttpOnly Cookie Auth</span>
                </div>
                <p className="text-[12px] text-slate-500 leading-relaxed">
                  Your JWT token is stored inside a secure HTTP-Only cookie. This prevents malicious scripts (XSS attacks) from reading it.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span>JWT TOKEN DECODING STATUS</span>
                  <span className="text-emerald-400">ACTIVE & SECURED</span>
                </div>
                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-brand-500 to-emerald-500 rounded-full"></div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 italic text-center pt-2">
                Note: Standard users only have access to user dashboard services. Admins can view complete system databases.
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
