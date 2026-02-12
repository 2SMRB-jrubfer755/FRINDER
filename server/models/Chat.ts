import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
    id: string; // Frontend generates IDs or we let DB handle it. Keeping string for compatibility
    senderId: string;
    text: string;
    timestamp: number;
    isAi?: boolean;
}

export interface IChat extends Document {
    participants: string[];
    messages: IMessage[];
    lastMessage?: string;
}

const MessageSchema: Schema = new Schema({
    id: { type: String, required: true },
    senderId: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Number, required: true },
    isAi: { type: Boolean, default: false }
});

const ChatSchema: Schema = new Schema({
    participants: [{ type: String, required: true }],
    messages: [MessageSchema],
    lastMessage: { type: String }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

export default mongoose.model<IChat>('Chat', ChatSchema);
