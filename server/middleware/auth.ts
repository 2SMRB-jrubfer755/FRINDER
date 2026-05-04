import { Request, Response, NextFunction } from 'express';
import Session from '../models/Session';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    const session = await Session.findOne({ token });
    if (!session) {
      return res.status(401).json({ message: 'Invalid or expired session' });
    }

    // attach userId for downstream handlers
    req.userId = session.userId;
    next();
  } catch (err) {
    console.error('Auth middleware error', err);
    res.status(500).json({ message: 'Server error validating session' });
  }
};
