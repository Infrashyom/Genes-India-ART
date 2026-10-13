import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  
  // Optional relations
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  relatedDonor: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor' },
  relatedRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'SampleRequest' },
  
  type: { type: String, enum: ['Document Review', 'Lab Results', 'Approval', 'General'], default: 'General' },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  
  dueDate: { type: Date },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

TaskSchema.pre('save', function() {
  this.updatedAt = new Date();
});

export const Task = mongoose.model('Task', TaskSchema);
