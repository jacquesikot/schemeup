import mongoose from 'mongoose';

let cachedDb: typeof mongoose | null = null;

async function connectToDatabase() {
  if (cachedDb) {
    return;
  }
  const db = await mongoose.connect(
    'mongodb+srv://jacquesikot:sNlatITiYfvxYXOF@core.wsybiuj.mongodb.net/?retryWrites=true&w=majority'
  );

  cachedDb = db;
  return db;
}

export default connectToDatabase;
