import express from "express";
import {
  getAvailability,
  getAvailabilitySettings,
  saveAvailability,
  seedDefaultAvailability,
} from "../controllers/availability.controller.js";

const router = express.Router();

router.get("/:eventTypeId/settings", getAvailabilitySettings); // ✅ Get settings for editing
router.get("/:eventTypeId", getAvailability); // ✅ Get available slots for booking
router.post("/:eventTypeId", saveAvailability); // ✅ Save availability
router.post("/:eventTypeId/seed", seedDefaultAvailability); // ✅ Seed default

export default router;
