import dotenv from "dotenv";
dotenv.config();

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  console.warn("⚠ DATABASE_URL not set, database operations will fail");
}

// Create pool and db even with mock URL to prevent import errors
const connectionString = process.env.DATABASE_URL || "postgresql://mock:mock@localhost:5432/mock";
export const pool = new Pool({ connectionString });
export const db = drizzle({ client: pool, schema });