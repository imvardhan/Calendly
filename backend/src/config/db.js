import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// Use persistent path if provided (Render)
const DB_PATH = process.env.DB_PATH || "./db/database.sqlite";

// Ensure directory exists
const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new Database(DB_PATH);

export default db;