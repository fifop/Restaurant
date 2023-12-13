const express = require("express");
const router = express.Router();
const { WorkerModel, validateWorker } = require("../models/WorkerModel");
const bcrypt = require("bcrypt");

exports.getWorkers = async (req, res) => {
  res.json({ msg: "worker endpoint!" });
};

exports.getWorkerList = async (req, res) => {
  let perPage = Math.min(req.query.perPage, 20) || 10;
  let page = Number(req.query.page) || 1;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;

  try {
    let data = await WorkerModel.find({})
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
    const count = await WorkerModel.countDocuments({});
    res.json({ count, pages: Math.ceil(count / perPage) });
  } catch (error) {
    console.log(error);
    res.status(502).json({ error });
  }
};

exports.getSingelWorker = async (req, res) => {
  try {
    const id = req.params.id;

    let worker = await WorkerModel.findOne({ _id: id });
    res.json(worker);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
};

exports.addWorker = async (req, res) => {
  let validBody = validateWorker(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let worker = new WorkerModel(req.body);
    await worker.save();
    res.status(201).json(worker);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
};

//   edit worker
exports.editWorker = async (req, res) => {
    let validBody = validateWorker(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      let id = req.params.id;
      let data = await WorkerModel.updateOne({ _id: id }, req.body);
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  };

// delete worker
exports.deleteWorker = async (req, res) => {
  try {
    let id = req.params.id;
    let data = await WorkerModel.deleteOne({ _id: id });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
};
