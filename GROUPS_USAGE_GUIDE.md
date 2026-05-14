# 🎮 Sistema de Grupos - Ejemplos de Uso

## Cómo Usar el Sistema de Squads

### 1. 🆕 Crear un Squad

**UI Flow:**
```
Dashboard → Click "+" en sección Groups
  → Modal aparece
    → Ingresa nombre: "Elite Valorant Squad"
    → Ingresa descripción: "Squad competitivo para ranked"
    → Selecciona juego: "Valorant"
    → Click "Create Squad"
  → ✅ Squad creado y aparece en sidebar
```

**API Call (Backend):**
```typescript
POST /api/groups
{
  "name": "Elite Valorant Squad",
  "description": "Squad competitivo para ranked",
  "game": "Valorant",
  "image": "https://...",
  "isPrivate": false
}

Response:
{
  "_id": "63a8f2d4c5f8e9b2a1c3d5e6",
  "name": "Elite Valorant Squad",
  "members": ["user123"],
  "roles": [{ "userId": "user123", "role": "admin" }],
  "createdBy": "user123",
  "stats": { "membersCount": 1, "matchesPlayed": 0, "wins": 0 },
  "activity": [{ "id": "act_1", "action": "joined", "userId": "user123", ... }]
}
```

**JavaScript (Frontend):**
```typescript
const handleCreateSquad = async () => {
  try {
    const newSquad = await api.groups.create({
      name: "Elite Valorant Squad",
      description: "Squad competitivo",
      game: "Valorant",
      image: imageUrl,
      isPrivate: false
    });
    console.log("✅ Squad creado:", newSquad._id);
  } catch (err) {
    console.error("❌ Error:", err);
  }
};
```

---

### 2. 👤 Invitar Miembro al Squad

**UI Flow:**
```
Squad Detail → Click "Invitar"
  → Modal "Invite Member" aparece
    → Escribe nombre de usuario: "Pro_Player_99"
    → Click "Invitar"
  → ✅ Notificación: "Invitación enviada a Pro_Player_99"
```

**API Call (Backend):**
```typescript
POST /api/groups/:groupId/members/invite
{
  "targetUserId": "user456"
}

Response:
{
  "message": "Invitation sent",
  "group": {
    ...groupData,
    "joinRequests": ["user456"]
  }
}
```

**JavaScript:**
```typescript
const handleInviteMember = async (groupId, userId) => {
  try {
    const result = await api.groups.invite(groupId, userId);
    console.log("✅ Invitación enviada");
  } catch (err) {
    console.error("❌ Error:", err);
  }
};
```

---

### 3. ✅ Aprobar Solicitud de Entrada (Admin)

**Escenario:**
- Squad es privado
- User solicitó entrar
- Admin quiere aprobar

**UI Flow:**
```
Squad Detail → Tab "Solicitudes"
  → Ver lista de usuarios pendientes
    → Click "Aprobar" junto a usuario
  → ✅ Usuario agregado a squad
```

**API Call:**
```typescript
POST /api/groups/:groupId/join-requests/:userId/approve

Response:
{
  "message": "Request approved",
  "group": {
    ...groupData,
    "members": ["user123", "user456"],
    "roles": [
      { "userId": "user123", "role": "admin" },
      { "userId": "user456", "role": "member" }
    ]
  }
}
```

**JavaScript:**
```typescript
const handleApproveMember = async (groupId, userId) => {
  try {
    const result = await api.groups.approveMember(groupId, userId);
    console.log("✅ Miembro aprobado");
  } catch (err) {
    console.error("❌ Error:", err);
  }
};
```

---

### 4. 🔄 Cambiar Rol de Miembro (Admin)

**Escenario:**
- Admin quiere promover a "Pro_Player_99" a Officer

**UI Flow:**
```
Squad Detail → Tab "Miembros"
  → Ver miembro "Pro_Player_99"
    → Click "Promover"
  → ✅ Rol cambia a "officer"
```

**API Call:**
```typescript
PUT /api/groups/:groupId/members/:userId/role
{
  "role": "officer"
}

Response:
{
  "message": "Member promoted to officer",
  "group": {
    ...groupData,
    "roles": [
      { "userId": "user123", "role": "admin" },
      { "userId": "user456", "role": "officer" }
    ]
  }
}
```

**JavaScript:**
```typescript
const handlePromote = async (groupId, userId, newRole) => {
  try {
    const result = await api.groups.changeRole(groupId, userId, newRole);
    console.log(`✅ Miembro promovido a ${newRole}`);
  } catch (err) {
    console.error("❌ Error:", err);
  }
};
```

---

### 5. 🚫 Expulsar Miembro (Admin)

**Escenario:**
- Admin quiere remover a miembro problemático

**UI Flow:**
```
Squad Detail → Tab "Miembros"
  → Click "Expulsar" junto al miembro
    → Confirmación: "¿Estás seguro?"
    → Click "Expulsar"
  → ✅ Miembro removido
```

**API Call:**
```typescript
DELETE /api/groups/:groupId/members/:userId

Response:
{
  "message": "Member kicked",
  "group": {
    ...groupData,
    "members": ["user123"],
    "roles": [{ "userId": "user123", "role": "admin" }]
  }
}
```

**JavaScript:**
```typescript
const handleKickMember = async (groupId, userId) => {
  try {
    const result = await api.groups.removeMember(groupId, userId);
    console.log("✅ Miembro expulsado");
  } catch (err) {
    console.error("❌ Error:", err);
  }
};
```

---

### 6. 👋 Dejar Squad (Member)

**Escenario:**
- Usuario quiere dejar el squad

