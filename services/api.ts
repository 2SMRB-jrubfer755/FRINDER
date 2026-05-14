const API_URL = (import.meta as any).env?.VITE_API_URL || '/api';

// Global token storage
let authToken: string | null = sessionStorage.getItem('frinderSessionToken');

// Helper para agregar token a headers
const getHeaders = (includeAuth = true) => {
  const headers: any = { 'Content-Type': 'application/json' };
  // ensure we always read latest token either from memory or sessionStorage
  const token = authToken || sessionStorage.getItem('frinderSessionToken');
  if (includeAuth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Helper para hacer fetch con token
const fetchWithAuth = async (url: string, options: any = {}) => {
  const finalOptions = {
    ...options,
    headers: {
      ...getHeaders(options.includeAuth !== false),
      ...options.headers,
    },
  };
  const res = await fetch(url, finalOptions);
  if (res.status === 401) {
    // session invalid, clear local token immediately
    api.session.setToken(null);
  }
  return res;
};

export const api = {
  // Sesión management
  session: {
    setToken: (token: string | null) => {
      authToken = token;
      if (token) {
        sessionStorage.setItem('frinderSessionToken', token);
      } else {
        sessionStorage.removeItem('frinderSessionToken');
      }
    },

    getToken: () => authToken || sessionStorage.getItem('frinderSessionToken'),

    create: async (userId: string) => {
      const response = await fetch(`${API_URL}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error('Failed to create session');
      const data = await response.json();
      if (!data || !data.token) {
        throw new Error('Session creation failed: missing token');
      }
      api.session.setToken(data.token);
      return data;
    },

    getCurrent: async () => {
      const response = await fetchWithAuth(`${API_URL}/sessions/me`);
      if (!response.ok) {
        api.session.setToken(null);
        throw new Error('Failed to fetch session');
      }
      return response.json();
    },

    logout: async () => {
      const token = api.session.getToken();
      if (token) {
        try {
          await fetch(`${API_URL}/sessions/${token}`, { method: 'DELETE' });
        } catch (e) {
          console.error('Error logging out', e);
        }
      }
      api.session.setToken(null);
    },
  },

  users: {
    getAll: async () => {
      const response = await fetchWithAuth(`${API_URL}/users`);
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },

    getById: async (id: string) => {
      const response = await fetchWithAuth(`${API_URL}/users/${id}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    },

    create: async (userData: any) => {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        let msg = 'Failed to create user';
        try {
          const errData = await response.json();
          msg = errData.message || msg;
        } catch {}
        throw new Error(msg);
      }
      const data = await response.json();
      if (!data || typeof data !== 'object' || (!data.id && !data._id)) {
        throw new Error('User creation response invalid: missing ID');
      }
      return data;
    },

    login: async (credentials: { email: string; password: string }) => {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        let msg = 'Failed to login user';
        try {
          const errData = await response.json();
          msg = errData.message || msg;
        } catch {}
        throw new Error(msg);
      }
      const data = await response.json();
      if (!data || typeof data !== 'object' || (!data.id && !data._id)) {
        throw new Error('Login response invalid: missing user data');
      }
      return data;
    },

    update: async (id: string, userData: any) => {
      const response = await fetchWithAuth(`${API_URL}/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error('Failed to update user');
      return response.json();
    },

    purchasePremium: async (id: string) => {
      const response = await fetchWithAuth(`${API_URL}/users/${id}/premium`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to purchase premium');
      return response.json();
    },

    addFavorite: async (userId: string, targetUserId: string) => {
      const response = await fetchWithAuth(`${API_URL}/users/${userId}/favorites/${targetUserId}`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to add favorite');
      return response.json();
    },

    removeFavorite: async (userId: string, targetUserId: string) => {
      const response = await fetchWithAuth(`${API_URL}/users/${userId}/favorites/${targetUserId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove favorite');
      return response.json();
    },

    skipUser: async (userId: string, targetUserId: string) => {
      const response = await fetchWithAuth(`${API_URL}/users/${userId}/skip/${targetUserId}`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to skip user');
      return response.json();
    },

    addXP: async (userId: string, amount: number, reason?: string) => {
      const response = await fetchWithAuth(`${API_URL}/users/${userId}/xp`, {
        method: 'POST',
        body: JSON.stringify({ amount, reason }),
      });
      if (!response.ok) throw new Error('Failed to add XP');
      return response.json();
    },

    addFrins: async (userId: string, amount: number, reason?: string) => {
      const response = await fetchWithAuth(`${API_URL}/users/${userId}/frins`, {
        method: 'POST',
        body: JSON.stringify({ amount, reason }),
      });
      if (!response.ok) throw new Error('Failed to add Frins');
      return response.json();
    },

    recordMatch: async (userId: string, won: boolean, frinsReward?: number) => {
      const response = await fetchWithAuth(`${API_URL}/users/${userId}/match`, {
        method: 'POST',
        body: JSON.stringify({ won, frinsReward }),
      });
      if (!response.ok) throw new Error('Failed to record match');
      return response.json();
    },

    getLeaderboard: async (limit: number = 10) => {
      const response = await fetchWithAuth(`${API_URL}/users/leaderboard/top?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      return response.json();
    },
  },

  groups: {
    getAll: async () => {
      const response = await fetchWithAuth(`${API_URL}/groups`);
      if (!response.ok) throw new Error('Failed to fetch groups');
      return response.json();
    },

    getById: async (groupId: string) => {
      const response = await fetchWithAuth(`${API_URL}/groups/${groupId}`);
      if (!response.ok) throw new Error('Failed to fetch group');
      return response.json();
    },

    create: async (groupData: any) => {
      const response = await fetchWithAuth(`${API_URL}/groups`, {
        method: 'POST',
        body: JSON.stringify(groupData),
      });
      if (!response.ok) {
        let msg = 'Failed to create group';
        try {
          const errData = await response.json();
          msg = errData.message || msg;
        } catch {};
        throw new Error(msg);
      }
      return response.json();
    },

    join: async (groupId: string) => {
      const response = await fetchWithAuth(`${API_URL}/groups/${groupId}/join`, {
        method: 'POST'
      });
      if (!response.ok) {
        let msg = 'Failed to join group';
        try { const err = await response.json(); msg = err.message || msg; } catch {};
        throw new Error(msg);
      }
      return response.json();
    },

    invite: async (groupId: string, targetUserId: string) => {
      const response = await fetchWithAuth(`${API_URL}/groups/${groupId}/members/invite`, {
        method: 'POST',
        body: JSON.stringify({ targetUserId }),
      });
      if (!response.ok) {
        let msg = 'Failed to invite member';
        try { const err = await response.json(); msg = err.message || msg; } catch {};
        throw new Error(msg);
      }
      return response.json();
    },

    approveMember: async (groupId: string, userId: string) => {
      const response = await fetchWithAuth(`${API_URL}/groups/${groupId}/join-requests/${userId}/approve`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to approve member');
      return response.json();
    },

    changeRole: async (groupId: string, userId: string, role: string) => {
      const response = await fetchWithAuth(`${API_URL}/groups/${groupId}/members/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role }),
      });
      if (!response.ok) throw new Error('Failed to change role');
      return response.json();
    },

    removeMember: async (groupId: string, userId: string) => {
      const response = await fetchWithAuth(`${API_URL}/groups/${groupId}/members/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove member');
      return response.json();
    },

    getActivity: async (groupId: string) => {
      const response = await fetchWithAuth(`${API_URL}/groups/${groupId}/activity`);
      if (!response.ok) throw new Error('Failed to fetch activity');
      return response.json();
    },

    addActivity: async (groupId: string, action: string, details?: any) => {
      const response = await fetchWithAuth(`${API_URL}/groups/${groupId}/activity`, {
        method: 'POST',
        body: JSON.stringify({ action, details }),
      });
      if (!response.ok) throw new Error('Failed to add activity');
      return response.json();
    },

    disband: async (groupId: string) => {
      const response = await fetchWithAuth(`${API_URL}/groups/${groupId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to disband group');
      return response.json();
    },
  },

  tournaments: {
    getAll: async () => {
      const response = await fetchWithAuth(`${API_URL}/tournaments`);
      if (!response.ok) throw new Error('Failed to fetch tournaments');
      return response.json();
    },

    join: async (tournamentId: string) => {
      const response = await fetchWithAuth(`${API_URL}/tournaments/${tournamentId}/join`, {
        method: 'POST'
      });
      if (!response.ok) {
        let msg = 'Failed to join tournament';
        try { const err = await response.json(); msg = err.message || msg; } catch {};
        throw new Error(msg);
      }
      return response.json();
    },
  },

  chats: {
    getByUserId: async (userId: string) => {
      const response = await fetchWithAuth(`${API_URL}/chats/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch chats');
      return response.json();
    },

    getChat: async (chatId: string) => {
      const response = await fetchWithAuth(`${API_URL}/chats/chat/${chatId}`);
      if (!response.ok) throw new Error('Failed to fetch chat');
      return response.json();
    },

    sendMessage: async (data: { chatId?: string; participants: string[]; message: any }) => {
      const response = await fetchWithAuth(`${API_URL}/chats/message`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to send message');
      return response.json();
    },

    updateChat: async (chatId: string, updates: { chatName?: string; isPrivate?: boolean }) => {
      const response = await fetchWithAuth(`${API_URL}/chats/${chatId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update chat');
      return response.json();
    },

    editMessage: async (chatId: string, messageId: string, text: string) => {
      const response = await fetchWithAuth(`${API_URL}/chats/${chatId}/message/${messageId}`, {
        method: 'PUT',
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error('Failed to edit message');
      return response.json();
    },

    deleteMessage: async (chatId: string, messageId: string) => {
      const response = await fetchWithAuth(`${API_URL}/chats/${chatId}/message/${messageId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete message');
      return response.json();
    },

    muteChat: async (chatId: string, mute: boolean) => {
      const response = await fetchWithAuth(`${API_URL}/chats/${chatId}/mute`, {
        method: 'PUT',
        body: JSON.stringify({ mute }),
      });
      if (!response.ok) throw new Error('Failed to mute chat');
      return response.json();
    },

    markAsRead: async (chatId: string) => {
      const response = await fetchWithAuth(`${API_URL}/chats/${chatId}/read`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Failed to mark as read');
      return response.json();
    },

    recordCall: async (chatId: string, callData: { callId?: string; endTime?: number; accepted?: boolean }) => {
      const response = await fetchWithAuth(`${API_URL}/chats/${chatId}/call`, {
        method: 'POST',
        body: JSON.stringify(callData),
      });
      if (!response.ok) throw new Error('Failed to record call');
      return response.json();
    },
  },
};
