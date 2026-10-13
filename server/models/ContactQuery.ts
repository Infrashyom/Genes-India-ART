import mongoose from 'mongoose';

const ContactQuerySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  
  status: { 
    type: String, 
    enum: ['Unread', 'Read', 'Responded'], 
    default: 'Unread' 
  },
  
  createdAt: { type: Date, default: Date.now }
});

export const ContactQuery = mongoose.model('ContactQuery', ContactQuerySchema);
