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
        const chats = await Chat.find({ participants: userId }).sort({ lastMessageTime: -1 });
        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chats', error });
    }
});

// GET specific chat
router.get('/chat/:chatId', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const chatId = req.params.chatId;
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        if (!chat.participants.includes(req.userId!)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        res.json(chat);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chat', error });
    }
});

// CREATE or UPDATE a chat (Send message)
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
                messages: [],
                unreadBy: participants.filter(p => p !== userId).map(p => ({ userId: p, count: 1 }))
            });
        }

        if (message) {
            chat.messages.push(message);
            chat.lastMessage = message.text || '📎 Archivo adjunto';
            chat.lastMessageTime = message.timestamp;
            
            // Update unread counts for other participants
            chat.unreadBy = chat.participants
                .filter(p => p !== userId)
                .map(p => ({
                    userId: p,
                    count: (chat.unreadBy?.find(u => u.userId === p)?.count || 0) + 1
                }));
        }

        const savedChat = await chat.save();
        res.json(savedChat);
    } catch (error) {
        res.status(400).json({ message: 'Error sending message', error });
    }
});

// UPDATE chat settings (name, privacy, etc)
router.put('/:chatId', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const chatId = req.params.chatId;
        const { chatName, isPrivate } = req.body;
        
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        if (!chat.participants.includes(req.userId!)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        if (chatName !== undefined) chat.chatName = chatName;
        if (isPrivate !== undefined) chat.isPrivate = isPrivate;

        const savedChat = await chat.save();
        res.json(savedChat);
    } catch (error) {
        res.status(400).json({ message: 'Error updating chat', error });
    }
});

// EDIT a message
router.put('/:chatId/message/:messageId', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { chatId, messageId } = req.params;
        const { text } = req.body;

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        const msgIndex = chat.messages.findIndex(m => m.id === messageId);
        if (msgIndex === -1) {
            return res.status(404).json({ message: 'Message not found' });
        }

        if (chat.messages[msgIndex].senderId !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        chat.messages[msgIndex].text = text;
        chat.messages[msgIndex].isEdited = true;
        chat.messages[msgIndex].editedAt = Date.now();

        const savedChat = await chat.save();
        res.json(savedChat);
    } catch (error) {
        res.status(400).json({ message: 'Error editing message', error });
    }
});

// DELETE a message
router.delete('/:chatId/message/:messageId', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { chatId, messageId } = req.params;

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        const msgIndex = chat.messages.findIndex(m => m.id === messageId);
        if (msgIndex === -1) {
            return res.status(404).json({ message: 'Message not found' });
        }

        if (chat.messages[msgIndex].senderId !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        chat.messages.splice(msgIndex, 1);

        const savedChat = await chat.save();
        res.json(savedChat);
    } catch (error) {
        res.status(400).json({ message: 'Error deleting message', error });
    }
});

// MUTE/UNMUTE chat
router.put('/:chatId/mute', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const chatId = req.params.chatId;
        const { mute } = req.body;

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        if (!chat.mutedBy) chat.mutedBy = [];

        if (mute) {
            if (!chat.mutedBy.includes(req.userId!)) {
                chat.mutedBy.push(req.userId!);
            }
        } else {
            chat.mutedBy = chat.mutedBy.filter(id => id !== req.userId);
        }

        const savedChat = await chat.save();
        res.json(savedChat);
    } catch (error) {
        res.status(400).json({ message: 'Error updating mute status', error });
    }
});

// MARK messages as read
router.put('/:chatId/read', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const chatId = req.params.chatId;
        const userId = req.userId;

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        if (!chat.unreadBy) chat.unreadBy = [];

        // Mark all as read for this user
        chat.unreadBy = chat.unreadBy.filter(u => u.userId !== userId);

        const savedChat = await chat.save();
        res.json(savedChat);
    } catch (error) {
        res.status(400).json({ message: 'Error marking as read', error });
    }
});

// REGISTER/UPDATE call
router.post('/:chatId/call', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const chatId = req.params.chatId;
        const { callId, endTime, accepted } = req.body;

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        if (!chat.calls) chat.calls = [];

        if (endTime) {
            // Update existing call
            const callIndex = chat.calls.findIndex(c => c.id === callId);
            if (callIndex !== -1) {
                chat.calls[callIndex].endTime = endTime;
                chat.calls[callIndex].duration = Math.floor((endTime - chat.calls[callIndex].startTime) / 1000);
                if (accepted !== undefined) chat.calls[callIndex].accepted = accepted;
            }
        } else {
            // Create new call
            const newCall = {
                id: callId || `call_${Date.now()}`,
                initiatorId: req.userId!,
                startTime: Date.now(),
                accepted: false
            };
            chat.calls.push(newCall);
        }

        const savedChat = await chat.save();
        res.json(savedChat);
    } catch (error) {
        res.status(400).json({ message: 'Error recording call', error });
    }
});

export default router;
