import express from 'express';
import Group from '../models/Group';
import User from '../models/User';
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

// GET specific group with full details
router.get('/:id', async (req: AuthenticatedRequest, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.json(group);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching group', error });
    }
});

// CREATE a new group
router.post('/', async (req: AuthenticatedRequest, res) => {
    try {
        const { name, description, game, image, isPrivate } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Group name is required' });
        }

        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: 'userId required' });
        }

        const newGroup = new Group({
            name,
            description: description || 'A new gaming squad',
            game: game || 'Valorant',
            image: image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
            isPrivate: isPrivate || false,
            members: [userId],
            createdBy: userId,
            roles: [{ userId, role: 'admin' }],
            joinRequests: [],
            stats: {
                membersCount: 1,
                matchesPlayed: 0,
                wins: 0
            },
            activity: [{
                id: `act_${Date.now()}`,
                userId,
                action: 'joined',
                timestamp: new Date(),
                details: { message: 'Squad created' }
            }]
        });

        const savedGroup = await newGroup.save();
        res.status(201).json(savedGroup);
    } catch (error) {
        res.status(400).json({ message: 'Error creating group', error });
    }
});

// JOIN a group (add member or request to join if private)
router.post('/:id/join', async (req: AuthenticatedRequest, res) => {
    try {
        const groupId = req.params.id;
        const userId = req.userId;
        if (!userId) return res.status(401).json({ message: 'userId required' });

        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: 'Group not found' });

        // Check if already member
        if (group.members.includes(userId)) {
            return res.status(400).json({ message: 'Already a member of this group' });
        }

        if (group.isPrivate) {
            // Add to join requests
            if (!group.joinRequests.includes(userId)) {
                group.joinRequests.push(userId);
                await group.save();
            }
            return res.json({ message: 'Join request sent', group });
        }

        // Add as member
        group.members.push(userId);
        group.stats.membersCount = group.members.length;

        // Add activity
        group.activity.push({
            id: `act_${Date.now()}`,
            userId,
            action: 'joined',
            timestamp: new Date(),
            details: {}
        });

        await group.save();
        res.json(group);
    } catch (error) {
        res.status(400).json({ message: 'Error joining group', error });
    }
});

// INVITE a member to group
router.post('/:id/members/invite', async (req: AuthenticatedRequest, res) => {
    try {
        const { targetUserId } = req.body;
        const groupId = req.params.id;
        const userId = req.userId;

        if (!targetUserId) {
            return res.status(400).json({ message: 'targetUserId required' });
        }

        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: 'Group not found' });

        // Check if user is admin
        const userRole = group.roles.find(r => r.userId === userId);
        if (!userRole || userRole.role === 'member') {
            return res.status(403).json({ message: 'Only admin/officer can invite' });
        }

        // Check if target is already member or already requested
        if (group.members.includes(targetUserId) || group.joinRequests.includes(targetUserId)) {
            return res.status(400).json({ message: 'User already in group or request pending' });
        }

        // Add to join requests
        group.joinRequests.push(targetUserId);
        await group.save();

        res.json({ message: 'Invitation sent', group });
    } catch (error) {
        res.status(500).json({ message: 'Error inviting member', error });
    }
});

// APPROVE join request
router.post('/:id/join-requests/:userId/approve', async (req: AuthenticatedRequest, res) => {
    try {
        const { id, userId } = req.params;
        const adminUserId = req.userId;

        const group = await Group.findById(id);
        if (!group) return res.status(404).json({ message: 'Group not found' });

        // Check if admin
        const adminRole = group.roles.find(r => r.userId === adminUserId);
        if (!adminRole || adminRole.role === 'member') {
            return res.status(403).json({ message: 'Only admin can approve requests' });
        }

        // Remove from requests and add as member
        group.joinRequests = group.joinRequests.filter(id => id !== userId);
        if (!group.members.includes(userId)) {
            group.members.push(userId);
            group.roles.push({ userId, role: 'member' });
            group.stats.membersCount = group.members.length;

            // Add activity
            group.activity.push({
                id: `act_${Date.now()}`,
                userId,
                action: 'joined',
                timestamp: new Date(),
                details: { approvedBy: adminUserId }
            });
        }

        await group.save();
        res.json({ message: 'Request approved', group });
    } catch (error) {
        res.status(500).json({ message: 'Error approving request', error });
    }
});

