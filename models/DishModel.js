const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose Schema
let dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  dish_id: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['starter', 'main course', 'dessert', 'beverage']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  imageUrl: {
    type: String, 
    required: false 
  }
});

// Mongoose Model
exports.DishModel = mongoose.model('dishes', dishSchema);

// Joi Validation Schema
exports.validateDish = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(1).max(150).required(),
    dish_id: Joi.number().min(1).max(9999).required(),
    description: Joi.string().min(1).max(300).required(),
    price: Joi.number().min(0).required(),
    category: Joi.string().min(1).max(50).required(),
    isAvailable: Joi.boolean()
  });
  return joiSchema.validate(_reqBody);
};
