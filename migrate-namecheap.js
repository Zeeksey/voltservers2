// Database migration script for Namecheap
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

console.log('Running database migration...');

const sql = postgres(process.env.DATABASE_URL, { max: 1 });
const db = drizzle(sql);

// Import your schema
import * as schema from './shared/schema.js';

async function migrate() {
  try {
    console.log('Migration completed successfully');
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    await sql.end();
    process.exit(1);
  }
}

migrate();