**UI Flow:**
```
Squad Detail → Click "Dejar Squad"
  → Modal confirmación: "¿Dejar este squad?"
    → Click "Dejar"
  → ✅ Squad se cierra y vuelve a lista
```

**API Call:**
```typescript
DELETE /api/groups/:groupId/members/:userId

Response:
{
  "message": "Member left",
  "group": {
    ...groupData,
    "members": ["user123"]  // user456 removido
  }
}
```

**JavaScript:**
```typescript
const handleLeaveSquad = async (groupId, userId) => {
  try {
    const result = await api.groups.removeMember(groupId, userId);
    console.log("✅ Has dejado el squad");
    // Volver a lista de squads
  } catch (err) {
    console.error("❌ Error:", err);
  }
};
```

---

### 7. 📊 Ver Feed de Actividad

**UI Flow:**
```
Squad Detail → Tab "Actividad"
  → Ver timeline de eventos:
    - "Pro_Player_99 ganó partida (22K)"
    - "elite_member fue promovido a officer"
    - "newbie_player se unió al squad"
```

**API Call:**
```typescript
GET /api/groups/:groupId/activity

Response: [
  {
    "id": "act_789",
    "userId": "user456",
    "action": "match_won",
    "timestamp": "2026-05-13T10:30:00Z",
    "details": { "kills": 22, "deaths": 5 }
  },
  {
    "id": "act_788",
    "userId": "user456",
    "action": "promoted",
    "timestamp": "2026-05-13T09:15:00Z",
    "details": { "oldRole": "member", "newRole": "officer" }
  },
  {
    "id": "act_787",
    "userId": "user456",
    "action": "joined",
    "timestamp": "2026-05-10T14:20:00Z",
    "details": {}
  }
]
```

**JavaScript:**
```typescript
const loadActivity = async (groupId) => {
  try {
    const activity = await api.groups.getActivity(groupId);
    console.log("📊 Activity feed:", activity);
  } catch (err) {
    console.error("❌ Error:", err);
  }
};
```

---

### 8. 🗑️ Disolver Squad (Admin)

**Escenario:**
- Admin quiere disolver el squad permanentemente

**UI Flow:**
```
Squad Detail → Click "Disolver Squad"
  → Modal aviso: "⚠️ Esta acción es irreversible"
    → Click "Disolver"
  → ✅ Squad eliminado
```

**API Call:**
```typescript
DELETE /api/groups/:groupId

Response:
{
  "message": "Group disbanded successfully"
}
```

**JavaScript:**
```typescript
const handleDisband = async (groupId) => {
  try {
    const result = await api.groups.disband(groupId);
    console.log("✅ Squad disuelto");
  } catch (err) {
    console.error("❌ Error:", err);
  }
};
```

---

## 🌊 Flujos Comunes

### Flujo: Crear Squad y Agregar Miembros

```typescript
// 1. Usuario crea squad
const squad = await api.groups.create({
  name: "Pro Team",
  description: "Squad competitivo",
  game: "Valorant",
  image: url,
  isPrivate: false
});
// ✅ Usuario es admin automáticamente

// 2. Admin invita 3 amigos
await api.groups.invite(squad._id, "friend1");
await api.groups.invite(squad._id, "friend2");
await api.groups.invite(squad._id, "friend3");
// ✅ Amigos reciben invitación

// 3. Si es privado, admin aprueba
await api.groups.approveMember(squad._id, "friend1");
// ✅ friend1 se une al squad

// 4. Admin promociona a officers
await api.groups.changeRole(squad._id, "friend1", "officer");
// ✅ friend1 ahora tiene permisos especiales

// 5. Squad genera actividad
await api.groups.addActivity(squad._id, "match_won", {
  kills: 25,
  deaths: 8
});
// ✅ Se registra en activity feed
```

---

## 📋 Estado de Roles

### ¿Quién puede hacer qué?

```
CREAR SQUAD           → Cualquier usuario (automáticamente admin)
INVITAR MIEMBRO       → Admin/Officer (futuro)
APROBAR SOLICITUD     → Admin
CAMBIAR ROL           → Admin
EXPULSAR MIEMBRO      → Admin
DEJAR SQUAD           → Cualquier miembro
DISOLVER SQUAD        → Admin (creador)
VER ACTIVIDAD         → Todos los miembros
VER MIEMBROS          → Todos los miembros
```

---

## 🔒 Errores Comunes

### Error: "Only admin can..."
```
❌ Intenta hacer acción de admin sin serlo
✅ Solución: Contacta al admin para que te promueva
```

### Error: "Already a member of this group"
```
❌ Ya estás en el squad
✅ Solución: Verifica que no estés duplicado
```

### Error: "User already invited"
```
❌ Ya invitaste a este usuario o está pendiente
✅ Solución: Espera a que responda o retira invitación
```

### Error: "Cannot demote group creator"
```
❌ No puedes cambiar rol del creador
✅ Solución: El creador siempre es admin
```

---

## 💡 Tips & Tricks

### Para Admins
- ✅ Invita a miembros confiables para expandir equipo
- ✅ Promueve a officers para delegación
- ✅ Revisa activity feed para monitorear squad
- ✅ Expulsa si hay problemas de comportamiento

### Para Members
- ✅ Completa perfil para mejor visibilidad
- ✅ Participa activamente en matches
- ✅ Sé respetuoso con otros miembros
- ✅ Comunica si vas a dejar el squad

---

## 📞 Contacto / Soporte

Si encuentras bugs o issues:
1. Verifica que tengas conexión con MongoDB
2. Comprueba que tu token sea válido
3. Revisa la consola para error details
4. Contacta al equipo de dev

---

**Happy Squading! 🎮✨**
