import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load env variables
dotenv.config();

// 🔥 MUST run schema once on startup
import "./config/schema.js";

import eventRoutes from "./routes/eventTypes.routes.js";
import bookingRoutes from "./routes/bookings.routes.js";
import availabilityRoutes from "./routes/availability.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/availability", availabilityRoutes);

// ✅ REQUIRED for Render
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
