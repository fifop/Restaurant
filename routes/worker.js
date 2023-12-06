const express = require("express");
const router = express.Router();
const { auth, authAdmin } = require("../middlewares/auth");
const {
  getWorker,
  getWorkerList,
  countPages,
  getSingelWorker,
  editWorker,
  deleteWorker,
} = require("../controller/users_controller");

// ראוט לבדיקת הטוקן שבסופו הראוט מחזיר את כל המידע על הטוקן כולל
router.get("/checkToken", auth, chackToken);
// החזרת רשימת הלקוחות
router.get("/", getWorker);
router.get("/usersList", getWorkerList);
router.get("/count", countPages);
// מחזיר למשתמש את הפרטים שלו
router.get("/single/:id", auth, getSingelWorker);

router.put("/:id",authAdmin,editWorker);
// delete user
router.delete("/:id", authAdmin, deleteWorker);
module.exports = router;
