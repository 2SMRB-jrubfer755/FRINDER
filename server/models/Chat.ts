import mongoose, { Schema, Document } from 'mongoose';

export interface IAttachment {
    type: 'image' | 'video' | 'file';
    url: string;
    name?: string;
    size?: number;
}

export interface IMessage {
    id: string;
    senderId: string;
    text: string;
    timestamp: number;
    isAi?: boolean;
    attachments?: IAttachment[];
    isEdited?: boolean;
    editedAt?: number;
}

export interface ICall {
    id: string;
    initiatorId: string;
    startTime: number;
    endTime?: number;
    duration?: number;
    accepted: boolean;
}

export interface IChat extends Document {
    participants: string[];
    messages: IMessage[];
    lastMessage?: string;
    lastMessageTime?: number;
    chatName?: string;
    isPrivate?: boolean;
    mutedBy?: string[];
    calls?: ICall[];
    unreadBy?: { userId: string; count: number }[];
    createdAt?: Date;
    updatedAt?: Date;
}

const AttachmentSchema: Schema = new Schema({
    type: { type: String, enum: ['image', 'video', 'file'], required: true },
    url: { type: String, required: true },
    name: { type: String },
    size: { type: Number }
}, { _id: false });

const MessageSchema: Schema = new Schema({
    id: { type: String, required: true },
    senderId: { type: String, required: true },
    text: { type: String },
    timestamp: { type: Number, required: true },
    isAi: { type: Boolean, default: false },
    attachments: [AttachmentSchema],
    isEdited: { type: Boolean, default: false },
    editedAt: { type: Number }
});

const CallSchema: Schema = new Schema({
    id: { type: String, required: true },
    initiatorId: { type: String, required: true },
    startTime: { type: Number, required: true },
    endTime: { type: Number },
    duration: { type: Number },
    accepted: { type: Boolean, default: false }
}, { _id: false });

const UnreadSchema: Schema = new Schema({
    userId: { type: String, required: true },
    count: { type: Number, default: 0 }
}, { _id: false });

const ChatSchema: Schema = new Schema({
    participants: [{ type: String, required: true }],
    messages: [MessageSchema],
    lastMessage: { type: String },
    lastMessageTime: { type: Number },
    chatName: { type: String },
    isPrivate: { type: Boolean, default: false },
    mutedBy: [{ type: String }],
    calls: [CallSchema],
    unreadBy: [UnreadSchema]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

export default mongoose.model<IChat>('Chat', ChatSchema);
