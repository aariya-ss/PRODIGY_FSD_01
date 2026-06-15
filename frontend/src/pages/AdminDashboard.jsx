import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Users, Shield, UserCheck, Calendar, ShieldAlert, UserCog, Loader2 } from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState({ stats: {}, users: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/admin/dashboard');
        if (res.data && res.data.success) {
          setData({
            stats: res.data.stats,
            users: res.data.users
          });
        }
      } catch (err) {
        setError(err.message || 'Failed to retrieve admin dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Loading database records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-300 rounded-3xl text-center space-y-3">
          <ShieldAlert className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold">Access Rejected</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <Shield className="w-8 h-8 text-purple-400" />
            <span>Admin Control Panel</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            System overview and registered user records (stored securely in SQLite)
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Users */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="glass-panel p-6 rounded-3xl flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Users</p>
            <p className="text-3xl font-extrabold text-white">{data.stats.totalUsers || 0}</p>
          </div>
          <div className="p-4 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
        </motion.div>

        {/* Total Admins */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="glass-panel p-6 rounded-3xl flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Administrators</p>
            <p className="text-3xl font-extrabold text-white">{data.stats.totalAdmins || 0}</p>
          </div>
          <div className="p-4 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-2xl">
            <Shield className="w-6 h-6" />
          </div>
        </motion.div>

        {/* Regular Users */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="glass-panel p-6 rounded-3xl flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Standard Users</p>
            <p className="text-3xl font-extrabold text-white">{data.stats.totalStandardUsers || 0}</p>
          </div>
          <div className="p-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl">
            <UserCheck className="w-6 h-6" />
          </div>
        </motion.div>
      </div>

      {/* User Records Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="glass-panel rounded-3xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-200 flex items-center space-x-2">
            <UserCog className="w-5 h-5 text-purple-400" />
            <span>Registered Accounts</span>
          </h2>
          <span className="text-xs bg-purple-500/15 text-purple-300 font-semibold px-3 py-1 rounded-full border border-purple-500/20">
            SQLite Database
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-900/30 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
              {data.users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/20 transition-all">
                  <td className="py-4 px-6 font-mono text-slate-500">#{user.id}</td>
                  <td className="py-4 px-6 font-semibold text-slate-200">{user.name}</td>
                  <td className="py-4 px-6 font-mono text-xs text-slate-400">{user.email}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      user.role === 'admin' 
                        ? 'bg-purple-500/15 text-purple-300 border-purple-500/20' 
                        : 'bg-blue-500/15 text-blue-300 border-blue-500/20'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <span>{formatDate(user.created_at)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {data.users.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No registered users found.
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
