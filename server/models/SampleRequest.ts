import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // e.g., 'PDF', 'JPG'
  url: { type: String }, // URL to the uploaded file in cloud storage
  status: { 
    type: String, 
    enum: ['Pending Review', 'Approved', 'Rejected'], 
    default: 'Pending Review' 
  }
});

const SampleRequestSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true }, // e.g., REQ-2026-102
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The hospital user who requested it
  doctorName: { type: String, required: true },
  patientName: { type: String, required: true },
  patientAge: { type: Number },
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', required: true },
  
  procedureType: { type: String, enum: ['IVF', 'IUI', 'ICSI', 'Other'], required: true },
  quantity: { type: Number, required: true, default: 1 },
  
  status: { 
    type: String, 
    enum: ['Pending', 'Under Review', 'Documents Requested', 'Approved', 'Rejected', 'Dispatched', 'Delivered', 'Completed'], 
    default: 'Pending' 
  },
  
  documents: [DocumentSchema],
  remarks: { type: String }, // Internal notes or feedback to hospital

  shippingDetails: {
    carrier: { type: String, default: 'CryoPort Cold Chain Logistics' },
    shipperId: { type: String, default: 'DS-LN2-841' },
    trackingNumber: { type: String },
    tempLog: { type: String, default: '-196°C LN2 Vapor Phase' },
    eta: { type: String },
    currentLocation: { type: String, default: 'Central Cryo Logistics Depot' },
    dispatchedAt: { type: Date },
    deliveredAt: { type: Date }
  },

  clinicalOutcome: {
    cycleStatus: { type: String },
    pregnancyConfirmed: { type: Boolean },
    reportedAt: { type: Date },
    notes: { type: String }
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

SampleRequestSchema.pre('save', function() {
  this.updatedAt = new Date();
});

export const SampleRequest = mongoose.model('SampleRequest', SampleRequestSchema);
