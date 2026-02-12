const API_URL = 'http://localhost:5000/api';

export const api = {
    users: {
        getAll: async () => {
            const response = await fetch(`${API_URL}/users`);
            if (!response.ok) throw new Error('Failed to fetch users');
            return response.json();
        },
        getById: async (id: string) => {
            const response = await fetch(`${API_URL}/users/${id}`);
            if (!response.ok) throw new Error('Failed to fetch user');
            return response.json();
        },
        create: async (userData: any) => {
            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            if (!response.ok) throw new Error('Failed to create user');
            return response.json();
        }
    },
    groups: {
        getAll: async () => {
            const response = await fetch(`${API_URL}/groups`);
            if (!response.ok) throw new Error('Failed to fetch groups');
            return response.json();
        },
        create: async (groupData: any) => {
            const response = await fetch(`${API_URL}/groups`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(groupData),
            });
            if (!response.ok) throw new Error('Failed to create group');
            return response.json();
        }
    },
    tournaments: {
        getAll: async () => {
            const response = await fetch(`${API_URL}/tournaments`);
            if (!response.ok) throw new Error('Failed to fetch tournaments');
            return response.json();
        }
    },
    chats: {
        getByUserId: async (userId: string) => {
            const response = await fetch(`${API_URL}/chats/${userId}`);
            if (!response.ok) throw new Error('Failed to fetch chats');
            return response.json();
        },
        sendMessage: async (data: { chatId?: string, participants: string[], message: any }) => {
            const response = await fetch(`${API_URL}/chats/message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to send message');
            return response.json();
        }
    }
};
