const { User } = require('../models/db');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    // Exclude password hashes and refresh tokens from response
    const sanitizedUsers = users.map(u => ({
      id: u.id,
      username: u.username,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt
    }));
    res.json({ users: sanitizedUsers });
  } catch (err) {
    console.error('getAllUsers error:', err);
    res.status(500).json({ error: 'Server error loading users list' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified. Must be user or admin' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Safety check: Prevent self-demotion
    if (user.id === req.user.id && role !== 'admin') {
      return res.status(400).json({ error: 'You cannot demote yourself from admin status' });
    }

    const updatedUser = await User.update(id, { role });
    res.json({
      message: 'User role updated successfully',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });
  } catch (err) {
    console.error('updateUserRole error:', err);
    res.status(500).json({ error: 'Server error updating user role' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Safety check: Prevent self-deletion
    if (user.id === req.user.id) {
      return res.status(400).json({ error: 'You cannot delete your own admin account' });
    }

    await User.delete(id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('deleteUser error:', err);
    res.status(500).json({ error: 'Server error deleting user' });
  }
};

module.exports = { getAllUsers, updateUserRole, deleteUser };
