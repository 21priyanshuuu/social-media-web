import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  socialHandle: string;
  images: string[];
  createdAt: Date;
  email:string;
}

const SUserSchema = new Schema({
  name: { type: String, required: true },
  socialHandle: { type: String, required: true },
  images: [{ type: String, required: true }],
  createdAt: { type: Date, default: Date.now },
  email: { type: String, required: true },
});

export default mongoose.models.SUser || mongoose.model<IUser>('SUser', SUserSchema);
