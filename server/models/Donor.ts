import mongoose from 'mongoose';

const DonorSchema = new mongoose.Schema({
  donorCode: { type: String, required: true, unique: true }, // e.g., DON-O-112
  donorType: { type: String, enum: ['Sperm', 'Egg'], required: true },
  status: { type: String, enum: ['Active', 'Pending Review', 'Quarantine', 'Retired'], default: 'Pending Review' },
  
  // Physical Characteristics
  bloodGroup: { type: String, default: 'O+' },
  age: { type: Number, default: 25 },
  height: { type: Number }, // cm
  weight: { type: Number }, // kg
  eyeColor: { type: String },
  hairColor: { type: String },
  complexion: { type: String },
  education: { type: String },
  profession: { type: String },
  
  // Medical & Genetics
  medicalClearance: { type: Boolean, default: false },
  geneticClearance: { type: Boolean, default: false },

  // EDR Completion & Sections
  completedTabs: { type: [String], default: [] },
  edrData: { type: mongoose.Schema.Types.Mixed, default: {} },
  
  // System fields
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { strict: false });

// Update the updatedAt timestamp before saving
DonorSchema.pre('save', function() {
  this.updatedAt = new Date();
});

export const Donor = mongoose.model('Donor', DonorSchema);
