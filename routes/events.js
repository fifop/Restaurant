const express = require("express");
const { authAdmin, auth } = require("../middlewares/auth");
const router = express.Router();
const {
  getEvents,
  countPages,
  getSingle,
  addEvent,
  editEvent,
  deleteEvent,
} = require("../controller/event_controller");

router.get("/", getEvents);
router.get("/count", countPages);
// שולף רק פריט אחד לפי האיי די שלו
router.get("/single/:id", getSingle);
//  auth of admin
router.post("/", auth, addEvent);
router.put("/:id", authAdmin, editEvent);
router.delete("/:id", authAdmin, deleteEvent);

module.exports = router;