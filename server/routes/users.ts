import express from 'express';
import User from '../models/User';

const router = express.Router();

// LOGIN user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error logging in user', error });
    }
});

// GET all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

// GET user by ID
router.get('/:id', async (req, res) => {
    try {
        // Note: We're using custom string IDs for now to match mock data, 
        // but in a real app these would likely be ObjectIds. 
        // If using ObjectIds, use findById(req.params.id)
        const user = await User.findOne({ _id: req.params.id });
        // If we kept string IDs in the _id field or a separate id field, adjust accordingly.
        // For this migration, we'll let Mongoose generate _id but we might need to map it.
        // To keep it simple with the seed data, we will try to respect the seeded IDs if possible,
        // or just find by the 'id' field if we added one (we didn't add a custom 'id' field in the schema, 
        // we relied on _id. The seed script needs to handle this).

        // Let's assume we use Mongoose default _id.
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
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', error });
    }
});

// UPDATE user
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: 'Error updating user', error });
    }
});

export default router;
