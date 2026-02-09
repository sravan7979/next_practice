# Connecting to MongoDB with Mongoose in TypeScript

## Overview

This guide explains the **step-by-step process** to connect a Node.js /
Next.js application to **MongoDB** using **Mongoose** and
**TypeScript**, including caching for development hot reload safety.

------------------------------------------------------------------------

# Step-by-Step Process

## Step 1 --- Install Required Package

Install Mongoose:

``` bash
npm install mongoose
```

------------------------------------------------------------------------

## Step 2 --- Add MongoDB Connection String

Create a `.env.local` (Next.js) or `.env` file:

``` env
MONGO_URI=<mongodb+srv://username:password@cluster.mongodb.net/dbname>
```

This keeps **credentials secure** and configurable.

------------------------------------------------------------------------

## Step 3 --- Import Mongoose in TypeScript

Create a file:

    lib/mongodb.ts

``` ts
import mongoose, { Mongoose } from "mongoose";
```

-   `mongoose` → runtime library object\
-   `Mongoose` → TypeScript type of the connection instance

------------------------------------------------------------------------

## Step 4 --- Validate Environment Variable

``` ts
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI in environment variables");
}
```

------------------------------------------------------------------------

## Step 5 --- Create Cache Interface

``` ts
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}
```

------------------------------------------------------------------------

## Step 6 --- Extend Global Object

``` ts
declare global {
  var mongoose: MongooseCache | undefined;
}
```

------------------------------------------------------------------------

## Step 7 --- Create Cached Object

``` ts
const cached: MongooseCache = global.mongoose ?? {
  conn: null,
  promise: null,
};
```

------------------------------------------------------------------------

## Step 8 --- Store Cache in Development Only

``` ts
if (process.env.NODE_ENV !== "production") {
  global.mongoose = cached;
}
```

------------------------------------------------------------------------

## Step 9 --- Create Async Database Connection Function

``` ts
async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
```

------------------------------------------------------------------------

## Step 10 --- Export the Function

``` ts
export default dbConnect;
```

------------------------------------------------------------------------

# Usage Example (Next.js API Route)

``` ts
import dbConnect from "@/lib/mongodb";

export async function GET() {
  await dbConnect();
  return Response.json({ message: "MongoDB Connected" });
}
```

------------------------------------------------------------------------

# One-Line Summary

**Install Mongoose → store URI in env → create cached connection → reuse
via Promise + global → export `dbConnect` → call before DB operations.**
