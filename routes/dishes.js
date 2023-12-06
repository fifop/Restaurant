const express = require("express");
const { authAdmin, auth } = require("../middlewares/auth");
const router = express.Router();
const {
  getDishes,
  countPages,
  getSingle,
  addDish,
  addDishImage,
  editDish,
  deleteDish,
} = require("../controller/dish_controller");

router.get("/", getDishes);
router.get("/count", countPages);
// שולף רק פריט אחד לפי האיי די שלו
router.get("/single/:id", getSingle);
//  auth of admin
router.post("/", auth, addDish);
router.post('/upload-dish-image',upload.single('dishImage'),addDishImage)
router.put("/:id", authAdmin, editDish);
router.delete("/:id", authAdmin, deleteDish);

module.exports = router;
