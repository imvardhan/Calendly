import db from "../config/db.js";

/**
 * POST /api/bookings
 * Create a booking
 */
export const createBooking = (req, res) => {
  try {
    const {
      eventTypeId,
      inviteeName,
      inviteeEmail,
      date,
      startTime,
      endTime,
    } = req.body;

    console.log("📥 Booking request received:", {
      eventTypeId,
      inviteeName,
      inviteeEmail,
      date,
      startTime,
      endTime,
    });

    if (
      !eventTypeId ||
      !inviteeName ||
      !inviteeEmail ||
      !date ||
      !startTime ||
      !endTime
    ) {
      console.error("❌ Missing required fields");
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 🔍 Check for slot conflict
    const conflict = db
      .prepare(
        `SELECT 1 FROM bookings
         WHERE event_type_id = ?
         AND date = ?
         AND start_time = ?`
      )
      .get(eventTypeId, date, startTime);

    if (conflict) {
      console.error("❌ Time slot already booked");
      return res
        .status(409)
        .json({ message: "This time slot is already booked" });
    }

    // ✅ Create booking
    const result = db
      .prepare(
        `INSERT INTO bookings
         (event_type_id, invitee_name, invitee_email, date, start_time, end_time)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(
        eventTypeId,
        inviteeName,
        inviteeEmail,
        date,
        startTime,
        endTime
      );

    console.log("✅ Booking created successfully:", result.lastInsertRowid);

    res.status(201).json({
      id: result.lastInsertRowid,
      eventTypeId,
      inviteeName,
      inviteeEmail,
      date,
      startTime,
      endTime,
    });
  } catch (err) {
    console.error("❌ Error creating booking:", err);
    res.status(500).json({ message: "Failed to create booking" });
  }
};

/**
 * GET /api/bookings/:eventTypeId
 * Fetch bookings for an event type
 */
export const getBookingsForEvent = (req, res) => {
  try {
    const { eventTypeId } = req.params;

    const rows = db
      .prepare(
        `SELECT date, start_time, end_time
         FROM bookings
         WHERE event_type_id = ?`
      )
      .all(eventTypeId);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

/**
 * PUT /api/bookings/:id
 * Update a booking (reschedule)
 */
export const updateBooking = (req, res) => {
  try {
    const { id } = req.params;
    const { date, startTime, endTime } = req.body;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get the original booking to check event_type_id
    const booking = db
      .prepare("SELECT event_type_id FROM bookings WHERE id = ?")
      .get(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check for conflict with new date/time
    const conflict = db
      .prepare(
        `SELECT 1 FROM bookings
         WHERE event_type_id = ?
         AND date = ?
         AND start_time = ?
         AND id != ?`
      )
      .get(booking.event_type_id, date, startTime, id);

    if (conflict) {
      return res
        .status(409)
        .json({ message: "This time slot is already booked" });
    }

    // Update booking
    db.prepare(
      `UPDATE bookings
       SET date = ?, start_time = ?, end_time = ?
       WHERE id = ?`
    ).run(date, startTime, endTime, id);

    console.log("✅ Booking rescheduled:", id);

    res.json({
      id,
      date,
      startTime,
      endTime,
      message: "Booking rescheduled successfully",
    });
  } catch (err) {
    console.error("❌ Error rescheduling booking:", err);
    res.status(500).json({ message: "Failed to reschedule booking" });
  }
};
/**
 * GET /api/bookings
 * Get all bookings (for Meetings page)
 */
export const getAllBookings = (req, res) => {
  try {
    const bookings = db
      .prepare(
        `SELECT 
           b.id,
           b.invitee_name,
           b.invitee_email,
           b.date,
           b.start_time,
           b.end_time,
           e.name as event_type_name,
           e.location
         FROM bookings b
         JOIN event_types e ON b.event_type_id = e.id
         ORDER BY b.date DESC, b.start_time DESC`
      )
      .all();

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};