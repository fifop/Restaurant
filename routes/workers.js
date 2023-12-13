const express = require("express");
const router = express.Router();
const { auth, authAdmin } = require("../middlewares/auth");
const {
  getWorkers,
  getWorkerList,
  countPages,
  getSingelWorker,
  addWorker,
  editWorker,
  deleteWorker,
} = require("../controller/worker_controller");

// החזרת רשימת עובדים
router.get("/", getWorkers);
router.get("/workersList", getWorkerList);
router.get("/count", countPages);
// מחזיר למשתמש את הפרטים שלו
router.get("/single/:id", getSingelWorker);

router.post("/addWorkers",authAdmin,addWorker)

router.put("/:id",authAdmin,editWorker);
// delete worker
router.delete("/:id", authAdmin, deleteWorker);
module.exports = router;
