import mongoose, { Schema, Document } from 'mongoose';

export interface ITournament extends Document {
    title: string;
    game: string;
    prizePool: string;
    date: string;
    image: string;
    partner: string;
}

const TournamentSchema: Schema = new Schema({
    title: { type: String, required: true },
    game: { type: String, required: true },
    prizePool: { type: String, required: true },
    date: { type: String, required: true },
    image: { type: String, required: true },
    partner: { type: String, required: true }
}, {
    timestamps: true
});

export default mongoose.model<ITournament>('Tournament', TournamentSchema);
