import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.ADMIN_SESSION_SECRET || 'kat_mnc_super_secret_session_jwt_key_2026';

export function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid authentication token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Insufficient privileges' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Session expired or token invalid' });
  }
}

export function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role || 'admin' },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}
