import express from "express";
import cors from "cors";

// 🔥 THIS LINE IS MANDATORY
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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
