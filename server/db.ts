import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from './models/User.js';

let mongoServer: any;

export async function connectDB() {
  try {
    let mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.warn('⚠️ MONGODB_URI is not defined. Falling back to in-memory MongoDB for development.');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      mongoURI = mongoServer.getUri();
    }
    
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected successfully.');
    
    // Ensure an initial system admin account exists so administrator can log in to enter live data
    await ensureAdminAccount();

  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
  }
}

async function ensureAdminAccount() {
  try {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password', salt);
      
      await User.create({
        name: 'Administrator',
        email: 'demo@admin.genesindia.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Initial administrator initialized (demo@admin.genesindia.com / password). Ready for real live data.');
    }
  } catch (err) {
    console.error('Failed to initialize admin account:', err);
  }
}
