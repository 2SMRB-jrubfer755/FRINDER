# 🏗️ Arquitectura del Sistema de Grupos

## Diagrama de Flujo Principal

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USUARIO (Frontend)                           │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  Squad List  │  │  Squad Header│  │   Tabs View  │              │
│  │              │  │              │  │              │              │
│  │ • Crear (+)  │  │ • Stats      │  │ • Members    │              │
│  │ • Selector   │  │ • Actions    │  │ • Activity   │              │
│  │ • Scroll     │  │ • Modals     │  │ • Tournaments│              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│         │                 │                    │                    │
└─────────┼─────────────────┼────────────────────┼────────────────────┘
          │                 │                    │
          ├─────────────────┴────────────────────┤
          │                                      │
          ▼                                      ▼
    ┌──────────────────────────────────────────────────────┐
    │        API SERVICE LAYER (services/api.ts)           │
    │                                                      │
    │  api.groups.{                                        │
    │    create(),      invite(),      changeRole(),       │
    │    getById(),     approveMember(), removeMember(),   │
    │    getAll(),      getActivity(),   addActivity(),    │
    │    join(),        disband()                          │
    │  }                                                   │
    └──────────────────────────────────────────────────────┘
              │                          │
              └──────────────┬───────────┘
                             ▼
    ┌──────────────────────────────────────────────────────┐
    │      BACKEND API (server/routes/groups.ts)           │
    │                                                      │
    │  11 REST Endpoints with:                            │
    │  • Authentication (Bearer Token)                    │
    │  • Authorization (Role-based)                       │
    │  • Validation                                       │
    │  • Error Handling                                   │
    └──────────────────────────────────────────────────────┘
              │
              ▼
    ┌──────────────────────────────────────────────────────┐
    │    DATABASE (server/models/Group.ts + MongoDB)       │
    │                                                      │
    │  Schema:                                            │
    │  • name, description, game, image                   │
    │  • members[], roles[], joinRequests[]               │
    │  • createdBy, isPrivate                             │
    │  • stats { membersCount, matchesPlayed, wins }      │
    │  • activity[] { id, userId, action, timestamp }     │
    │  • createdAt, updatedAt                             │
    └──────────────────────────────────────────────────────┘
```

---

## Flujo de Datos - Crear Squad

```
Usuario Clicks "+"
         │
         ▼
Modal de Crear Squad
         │
         ├─ Ingresa: name, description, game
         │
         ▼
handleCreateSquad()
         │
         ├─ Validar datos
         │
         ▼
api.groups.create(data)
         │
         ▼
POST /api/groups
         │
         ▼
Backend Valida Token
         │
         ├─ ✅ Token válido
         │
         ▼
Crea documento Group
         │
         ├─ name, description, game, image
         ├─ members: [userId]
         ├─ roles: [{userId, role: 'admin'}]
         ├─ createdBy: userId
         ├─ stats: {membersCount: 1, ...}
         ├─ activity: [{action: 'joined', ...}]
         │
         ▼
MongoDB Guarda documento
         │
         ▼
Retorna Group object
         │
         ▼
Frontend Actualiza Estado
         │
         ├─ Agrega a lista de squads
         ├─ Selecciona automáticamente
         ├─ Carga detalles
         │
         ▼
✅ Squad Visible en UI
```

---

## Flujo de Datos - Invitar Miembro

```
Admin Clicks "Invitar"
         │
         ▼
Modal "Invite Member"
         │
         ├─ Busca usuario: "username"
         │
         ▼
handleInviteMember(groupId, targetUserId)
         │
         ├─ Validar:
         │   ├─ User existe?
         │   ├─ Ya en squad?
         │   ├─ Eres admin?
         │
         ▼
api.groups.invite(groupId, targetUserId)
         │
         ▼
POST /api/groups/:id/members/invite
         │
         ▼
Backend:
         │
         ├─ Verifica token
         ├─ Verifica permission (admin)
         ├─ Verifica user no en squad
         │
         ▼
Actualiza MongoDB:
         │
         ├─ Agrega targetUserId a joinRequests[]
         │
         ▼
Retorna Group
         │
         ▼
