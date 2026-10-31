import mongoose from 'mongoose';

let mongoServer: any;

export async function connectDB() {
  try {
    let mongoURI: string = process.env.MONGODB_URI || '';
    
    if (!mongoURI) {
      console.warn('⚠️ MONGODB_URI is not defined. Falling back to in-memory MongoDB for development.');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      mongoURI = mongoServer.getUri();
    }

    if (!mongoURI) {
      throw new Error('Unable to establish MongoDB connection: no URI available.');
    }
    
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected successfully.');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
  }
}
