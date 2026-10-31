import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String },
  category: { type: String, default: 'Clinical ART Guidelines' },
  content: { type: String, required: true },
  summary: { type: String },
  image: { type: String },
  author: { type: String, required: true },
  status: { type: String, enum: ['Published', 'Draft'], default: 'Draft' },
  tags: [{ type: String }],
  date: { type: String },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const Blog = mongoose.model('Blog', BlogSchema);
