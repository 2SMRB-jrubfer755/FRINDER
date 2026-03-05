import express, { Request, Response } from 'express';
import Chat, { IChat, IMessage } from '../models/Chat';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();
router.use(requireAuth);

// GET chats for a user
router.get('/:userId', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.params.userId;
        if (req.userId !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        const chats = await Chat.find({ participants: userId });
        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chats', error });
    }
});

// CREATE or UPDATE a chat (Send message), user must belong to participants
router.post('/message', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { chatId, participants, message } = req.body;

        if (!Array.isArray(participants) || participants.length === 0) {
            return res.status(400).json({ message: 'Participants list is required' });
        }
        const userId = req.userId;
        if (!userId || !participants.includes(userId)) {
            return res.status(403).json({ message: 'User not authorized for this chat' });
        }

        let chat;
        if (chatId) {
            try {
                chat = await Chat.findById(chatId);
            } catch (e) {
                // invalid object id, ignore
            }
        }

        if (!chat && participants) {
            chat = await Chat.findOne({ participants: { $all: participants, $size: participants.length } });
        }

        if (!chat) {
            chat = new Chat({
                participants,
                messages: []
            });
        }

        if (message) {
            chat.messages.push(message);
            chat.lastMessage = message.text;
        }

        const savedChat = await chat.save();
        res.json(savedChat);
    } catch (error) {
        res.status(400).json({ message: 'Error sending message', error });
    }
});

export default router;
