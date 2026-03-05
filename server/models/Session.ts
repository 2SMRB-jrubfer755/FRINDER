import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  userId: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
  userAgent?: string;
  ipAddress?: string;
}

const SessionSchema: Schema = new Schema({
  userId: { type: String, required: true, ref: 'User' },
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  userAgent: { type: String },
  ipAddress: { type: String }
}, {
  timestamps: true
});

// Auto-delete expired sessions
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<ISession>('Session', SessionSchema);
