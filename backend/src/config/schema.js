import db from "./db.js";

/* EVENT TYPES */
db.prepare(`
  CREATE TABLE IF NOT EXISTS event_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT,
    slug TEXT UNIQUE,
    duration INTEGER,
    location TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

/* BOOKINGS */
db.prepare(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type_id INTEGER,
    invitee_name TEXT,
    invitee_email TEXT,
    date TEXT,
    start_time TEXT,
    end_time TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_type_id, date, start_time)
  )
`).run();

/* WEEKLY AVAILABILITY */
db.prepare(`
  CREATE TABLE IF NOT EXISTS availability (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type_id INTEGER,
    day TEXT,
    start_time TEXT,
    end_time TEXT,
    enabled INTEGER DEFAULT 1,
    UNIQUE(event_type_id, day)
  )
`).run();

console.log("✅ SQLite schema ready");
