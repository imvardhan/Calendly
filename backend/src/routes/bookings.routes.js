import express from "express";
import {
  createBooking,
  getBookingsForEvent,
  updateBooking,
  getAllBookings,
} from "../controllers/bookings.controller.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/all", getAllBookings);  // ✅ Get all bookings (specific route before :id)
router.put("/:id", updateBooking);  // ✅ Reschedule endpoint
router.get("/:eventTypeId", getBookingsForEvent);

export default router;
