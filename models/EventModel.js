const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Schema for Events
const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 150,
  },
  eventDate: {
    type: Date,
    required: true
  },
  numberOfGuests: {
    type: Number,
    required: true,
    min: 1
  },
  description: {
    type: String,
    required: false,
    maxlength: 500
  },
  isCatered: {
    type: Boolean,
    default: false
  },
});

// Mongoose Model
exports.EventModel = mongoose.model('events', eventSchema);

// Joi Validation Schema for Events
exports.validateEvent = (_reqBody) => {
  let joiSchema = Joi.object({
    eventName: Joi.string().min(2).max(150).required(),
    eventDate: Joi.date().required(),
    numberOfGuests: Joi.number().min(1).required(),
    description: Joi.string().max(500),
    isCatered: Joi.boolean()
  });

  return joiSchema.validate(_reqBody);
};

