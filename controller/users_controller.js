const express = require("express");
const router = express.Router();
const {
  UserModel,
  validateUser,
  validateUserUpdate,
  validateLogin,
  createToken,
} = require("../models/UserModel");
const bcrypt = require("bcrypt");

exports.getUsers = async (req, res) => {
  res.json({ msg: "Users endpoint!" });
};

// בדיקת הטוקן שבסופו הראוט מחזיר את כל המידע על הטוקן כולל
// תפקיד המשתמש ולא מדבר עם המסד נתונים
exports.chackToken = async (req, res) => {
  try {
    res.json(req.tokenData);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
};

// exports.getUsersList = async (req, res) => {
//   try {
//     let data = await UserModel.find({});
//     console.log(data);
//     res.json(data);

//   } catch (err) {
//     console.log(err);
//     res.status(500).json(err);
//   }
// };

exports.getUsersList = async (req, res) => {
  let perPage = Math.min(req.query.perPage, 20) || 10;
  let page = Number(req.query.page) || 1;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;

  try {
    let data = await UserModel.find({})
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
    const count = await UserModel.countDocuments({});
    res.json({ count, pages: Math.ceil(count / perPage) });
  } catch (error) {
    console.log(error);
    res.status(502).json({ error });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    let user = await UserModel.findOne(
      { _id: req.tokenData._id },
      { password: 0 }
    );
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
};

exports.getSingelUser = async (req, res) => {
  try {
    const id = req.params.id;

    let user = await UserModel.findOne({ _id: id });
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
};

// sign up
exports.signUp = async (req, res) => {
  let validBody = validateUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = new UserModel({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    // להצפין את הסיסמא במסד עם מודול ביקריפט
    // 10 -> רמת הצפנה
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    // להסתיר את ההצפנה לצד לקוח
    user.password = "***";
    res.json(user);
  } catch (err) {
    if (err.code == 11000) {
      return res
        .status(400)
        .json({ msg: "Email already in system", code: 11000 });
    }
    console.log(err);
    res.status(502).json({ err });
  }
};

// logIn

exports.logIn = async (req, res) => {
  let validBody = validateLogin(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    // לבדוק אם בכלל יש רשומה עם המייל שנשלח
    let user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ msg: "Email Worng." });
    }
    // לבדוק אם הרשומה שנמצאה הסיסמא המוצפנות בתוכה מתאימה
    let validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).json({ msg: "Password Worng." });
    }
    // לשלוח טוקן
    let token = createToken(user._id, user.role, user.name);
    // res.json({token:token})
    res.json({ token, role: user.role, name: user.name });
    console.log({ token, role: user.role, name: user.name });
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
};
// Inside your changeRole function in users_controller.js
exports.updateUser = async (req, res) => {
  let validBody = validateUserUpdate(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let id = req.params.id;
    let data = await UserModel.updateOne({ _id: id }, req.body);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
};


// delete user
exports.deleteUser = async (req, res) => {
  try {
    let id = req.params.id;
    let data = await UserModel.deleteOne({ _id: id });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
};







