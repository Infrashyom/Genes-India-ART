import mongoose from 'mongoose';

const InventorySchema = new mongoose.Schema({
  vialId: { type: String, required: true, unique: true }, // e.g., VIAL-2026-001
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', required: true },
  
  // Location in Cryo Bank
  tank: { type: String, required: true },
  canister: { type: String, required: true },
  cane: { type: String, required: true },
  colorCode: { type: String }, // e.g., 'Blue/White'
  
  // Status
  status: { 
    type: String, 
    enum: ['Available', 'Reserved', 'Dispatched', 'Discarded', 'Quarantine'], 
    default: 'Quarantine' 
  },
  freezeDate: { type: Date, required: true },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

InventorySchema.pre('save', function() {
  this.updatedAt = new Date();
});

export const Inventory = mongoose.model('Inventory', InventorySchema);
