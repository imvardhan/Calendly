import db from "../config/db.js";

/**
 * GET /api/availability/:eventTypeId/settings
 * Get availability settings for editing
 */
export const getAvailabilitySettings = (req, res) => {
  try {
    const { eventTypeId } = req.params;

    // Check event exists
    const event = db
      .prepare("SELECT id FROM event_types WHERE id = ?")
      .get(eventTypeId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Get all availability records
    const availabilities = db
      .prepare(
        `SELECT day, start_time, end_time, enabled 
         FROM availability 
         WHERE event_type_id = ?
         ORDER BY CASE 
           WHEN day = 'monday' THEN 1
           WHEN day = 'tuesday' THEN 2
           WHEN day = 'wednesday' THEN 3
           WHEN day = 'thursday' THEN 4
           WHEN day = 'friday' THEN 5
           WHEN day = 'saturday' THEN 6
           WHEN day = 'sunday' THEN 7
         END`
      )
      .all(eventTypeId);

    // Convert to object format
    const days = {};
    const daysOfWeek = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    daysOfWeek.forEach((day) => {
      const found = availabilities.find((a) => a.day === day);
      days[day] = {
        enabled: found ? found.enabled === 1 : false,
        start_time: found ? found.start_time : "09:00",
        end_time: found ? found.end_time : "17:00",
      };
    });

    res.json({ days });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch availability settings" });
  }
};

/**
 * GET /api/availability/:eventTypeId?date=YYYY-MM-DD
 * Booking page availability
 */
export const getAvailability = (req, res) => {
  try {
    const { eventTypeId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    // Event
    const event = db
      .prepare(
        "SELECT duration FROM event_types WHERE id = ? AND is_active = 1"
      )
      .get(eventTypeId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Day name
    const dayName = new Date(date)
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();

    // Weekly availability
    const availability = db
      .prepare(
        `SELECT start_time, end_time 
         FROM availability 
         WHERE event_type_id = ? AND day = ? AND enabled = 1`
      )
      .get(eventTypeId, dayName);

    if (!availability) {
      return res.json({ availableSlots: [], blockedSlots: [] });
    }

    // Booked slots
    const bookings = db
      .prepare(
        `SELECT start_time 
         FROM bookings 
         WHERE event_type_id = ? AND date = ?`
      )
      .all(eventTypeId, date);

    const blockedSlots = bookings.map(b => b.start_time);

    // Generate slots
    const slots = [];
    const duration = event.duration;

    let [sh, sm] = availability.start_time.split(":").map(Number);
    let [eh, em] = availability.end_time.split(":").map(Number);

    let start = sh * 60 + sm;
    const end = eh * 60 + em;

    while (start + duration <= end) {
      const h = String(Math.floor(start / 60)).padStart(2, "0");
      const m = String(start % 60).padStart(2, "0");
      const slot = `${h}:${m}`;

      if (!blockedSlots.includes(slot)) {
        slots.push(slot);
      }
      start += duration;
    }

    res.json({
      date,
      availableSlots: slots,
      blockedSlots,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch availability" });
  }
};
export const saveAvailability = (req, res) => {
  try {
    const { eventTypeId } = req.params;
    const { days } = req.body;

    const stmt = db.prepare(`
      INSERT INTO availability (event_type_id, day, start_time, end_time, enabled)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(event_type_id, day)
      DO UPDATE SET
        start_time = excluded.start_time,
        end_time = excluded.end_time,
        enabled = excluded.enabled
    `);

    const tx = db.transaction(() => {
      Object.entries(days).forEach(([day, data]) => {
        stmt.run(
          eventTypeId,
          day,
          data.start || null,
          data.end || null,
          data.enabled ? 1 : 0
        );
      });
    });

    tx();
    res.json({ message: "Availability saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save availability" });
  }
};

// ✅ NEW: Seed default availability for events without it
export const seedDefaultAvailability = (req, res) => {
  try {
    const { eventTypeId } = req.params;

    // Check if event exists
    const event = db
      .prepare("SELECT id FROM event_types WHERE id = ?")
      .get(eventTypeId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if availability already exists
    const existing = db
      .prepare("SELECT COUNT(*) as count FROM availability WHERE event_type_id = ?")
      .get(eventTypeId);

    if (existing.count > 0) {
      return res.status(400).json({ message: "Availability already configured" });
    }

    // Seed default availability (9 AM - 5 PM, Mon-Fri)
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    const stmt = db.prepare(`
      INSERT INTO availability (event_type_id, day, start_time, end_time, enabled)
      VALUES (?, ?, ?, ?, 1)
    `);

    days.forEach((day) => {
      stmt.run(eventTypeId, day, "09:00", "17:00");
    });

    res.json({
      message: "Default availability created (9 AM - 5 PM, Mon-Fri)",
      eventTypeId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to seed availability" });
  }
};
