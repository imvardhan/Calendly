import express from "express";
import {
  getEventTypes,
  getEventBySlug,
  createEventType,
  updateEventType,
  deleteEventType,
} from "../controllers/eventTypes.controller.js";

const router = express.Router();

router.get("/", getEventTypes);
router.post("/", createEventType);
router.get("/slug/:slug", getEventBySlug);  // ✅ GET by slug (must be before /:id)
router.put("/:id", updateEventType);        // ✅ EDIT
router.delete("/:id", deleteEventType);     // ✅ DELETE

export default router;
