const express = require("express");
const router = express.Router();

const {
  getAllEvents,
  getEventById,
  getMyEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", getAllEvents);
router.get("/my-created", authMiddleware, getMyEvents);
router.get("/:id", getEventById);

router.post("/", authMiddleware, createEvent);
router.put("/:id", authMiddleware, updateEvent);
router.delete("/:id", authMiddleware, deleteEvent);

module.exports = router;