import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '@shared/schema';

// Initialize SQLite database
const sqlite = new Database(process.env.DATABASE_URL || 'store.db');

// Create drizzle database instance
export const db = drizzle(sqlite, { schema });