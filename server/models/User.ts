import mongoose, { Schema, Document } from 'mongoose';

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other'
}

export enum GameType {
  FPS = 'FPS',
  MOBA = 'MOBA',
  RPG = 'RPG',
  SPORTS = 'Sports',
  MMO = 'MMO',
  INDIE = 'Indie'
}

export interface IUser extends Document {
  name: string;
  age: number;
  gender: Gender;
  distance: number;
  bio: string;
  avatar: string;
  favoriteGames: string[];
  gameTypes: GameType[];
  isOnline: boolean;
  personality: string;
  languages: string[];
  discord?: string;
  skills?: string[];
  email?: string;
  password?: string;
  language?: string;
  notifications?: boolean;
  preferences?: {
    minAge?: number;
    maxAge?: number;
    distanceMax?: number;
    favoriteGames?: string[];
    skills?: string[];
  };
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: Object.values(Gender), required: true },
  distance: { type: Number, required: true },
  bio: { type: String, required: true },
  avatar: { type: String, required: true },
  favoriteGames: [{ type: String }],
  gameTypes: [{ type: String, enum: Object.values(GameType) }],
  isOnline: { type: Boolean, default: false },
  personality: { type: String, required: true },
  languages: [{ type: String }],
  discord: { type: String },
  skills: [{ type: String }],
  email: { type: String },
  password: { type: String },
  language: { type: String },
  notifications: { type: Boolean, default: true },
  preferences: {
    minAge: { type: Number },
    maxAge: { type: Number },
    distanceMax: { type: Number },
    favoriteGames: [{ type: String }],
    skills: [{ type: String }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export default mongoose.model<IUser>('User', UserSchema);
