const express = require("express");
const router = express.Router();
const { EventModel, validateEvent } = require("../models/EventModel");

exports.getEvents = async (req, res) => {
  let perPage = Math.min(req.query.perPage, 20) || 10;
  let page = Number(req.query.page) || 1;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;

  try {
    let data = await EventModel.find({})
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
    const count = await EventModel.countDocuments({});
    res.json({ count, pages: Math.ceil(count / perPage) });
  } catch (error) {
    console.log(error);
    res.status(502).json({ error });
  }
};

exports.getSingle = async (req, res) => {
  try {
    let data = await EventModel.findOne({ _id: req.params.id });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
};

//   add event
exports.addEvent = async (req, res) => {
  let validBody = validateEvent(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let event = new EventModel(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
};

//   edit event
exports.editEvent = async (req, res) => {
  let validBody = validateEvent(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let id = req.params.id;
    let data = await EventModel.updateOne({ _id: id }, req.body);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
};
exports.deleteEvent = async (req, res) => {
  try {
    let id = req.params.id;
    let data = await EventModel.deleteOne({ _id: id });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
};
