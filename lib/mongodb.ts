import mongoose, { Mongoose } from "mongoose";

/**
 * MongoDB connection string from environment variables.
 * Throws an error if not defined to prevent runtime issues.
 */
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * Global cache interface to store the Mongoose connection.
 * This prevents creating multiple connections during development
 * when hot reloading causes the module to be re-executed.
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

/**
 * Extend the global object to include our mongoose cache.
 * This ensures the cache persists across hot reloads in development.
 */
declare global {
  var mongoose: MongooseCache | undefined;
}

/**
 * Cached connection object. Uses global cache in development
 * to prevent connection leaks during hot module replacement.
 */
const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

// Assign to global in development to persist across hot reloads
if (process.env.NODE_ENV !== "production") {
  global.mongoose = cached;
}

/**
 * Connects to MongoDB using Mongoose with connection caching.
 *
 * @returns Promise resolving to the Mongoose instance
 *
 * @example
 * ```typescript
 * import dbConnect from "@/lib/mongodb";
 *
 * export async function GET() {
 *   await dbConnect();
 *   // Your database operations here
 * }
 * ```
 */
async function dbConnect(): Promise<Mongoose> {
  // Return cached connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection promise if none exists
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false, // Disable buffering for better error handling
    };

    cached.promise = mongoose.connect(MONGO_URI, opts);
  }

  try {
    // Await and cache the connection
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset promise on error to allow retry
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default dbConnect;