Frontend:
         │
         ├─ Muestra notificación
         ├─ Cierra modal
         ├─ Recarga data
         │
         ▼
✅ Invitación Enviada
```

---

## Flujo de Datos - Cambiar Rol

```
Admin Ve Miembro en Tab "Members"
         │
         ▼
Click "Promover"
         │
         ▼
handlePromoteMember(userId, newRole)
         │
         ├─ Determina nuevo rol:
         │   ├─ Si es 'member' → 'officer'
         │   ├─ Si es 'officer' → 'member'
         │
         ▼
api.groups.changeRole(groupId, userId, newRole)
         │
         ▼
PUT /api/groups/:id/members/:userId/role
         │
         ▼
Backend:
         │
         ├─ Verifica token
         ├─ Verifica eres admin
         ├─ No se puede cambiar creador
         │
         ▼
Actualiza MongoDB:
         │
         ├─ Busca en roles[] el objeto con userId
         ├─ Cambia role a newRole
         ├─ Agrega a activity[] evento 'promoted'
         │
         ▼
Retorna Group actualizado
         │
         ▼
Frontend:
         │
         ├─ Actualiza UI
         ├─ Muestra badge nuevo rol
         ├─ Recarga activity feed
         │
         ▼
✅ Rol Actualizado
```

---

## Estructura de Datos - Activity Feed

```typescript
Group.activity[] = [
  // Event más reciente
  {
    id: "act_1234567890",
    userId: "user456",
    action: "match_won",
    timestamp: "2026-05-13T10:30:00Z",
    details: {
      kills: 22,
      deaths: 5,
      damage: 2400
    }
  },
  // Evento anterior
  {
    id: "act_1234567889",
    userId: "user456",
    action: "promoted",
    timestamp: "2026-05-13T09:15:00Z",
    details: {
      oldRole: "member",
      newRole: "officer",
      changedBy: "user123"
    }
  },
  // Evento más antiguo
  {
    id: "act_1234567888",
    userId: "user456",
    action: "joined",
    timestamp: "2026-05-10T14:20:00Z",
    details: {
      approvedBy: "user123"
    }
  }
]
```

---

## Estados de Permiso

```
┌─────────────────────────────────────────────┐
│  User es Admin?                             │
├─────────────────────────────────────────────┤
│  ✅ Si: createdBy === currentUserId         │
│  ✅ Si: roles.find(r => r.role === 'admin')│
│  ❌ No: Es Officer o Member                 │
└─────────────────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         ▼           ▼           ▼
    ┌────────┐  ┌────────┐  ┌────────┐
    │ ADMIN  │  │OFFICER │  │MEMBER  │
    ├────────┤  ├────────┤  ├────────┤
    │✅ Inv  │  │❌ Inv  │  │❌ Inv  │
    │✅ Aprob│  │❌ Aprob│  │❌ Aprob│
    │✅ Role │  │❌ Role │  │❌ Role │
    │✅ Kick │  │❌ Kick │  │❌ Kick │
    │✅ Dis  │  │❌ Dis  │  │❌ Dis  │
    │✅ View │  │✅ View │  │✅ View │
    │✅ Leave│  │✅ Leave│  │✅ Leave│
    └────────┘  └────────┘  └────────┘
```

---

## Ciclo de Vida de un Squad

```
CREATED
   │
   ├─ members: [creator]
   ├─ roles: [{creator, admin}]
   ├─ joinRequests: []
   │
   ▼
INVITING
   │
   ├─ Admin invita miembros
   ├─ joinRequests se llena
   │
   ▼
APPROVAL (if private)
   │
   ├─ Admin aprueba solicitudes
   ├─ Miembros se mueven a members[]
   │
   ▼
ACTIVE
   │
   ├─ Miembros juegan matches
   ├─ Activity feed se llena
   ├─ Stats se actualizan
   │
   ├─ Admin puede:
   │  ├─ Promover/Degradar roles
   │  ├─ Expulsar miembros
   │  └─ Ver reportes
   │
   ▼
DISBANDED (por admin)
   │
   ├─ Documento eliminado
   ├─ Todos pierden acceso
   ├─ Histórico se pierde
   │
   ▼
