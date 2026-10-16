import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';

const toProfile = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  targetRole: user.targetRole ?? '',
  bio: user.bio ?? '',
  createdAt: user.createdAt,
});

// GET /api/users/profile
export const getProfile = async (req, res) => {
  res.json(toProfile(req.user));
};

// PUT /api/users/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, targetRole, bio, currentPassword, newPassword } = req.body ?? {};
    const user = await User.findById(req.user._id).select('+password');

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({ message: 'Name cannot be empty' });
      }
      user.name = name;
    }
    if (targetRole !== undefined) user.targetRole = targetRole;
    if (bio !== undefined) user.bio = bio;

    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters' });
      }
      if (!currentPassword || !(await bcrypt.compare(currentPassword, user.password))) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    res.json(toProfile(user));
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};
