import express, { Request, Response } from 'express';
import Session from '../models/Session';
import User from '../models/User';
import crypto from 'crypto';

const router = express.Router();

// Genera un token único
const generateToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// CREATE session (login/registro)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    // Verifica que el usuario existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Genera token
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días

    // Crea sesión
    const session = new Session({
      userId,
      token,
      expiresAt,
      userAgent: req.get('user-agent'),
      ipAddress: req.ip
    });

    await session.save();

    res.status(201).json({
      token,
      userId,
      expiresAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating session', error });
  }
});

// GET current session
router.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const session = await Session.findOne({ token, expiresAt: { $gt: new Date() } });

    if (!session) {
      return res.status(401).json({ message: 'Invalid or expired session' });
    }

    const user = await User.findById(session.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      token,
      userId: session.userId,
      user,
      expiresAt: session.expiresAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching session', error });
  }
});

// DELETE session (logout)
router.delete('/:token', async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const result = await Session.findOneAndDelete({ token });

    if (!result) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting session', error });
  }
});

// Cleanup expired sessions
router.post('/cleanup/expired', async (req: Request, res: Response) => {
  try {
    const result = await Session.deleteMany({ expiresAt: { $lt: new Date() } });
    res.json({ message: `Deleted ${result.deletedCount} expired sessions` });
  } catch (error) {
    res.status(500).json({ message: 'Error cleaning up sessions', error });
  }
});

export default router;
