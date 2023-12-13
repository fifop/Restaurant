const express = require("express");
const path = require('path');

const { authAdmin, auth } = require("../middlewares/auth");
const router = express.Router();
const multer = require('multer');
const {
  getDishes,
  countPages,
  getSingle,
  addDish,
  addDishImage,
  editDish,
  deleteDish,
} = require("../controller/dish_controller");

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });
router.post('/upload-dish-image',upload.single('dishImage'),addDishImage)


router.get("/", getDishes);
router.get("/count", countPages);
// שולף רק פריט אחד לפי האיי די שלו
router.get("/single/:id", getSingle);
//  auth of admin
router.post("/", auth, addDish);
router.put("/:id", auth, editDish);
router.delete("/:id", authAdmin, deleteDish);




module.exports = router;
