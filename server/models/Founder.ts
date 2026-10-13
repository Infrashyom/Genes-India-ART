import mongoose from 'mongoose';

const founderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  qualifications: { type: String }, // e.g. MBBS, MD
  experience: { type: String }, // e.g. 15+ Years Experience
  description: { type: String, required: true }, // The bio text
  image: { type: String }, // Cloudinary URL
  displayOrder: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const Founder = mongoose.model('Founder', founderSchema);
