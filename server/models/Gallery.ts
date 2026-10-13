import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true, default: 'Uncategorized' },
  url: { type: String, required: true },
  publicId: { type: String }, // To potentially delete from cloudinary later if needed
  createdAt: { type: Date, default: Date.now }
});

export const Gallery = mongoose.model('Gallery', gallerySchema);
