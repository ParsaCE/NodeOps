import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'nodeops_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

const migrate = async () => {
  const files = fs.readdirSync(path.join(__dirname, '../migrations')).sort();
  
  for (const file of files) {
    const sql = fs.readFileSync(path.join(__dirname, '../migrations', file), 'utf8');
    console.log(`Running migration: ${file}`);
    await pool.query(sql);
    console.log(`✅ Done: ${file}`);
  }
  
  await pool.end();
};

migrate().catch(console.error);