import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI must be defined");
}

type Cached = {
  conn: typeof mongoose.connection | null;
  promise: Promise<typeof mongoose.connection> | null;
};

const cached: Cached =
  global.mongoose ?? (global.mongoose = { conn: null, promise: null });

export async function connectDB() {
  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 5,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then(() => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
    console.log("Connected to database 🚀🚀");
  } catch (error) {
    cached.promise = null;
    throw new Error("Error connecting to database: " + error);
  }

  return cached.conn;
}

