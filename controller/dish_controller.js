const express = require("express");
const router = express.Router();
const { DishModel, validateDish } = require("../models/DishModel");

exports.getDishes = async (req, res) => {
  let perPage = Math.min(req.query.perPage, 20) || 10;
  let page = Number(req.query.page) || 1;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;

  try {
    let data = await DishModel.find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.countPages = async (req, res) => {
  try {
    const perPage = req.query.perPage || 10;
    const count = await DishModel.countDocuments({});
    res.json({ count, pages: Math.ceil(count / perPage) });
  } catch (error) {
    console.log(error);
    res.status(502).json({ error });
  }
};

exports.getSingle = async (req, res) => {
  try {
    let data = await DishModel.findOne({ _id: req.params.id });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
};

// add dish
exports.addDish = async (req, res) => {
  console.log("Received dish data:", req.body); // Log incoming request data

  let validBody = validateDish(req.body);
  if (validBody.error) {
    console.log("Validation error:", validBody.error.details); // Log validation errors
    return res.status(400).json(validBody.error.details);
  }

  try {
    let dish = new DishModel(req.body);
    await dish.save();
    res.status(201).json(dish);
  } catch (err) {
    console.error("Error saving dish:", err); // Log errors during dish save
    res.status(502).json({ err });
  }
};



exports.addDishImage = (req, res) => {
  if (req.file) {
      // Instead of creating a new dish, just return the URL of the uploaded image
      res.json({ imageUrl: `/uploads/${req.file.filename}` });
  } else {
      res.status(400).send('No image uploaded.');
  }
};


//   edit dish
exports.editDish = async (req, res) => {
  let validBody = validateDish(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let id = req.params.id;
    let data = await DishModel.updateOne({ _id: id }, req.body);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
};
exports.deleteDish = async (req, res) => {
  try {
    let id = req.params.id;
    let data = await DishModel.deleteOne({ _id: id });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
};
