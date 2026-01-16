import express from "express";
import cors from "cors";
import eventRoutes from "./routes/eventTypes.routes.js";
import bookingRoutes from "./routes/bookings.routes.js";
import availabilityRoutes from "./routes/availability.routes.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/availability", availabilityRoutes);


export default app;
