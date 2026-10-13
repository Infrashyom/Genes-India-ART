import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'staff', 'hospital'], default: 'staff' },
  phone: { type: String },
  status: { type: String, enum: ['Active', 'Banned'], default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

// Pre-save middleware to hash the password before saving
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export const User = mongoose.model('User', UserSchema);
