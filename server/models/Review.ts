import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  reviewText: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
  createdAt: { type: Date, default: Date.now }
});

export const Review = mongoose.model('Review', reviewSchema);
