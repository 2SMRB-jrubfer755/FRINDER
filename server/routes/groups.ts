import express from 'express';
import Group from '../models/Group';

const router = express.Router();

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
        const newGroup = new Group(req.body);
        const savedGroup = await newGroup.save();
        res.status(201).json(savedGroup);
    } catch (error) {
        res.status(400).json({ message: 'Error creating group', error });
    }
});

export default router;
