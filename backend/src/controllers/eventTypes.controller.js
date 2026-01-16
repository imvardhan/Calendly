import db from "../config/db.js";
import { slugify } from "../utils/slugify.js";

export const getEventTypes = (req, res) => {
  const rows = db
    .prepare("SELECT * FROM event_types ORDER BY created_at DESC")
    .all();

  res.json(rows);
};

export const getEventBySlug = (req, res) => {
  const { slug } = req.params;

  const event = db
    .prepare("SELECT * FROM event_types WHERE slug = ? AND is_active = 1")
    .get(slug);

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  res.json(event);
};

export const createEventType = (req, res) => {
  const { name, duration, location } = req.body;

  const slug = slugify(name);

  const result = db.prepare(`
    INSERT INTO event_types (name, slug, duration, location, is_active)
    VALUES (?, ?, ?, ?, 1)
  `).run(name, slug, duration, location);

  const eventId = result.lastInsertRowid;

  // ✅ Auto-seed default availability (9 AM - 5 PM, Mon-Fri)
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
  const stmt = db.prepare(`
    INSERT INTO availability (event_type_id, day, start_time, end_time, enabled)
    VALUES (?, ?, ?, ?, 1)
  `);

  days.forEach((day) => {
    stmt.run(eventId, day, "09:00", "17:00");
  });

  res.status(201).json({
    id: eventId,
    name,
    slug,
    duration,
    location,
    isActive: true,
  });
};

export const updateEventType = (req, res) => {
  const { id } = req.params;
  const { name, duration, location, is_active } = req.body;

  db.prepare(`
    UPDATE event_types
    SET
      name = COALESCE(?, name),
      slug = COALESCE(?, slug),
      duration = COALESCE(?, duration),
      location = COALESCE(?, location),
      is_active = COALESCE(?, is_active)
    WHERE id = ?
  `).run(
    name,
    name ? slugify(name) : null,
    duration,
    location,
    is_active,
    id
  );

  res.json({ message: "Event updated" });
};

export const deleteEventType = (req, res) => {
  db.prepare("DELETE FROM event_types WHERE id = ?")
    .run(req.params.id);

  res.json({ message: "Event deleted" });
};
