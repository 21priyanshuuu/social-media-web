import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  socialHandle: string;
  images: string[];
  createdAt: Date;
}

const UserSchema = new Schema({
  name: { type: String, required: true },
  socialHandle: { type: String, required: true },
  images: [{ type: String, required: true }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
