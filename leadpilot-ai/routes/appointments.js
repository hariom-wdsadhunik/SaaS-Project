const express = require("express");
const router = express.Router();
const {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  completeAppointment,
  cancelAppointment,
  deleteAppointment,
  getUpcomingAppointments,
  getAppointmentStats
} = require("../controllers/appointmentsController");

// Appointment routes
router.get("/", getAppointments);
router.get("/upcoming/list", getUpcomingAppointments);
router.get("/stats/overview", getAppointmentStats);
router.get("/:id", getAppointment);
router.post("/", createAppointment);
router.patch("/:id", updateAppointment);
router.patch("/:id/complete", completeAppointment);
router.patch("/:id/cancel", cancelAppointment);
router.delete("/:id", deleteAppointment);

module.exports = router;
