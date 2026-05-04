import express from 'express';
import User from '../models/User';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// apply auth to all routes except login and create
router.use((req, res, next) => {
    if (req.path === '/login' && req.method === 'POST') return next();
    if (req.path === '/' && req.method === 'POST') return next();
    return requireAuth(req as AuthenticatedRequest, res, next);
});

// LOGIN user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body || {};

        // basic validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are both required' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }
        if (typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Email not registered' });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const userObj = user.toObject();
        delete (userObj as any).password;
        res.json(userObj);
    } catch (error) {
        res.status(500).json({ message: 'Error logging in user', error });
    }
});

// GET all users (requires auth)
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

// GET user by ID (requires auth)
router.get('/:id', async (req: AuthenticatedRequest, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
});

// CREATE a new user
router.post('/', async (req, res) => {
    try {
        const { name, email, password } = req.body || {};
        // perform minimal validation before hitting mongoose
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        if (typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', error });
    }
});

// UPDATE user (user can only update their own profile)
router.put('/:id', async (req: AuthenticatedRequest, res) => {
    try {
        if (req.userId !== req.params.id) {
            return res.status(403).json({ message: 'Cannot edit another user' });
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: 'Error updating user', error });
    }
});

// PURCHASE premium for user (must be same user)
router.post('/:id/premium', async (req: AuthenticatedRequest, res) => {
    try {
        const userId = req.params.id;
        if (req.userId !== userId) return res.status(403).json({ message: 'Unauthorized' });
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isPremium = true;
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: 'Error purchasing premium', error });
    }
});

// ADD user to favorites
router.post('/:id/favorites/:targetUserId', async (req: AuthenticatedRequest, res) => {
    try {
        const { id, targetUserId } = req.params;
        if (req.userId !== id) return res.status(403).json({ message: 'Unauthorized' });
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.favorites) user.favorites = [];
        if (!user.favorites.includes(targetUserId)) {
            user.favorites.push(targetUserId);
        }
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: 'Error adding to favorites', error });
    }
});

// REMOVE user from favorites
router.delete('/:id/favorites/:targetUserId', async (req: AuthenticatedRequest, res) => {
    try {
        const { id, targetUserId } = req.params;
        if (req.userId !== id) return res.status(403).json({ message: 'Unauthorized' });
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.favorites) user.favorites = [];
        user.favorites = user.favorites.filter(fav => fav !== targetUserId);
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: 'Error removing from favorites', error });
    }
});

// SKIP user (don't show again)
router.post('/:id/skip/:targetUserId', async (req: AuthenticatedRequest, res) => {
    try {
        const { id, targetUserId } = req.params;
        if (req.userId !== id) return res.status(403).json({ message: 'Unauthorized' });
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.skipped) user.skipped = [];
        if (!user.skipped.includes(targetUserId)) {
            user.skipped.push(targetUserId);
        }
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: 'Error skipping user', error });
    }
});

export default router;
