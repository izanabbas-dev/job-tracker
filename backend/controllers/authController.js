import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import sendEmail from '../config/mailer.js';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body ?? {};

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ success: true, message: 'User registered successfully! Please login.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  const genericResponse = {
    success: true,
    message: 'If an account with that email exists, a password reset link has been sent.',
  };

  try {
    const { email } = req.body ?? {};
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    // Respond identically whether or not the account exists, so emails can't be enumerated.
    if (!user) return res.json(genericResponse);

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = hashToken(resetToken);
    user.resetPasswordExpire = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    await user.save();

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: 'JobTrackr password reset',
        text: `Hi ${user.name},\n\nReset your password using the link below. It expires in 15 minutes.\n\n${resetUrl}\n\nIf you didn't request this, you can ignore this email.`,
        html: `<p>Hi ${user.name},</p>
          <p>Reset your password using the link below. It expires in 15 minutes.</p>
          <p><a href="${resetUrl}">Reset password</a></p>
          <p>If you didn't request this, you can ignore this email.</p>`,
      });
    } catch (mailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      console.error(`Reset email failed: ${mailError.message}`);
      return res.status(500).json({ message: 'Could not send reset email. Please try again later.' });
    }

    res.json(genericResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/auth/reset-password/:token
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body ?? {};
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({
      resetPasswordToken: hashToken(req.params.token),
      resetPasswordExpire: { $gt: new Date() },
    });
    if (!user) {
      return res.status(400).json({ message: 'Reset link is invalid or has expired' });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successfully! Please login.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
