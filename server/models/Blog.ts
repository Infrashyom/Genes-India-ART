import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  summary: { type: String },
  image: { type: String },
  author: { type: String, required: true },
  status: { type: String, enum: ['Published', 'Draft'], default: 'Draft' },
  date: { type: String },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const Blog = mongoose.model('Blog', BlogSchema);
