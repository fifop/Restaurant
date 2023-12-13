const express = require("express");
const router = express.Router();
const { auth, authAdmin } = require("../middlewares/auth");
const {
  getUsers,
  chackToken,
  getUsersList,
  countPages,
  getUserInfo,
  getSingelUser,
  signUp,
  logIn,
  updateUser,
  deleteUser,
} = require("../controller/users_controller");

// ראוט לבדיקת הטוקן שבסופו הראוט מחזיר את כל המידע על הטוקן כולל
router.get("/checkToken", auth, chackToken);
// החזרת רשימת הלקוחות
router.get("/", getUsers);
router.get("/usersList", getUsersList);
router.get("/count", countPages);
// מחזיר למשתמש את הפרטים שלו
router.get("/userInfo", auth, getUserInfo);
router.get("/single/:id",auth, getSingelUser);
// sign up
router.post("/", signUp);
router.post("/logIn", logIn);
//   edit role
router.put("/updateUser/:id",authAdmin, updateUser);
// delete user
router.delete("/:id", authAdmin, deleteUser);

module.exports = router;




