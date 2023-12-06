const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Schema for Workers
const workerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 150,
  },
  role: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  contactEmail: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 150,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 15,
  },
  salary: {
    type: Number,
    required: true,
    min: 0
  },
  dateJoined: {
    type: Date,
    default: Date.now,
  },
});

// Mongoose Model
exports.WorkerModel = mongoose.model('workers', workerSchema);

// Joi Validation Schema for Workers
exports.validateWorker = (_reqBody) => {
  let joiSchema = Joi.object({
    fullName: Joi.string().min(2).max(150).required(),
    role: Joi.string().min(3).max(100).required(),
    contactEmail: Joi.string().email().min(5).max(150).required(),
    phoneNumber: Joi.string().min(10).max(15).required(),
    salary: Joi.number().min(0).required(),
    dateJoined: Joi.date()
  });

  return joiSchema.validate(_reqBody);
};
