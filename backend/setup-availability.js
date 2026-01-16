import db from "./src/config/db.js";

console.log("Setting up availability for events...");

try {
  // Get all active events
  const events = db
    .prepare("SELECT id, name FROM event_types WHERE is_active = 1")
    .all();

  console.log(`Found ${events.length} active events`);

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
  const stmt = db.prepare(`
    INSERT INTO availability (event_type_id, day, start_time, end_time, enabled)
    VALUES (?, ?, ?, ?, 1)
    ON CONFLICT(event_type_id, day)
    DO UPDATE SET start_time = '09:00', end_time = '17:00'
  `);

  events.forEach((event) => {
    console.log(`Processing event: ${event.name} (ID: ${event.id})`);
    days.forEach((day) => {
      stmt.run(event.id, day, "09:00", "17:00");
      console.log(`  ✓ Added ${day}: 09:00 - 17:00`);
    });
  });

  console.log("\n✅ Availability setup complete!");
  process.exit(0);
} catch (error) {
  console.error("❌ Error:", error.message);
  process.exit(1);
}
