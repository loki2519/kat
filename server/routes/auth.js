import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import { generateToken, authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const user = db.findUserByUsername(username);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password_hash);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken(user);
  return res.json({
    message: 'Authentication successful',
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});

// GET /api/auth/me (Verify token)
router.get('/me', authenticateAdmin, (req, res) => {
  return res.json({
    user: req.user,
  });
});

export default router;
