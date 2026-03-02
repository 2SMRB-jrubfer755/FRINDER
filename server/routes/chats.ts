import express, { Request, Response } from 'express';
import Chat, { IChat, IMessage } from '../models/Chat';

const router = express.Router();

// GET chats for a user
router.get('/:userId', async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const chats = await Chat.find({ participants: userId });
        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chats', error });
    }
});

// CREATE or UPDATE a chat (Send message)
router.post('/message', async (req: Request, res: Response) => {
    try {
        const { chatId, participants, message } = req.body;

        let chat;
        if (chatId) {
            // We're looking for an existing chat by ID, but since we are migrating from mock data where IDs were 'chat_1',
            // and Mongo uses ObjectIds, we need to be careful.
            // For this implementation, if chatId is provided try to find it.
            // If not found, create new.

            // Check if chatId is a valid ObjectId if we were strictly using ObjectIds, 
            // but here we might have custom logic.
            // Let's assume we search by _id if it's a valid ObjectId, or maybe we just create if not found.

            // Actually, the frontend sends a 'chatId' that might be 'chat_1'.
            // We should probably rely on finding a chat with these exact participants if no ID is clear.
            try {
                chat = await Chat.findById(chatId);
            } catch (e) {
                // invalid object id, ignore
            }
        }

        if (!chat && participants) {
            // Try to find by participants
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
