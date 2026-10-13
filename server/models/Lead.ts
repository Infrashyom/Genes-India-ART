import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
  hospitalName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String },
  message: { type: String },
  
  status: { 
    type: String, 
    enum: ['New', 'Contacted', 'In Progress', 'Onboarded', 'Rejected'], 
    default: 'New' 
  },
  
  notes: { type: String }, // Internal staff notes
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

LeadSchema.pre('save', function() {
  this.updatedAt = new Date();
});

export const Lead = mongoose.model('Lead', LeadSchema);
