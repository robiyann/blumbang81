// src/lib/db/index.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Neon + Drizzle client.
 *
 * Uses the HTTP transport (neon-http) which is optimal for serverless/edge
 * environments. Connection pooling is handled transparently by Neon.
 *
 * DATABASE_URL should be in the format:
 * postgresql://user:pass@host.neon.tech/dbname?sslmode=require
 */

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn("[db] DATABASE_URL environment variable is not set. Database operations will fail.");
}

// Fallback for local development without a DB (returns mock)
const sql = databaseUrl
  ? neon(databaseUrl)
  : (() => {
      console.warn("[db] DATABASE_URL not set — DB queries will fail.");
      // Return a no-op proxy so imports don't crash during build
      return null as unknown as ReturnType<typeof neon>;
    })();

export const db = sql
  ? drizzle(sql, { schema })
  : (null as unknown as ReturnType<typeof drizzle<typeof schema>>);

export { schema };
