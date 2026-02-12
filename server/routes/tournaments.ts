import express from 'express';
import Tournament from '../models/Tournament';

const router = express.Router();

// GET all tournaments
router.get('/', async (req, res) => {
    try {
        const tournaments = await Tournament.find();
        res.json(tournaments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tournaments', error });
    }
});

export default router;
