import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@shared/schema";

// Get database connection string from environment
const DATABASE_URL = process.env.DATABASE_URL!;

// Create a Neon client
const sql = neon(DATABASE_URL);

// Create Drizzle ORM instance
console.log("Initializing database connection to Neon...");
export const db = drizzle(sql, { schema });