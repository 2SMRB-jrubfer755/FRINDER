import express from 'express';
import Tournament from '../models/Tournament';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();
router.use(requireAuth);

// GET all tournaments
router.get('/', async (req, res) => {
    try {
        const tournaments = await Tournament.find();
        res.json(tournaments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tournaments', error });
    }
});

// JOIN tournament (add participant)
router.post('/:id/join', async (req: AuthenticatedRequest, res) => {
    try {
        const tournamentId = req.params.id;
        const userId = req.userId;
        if (!userId) return res.status(401).json({ message: 'userId required' });

        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) return res.status(404).json({ message: 'Tournament not found' });

        // ensure participants array exists
        if (!Array.isArray((tournament as any).participants)) (tournament as any).participants = [];

        if (!((tournament as any).participants as string[]).includes(userId)) {
            ((tournament as any).participants as string[]).push(userId);
            await tournament.save();
        }

        res.json(tournament);
    } catch (error) {
        res.status(400).json({ message: 'Error joining tournament', error });
    }
});

export default router;
