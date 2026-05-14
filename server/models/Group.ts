import mongoose, { Schema, Document } from 'mongoose';

export interface IGroupMemberRole {
    userId: string;
    role: 'admin' | 'officer' | 'member';
}

export interface IGroupStats {
    membersCount: number;
    matchesPlayed: number;
    wins: number;
}

export interface IGroupActivity {
    id: string;
    userId: string;
    action: 'joined' | 'left' | 'match_won' | 'match_lost' | 'promoted' | 'kicked' | 'tournament_entered';
    timestamp: Date;
    details?: Record<string, any>;
}

export interface IGroup extends Document {
    name: string;
    description: string;
    members: string[];
    roles: IGroupMemberRole[];
    joinRequests: string[];
    createdBy: string;
    image: string;
    game: string;
    isPrivate: boolean;
    stats: IGroupStats;
    activity: IGroupActivity[];
    createdAt: Date;
    updatedAt: Date;
}

const GroupMemberRoleSchema: Schema = new Schema({
    userId: { type: String, required: true },
    role: { type: String, enum: ['admin', 'officer', 'member'], default: 'member' }
}, { _id: false });

const GroupStatsSchema: Schema = new Schema({
    membersCount: { type: Number, default: 1 },
    matchesPlayed: { type: Number, default: 0 },
    wins: { type: Number, default: 0 }
}, { _id: false });

const GroupActivitySchema: Schema = new Schema({
    id: { type: String, required: true },
    userId: { type: String, required: true },
    action: { 
        type: String, 
        enum: ['joined', 'left', 'match_won', 'match_lost', 'promoted', 'kicked', 'tournament_entered'],
        required: true 
    },
    timestamp: { type: Date, default: Date.now },
    details: { type: Schema.Types.Mixed }
}, { _id: false });

const GroupSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    members: [{ type: String }],
    roles: [GroupMemberRoleSchema],
    joinRequests: [{ type: String }],
    createdBy: { type: String, required: true },
    image: { type: String, required: true },
    game: { type: String, required: true },
    isPrivate: { type: Boolean, default: false },
    stats: GroupStatsSchema,
    activity: [GroupActivitySchema]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

export default mongoose.model<IGroup>('Group', GroupSchema);