DELETED
```

---

## Integración de Componentes

```
┌──────────────────────────────────────────────────────────┐
│                     App.tsx                              │
│  (Maneja state: groups[], users[], currentUserId, etc)  │
└──────────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────┐
│                  Groups.tsx                              │
│                                                          │
│  State:                                                 │
│  ├─ selectedGroupId: string | null                      │
│  ├─ activeTab: 'members'|'activity'|'tournaments'|..    │
│  ├─ squadMembers: SquadMember[]                         │
│  ├─ squadActivity: SquadActivity[]                      │
│  ├─ showCreateModal: boolean                            │
│  └─ ... (otros state)                                   │
│                                                          │
│  Handlers:                                              │
│  ├─ loadGroupData() → GET /api/groups/:id               │
│  ├─ handleCreateSquad() → POST /api/groups              │
│  ├─ handleInviteMember() → POST /api/groups/.../invite │
│  ├─ handlePromoteMember() → PUT /api/groups/.../role    │
│  ├─ handleKickMember() → DELETE /api/groups/.../member  │
│  └─ ... (otros handlers)                                │
│                                                          │
│  Render:                                                │
│  ├─ Squad List (sidebar)                               │
│  ├─ Squad Details (main)                               │
│  │  ├─ Header                                          │
│  │  ├─ Tabs Navigation                                 │
│  │  └─ Tab Content                                     │
│  └─ Modals (overlays)                                  │
└──────────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────┐
│              services/api.ts                             │
│                                                          │
│  api.groups = {                                         │
│    getAll, getById, create, join, invite,              │
│    approveMember, changeRole, removeMember,             │
│    getActivity, addActivity, disband                    │
│  }                                                      │
└──────────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────┐
│           server/routes/groups.ts                        │
│                                                          │
│  Endpoints:                                             │
│  ├─ GET /groups                                         │
│  ├─ GET /groups/:id                                     │
│  ├─ POST /groups                                        │
│  ├─ POST /groups/:id/join                               │
│  ├─ POST /groups/:id/members/invite                     │
│  ├─ POST /groups/:id/join-requests/:userId/approve      │
│  ├─ PUT /groups/:id/members/:userId/role                │
│  ├─ DELETE /groups/:id/members/:userId                  │
│  ├─ GET /groups/:id/activity                            │
│  ├─ POST /groups/:id/activity                           │
│  └─ DELETE /groups/:id                                  │
└──────────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────┐
│         server/models/Group.ts                           │
│                                                          │
│  MongoDB Schema:                                        │
│  {                                                      │
│    name, description, game, image, isPrivate,          │
│    members: [string],                                  │
│    roles: [{userId, role}],                            │
│    joinRequests: [string],                             │
│    createdBy: string,                                  │
│    stats: {membersCount, matchesPlayed, wins},         │
│    activity: [{id, userId, action, timestamp, ...}],  │
│    createdAt, updatedAt                                │
│  }                                                      │
└──────────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────┐
│              MongoDB Database                            │
│                                                          │
│  Collection: groups                                     │
│  └─ Documentos persistidos con índices                  │
└──────────────────────────────────────────────────────────┘
```

---

## Secuencia de Operación Típica

```
Time │ Component        │ API Service      │ Backend         │ Database
─────┼──────────────────┼──────────────────┼─────────────────┼────────────
  0  │ User clicks "+"  │                  │                 │
  1  │ Modal abre       │                  │                 │
  2  │ User ingresa     │                  │                 │
  3  │ Click Create     │                  │                 │
  4  │ handleCreate()   │                  │                 │
  5  │                  │ api.create()     │                 │
  6  │                  │ POST /groups     │                 │
  7  │                  │                  │ Valida token    │
  8  │                  │                  │ Crea document   │
  9  │                  │                  │                 │ Inserta
 10  │                  │                  │ Retorna Group   │
 11  │                  │ Retorna result   │                 │
 12  │ setState()       │                  │                 │
 13  │ ✅ Squad visible │                  │                 │
```

---

**Diagrama Completo del Sistema de Grupos** 🎯
