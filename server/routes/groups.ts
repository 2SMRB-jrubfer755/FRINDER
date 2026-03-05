import express from 'express';
import Group from '../models/Group';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();
router.use(requireAuth);

// GET all groups
router.get('/', async (req, res) => {
    try {
        const groups = await Group.find();
        res.json(groups);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching groups', error });
    }
});

// CREATE a new group
router.post('/', async (req, res) => {
    try {
        const { name } = req.body || {};
        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Group name is required' });
        }
        const newGroup = new Group(req.body);
        const savedGroup = await newGroup.save();
        res.status(201).json(savedGroup);
    } catch (error) {
        res.status(400).json({ message: 'Error creating group', error });
    }
});

// JOIN a group (add member)
router.post('/:id/join', async (req: AuthenticatedRequest, res) => {
    try {
        const groupId = req.params.id;
        const userId = req.userId;
        if (!userId) return res.status(401).json({ message: 'userId required' });

        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: 'Group not found' });

        if (!group.members.includes(userId)) {
            group.members.push(userId);
            await group.save();
        }

        res.json(group);
    } catch (error) {
        res.status(400).json({ message: 'Error joining group', error });
    }
});

export default router;