// CHANGE member role
router.put('/:id/members/:userId/role', async (req: AuthenticatedRequest, res) => {
    try {
        const { id, userId } = req.params;
        const { role } = req.body;
        const adminUserId = req.userId;

        if (!['admin', 'officer', 'member'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const group = await Group.findById(id);
        if (!group) return res.status(404).json({ message: 'Group not found' });

        // Check if admin
        const adminRole = group.roles.find(r => r.userId === adminUserId);
        if (!adminRole || adminRole.role === 'member') {
            return res.status(403).json({ message: 'Only admin can change roles' });
        }

        // Cannot demote the creator
        if (group.createdBy === userId && role !== 'admin') {
            return res.status(400).json({ message: 'Cannot demote group creator' });
        }

        // Find and update role
        const memberRole = group.roles.find(r => r.userId === userId);
        if (!memberRole) {
            return res.status(404).json({ message: 'Member not found' });
        }

        const oldRole = memberRole.role;
        memberRole.role = role;

        // Add activity
        group.activity.push({
            id: `act_${Date.now()}`,
            userId,
            action: 'promoted',
            timestamp: new Date(),
            details: { oldRole, newRole: role, changedBy: adminUserId }
        });

        await group.save();
        res.json({ message: `Member promoted to ${role}`, group });
    } catch (error) {
        res.status(500).json({ message: 'Error changing role', error });
    }
});

// KICK/REMOVE member from group
router.delete('/:id/members/:userId', async (req: AuthenticatedRequest, res) => {
    try {
        const { id, userId } = req.params;
        const adminUserId = req.userId;

        const group = await Group.findById(id);
        if (!group) return res.status(404).json({ message: 'Group not found' });

        // Check if admin (or self-remove)
        if (userId !== adminUserId) {
            const adminRole = group.roles.find(r => r.userId === adminUserId);
            if (!adminRole || adminRole.role === 'member') {
                return res.status(403).json({ message: 'Only admin can remove members' });
            }
        }

        // Cannot remove creator
        if (group.createdBy === userId && userId !== adminUserId) {
            return res.status(400).json({ message: 'Cannot remove group creator' });
        }

        // Remove from members and roles
        group.members = group.members.filter(id => id !== userId);
        group.roles = group.roles.filter(r => r.userId !== userId);
        group.stats.membersCount = group.members.length;

        // Determine action for activity log
        const action = userId === adminUserId ? 'left' : 'kicked';
        group.activity.push({
            id: `act_${Date.now()}`,
            userId,
            action: action as any,
            timestamp: new Date(),
            details: action === 'kicked' ? { kickedBy: adminUserId } : {}
        });

        await group.save();
        res.json({ message: `Member ${action}`, group });
    } catch (error) {
        res.status(500).json({ message: 'Error removing member', error });
    }
});

// GET group activity feed
router.get('/:id/activity', async (req: AuthenticatedRequest, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ message: 'Group not found' });

        // Sort activity by timestamp descending (newest first)
        const activity = group.activity.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        res.json(activity);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching activity', error });
    }
});

// POST activity event (internal use by server)
router.post('/:id/activity', async (req: AuthenticatedRequest, res) => {
    try {
        const { action, details } = req.body;
        const groupId = req.params.id;
        const userId = req.userId;

        if (!action) {
            return res.status(400).json({ message: 'action required' });
        }

        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: 'Group not found' });

        group.activity.push({
            id: `act_${Date.now()}`,
            userId,
            action: action as any,
            timestamp: new Date(),
            details: details || {}
        });

        await group.save();
        res.json(group);
    } catch (error) {
        res.status(500).json({ message: 'Error creating activity', error });
    }
});

// DELETE/DISBAND group (admin only)
router.delete('/:id', async (req: AuthenticatedRequest, res) => {
    try {
        const groupId = req.params.id;
        const userId = req.userId;

        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: 'Group not found' });

        // Check if creator/admin
        if (group.createdBy !== userId) {
            return res.status(403).json({ message: 'Only group creator can disband' });
        }

        await Group.findByIdAndDelete(groupId);
        res.json({ message: 'Group disbanded successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error disbanding group', error });
    }
});

export default router;
