import db from "./src/config/db.js";

console.log("\n========== DATABASE CONTENTS ==========\n");

console.log("📋 EVENTS:");
const events = db.prepare("SELECT * FROM event_types").all();
console.log(events);

console.log("\n📅 BOOKINGS:");
const bookings = db.prepare("SELECT * FROM bookings").all();
console.log(bookings.length === 0 ? "No bookings yet" : bookings);

console.log("\n⏰ AVAILABILITY:");
const availability = db.prepare("SELECT * FROM availability").all();
console.log(availability.length === 0 ? "No availability set" : availability);

console.log("\n========================================\n");
process.exit(0);
