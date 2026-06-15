const { query } = require('../config/db');

const getDashboard = async (req, res, next) => {
  try {
    // Retrieve all registered users, sorted by registration date
    const users = await query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');

    // Aggregate simple statistics
    const totalUsers = users.length;
    const totalAdmins = users.filter(u => u.role === 'admin').length;
    const totalStandardUsers = totalUsers - totalAdmins;

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalAdmins,
        totalStandardUsers
      },
      users
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard
};
