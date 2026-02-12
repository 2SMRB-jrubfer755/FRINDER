import mongoose, { Schema, Document } from 'mongoose';

export interface IGroup extends Document {
    name: string;
    description: string;
    members: string[]; // Stores user IDs as strings (or could be ObjectIds if we reference User)
    image: string;
    game: string;
    isPrivate: boolean;
}

const GroupSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    members: [{ type: String }], // Keeping as strings to match frontend IDs for now
    image: { type: String, required: true },
    game: { type: String, required: true },
    isPrivate: { type: Boolean, default: false }
}, {
    timestamps: true
});

export default mongoose.model<IGroup>('Group', GroupSchema);
