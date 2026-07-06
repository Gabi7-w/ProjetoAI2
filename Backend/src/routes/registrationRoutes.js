const express = require("express");
const router = express.Router();

const {
  registerUserInEvent,
  cancelRegistration,
  getEventParticipants,
  getUserRegistrations,
  getMyRegistrations,
} = require("../controllers/registrationController");

const authMiddleware = require("../middlewares/authMiddleware");

router.get("/me/registrations", authMiddleware, getMyRegistrations);

router.post("/:eventId/register", authMiddleware, registerUserInEvent);
router.delete("/:eventId/register", authMiddleware, cancelRegistration);

router.get("/:eventId/participants", getEventParticipants);
router.get("/user/:userId/registrations", authMiddleware, getUserRegistrations);

module.exports = router;