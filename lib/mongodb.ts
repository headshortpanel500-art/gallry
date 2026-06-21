import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please add your MONGODB_URI to .env.local');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // ডেভেলপমেন্ট মোডে গ্লোবাল ভেরিয়েবল ব্যবহার করা হয় যাতে HMR এর কারণে বারবার কানেকশন না হয়
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri);
    
    // কানেকশন সফল হলে টার্মিনালে মেসেজ দেখাবে
    globalWithMongo._mongoClientPromise = client.connect().then((connectedClient) => {
      console.log("=========================================");
      console.log("🟢 MongoDB Connected Successfully (Dev)! 🚀");
      console.log("=========================================");
      return connectedClient;
    }).catch(err => {
      console.error("🔴 MongoDB Connection Error (Dev):", err.message);
      throw err;
    });
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // প্রোডাকশন মোডে (Vercel) সরাসরি কানেক্ট হবে
  client = new MongoClient(uri);
  clientPromise = client.connect().then((connectedClient) => {
    console.log("🟢 MongoDB Connected Successfully (Prod)! 🌍");
    return connectedClient;
  }).catch(err => {
    console.error("🔴 MongoDB Connection Error (Prod):", err.message);
    throw err;
  });
}

export default clientPromise;