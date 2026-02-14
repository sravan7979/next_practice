/* eslint-disable no-console */

const mongoose = require("mongoose");

async function main() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error(
      "[db-check] Missing MONGO_URI (or MONGODB_URI). Run with: node --env-file=.env scripts/check-db.js"
    );
    process.exitCode = 1;
    return;
  }

  const source = process.env.MONGO_URI ? "MONGO_URI" : "MONGODB_URI";
  console.log(`[db-check] Connecting to MongoDB (env=${source})...`);

  const startedAt = Date.now();
  try {
    await mongoose.connect(mongoUri, { bufferCommands: false });
    const conn = mongoose.connection;
    console.log(
      `[db-check] Connected in ${Date.now() - startedAt}ms (host=${conn.host}, db=${conn.name}, readyState=${conn.readyState})`
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[db-check] Connection failed: ${message}`);
    process.exitCode = 1;
  } finally {
    try {
      await mongoose.disconnect();
      console.log("[db-check] Disconnected");
    } catch {
      // ignore
    }
  }
}

main();
