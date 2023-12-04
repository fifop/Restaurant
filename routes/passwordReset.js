const express = require('express');

require('dotenv').config();

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { UserModel } = require('../models/userModel'); // ייבוא המודל של המשתמש
const router = express.Router();

// פונקציה לבקשת איפוס סיסמה
const requestPasswordReset = async (req, res) => {
  console.log('requestPasswordReset called'); // Log when the function is called
  try {
    const { email } = req.body;
    console.log('Email received:', email); // Log the email received from the request

    const user = await UserModel.findOne({ email });
    console.log('User lookup:', user ? 'Found' : 'Not Found'); // Log if the user was found or not

    if (!user) {
      return res.status(404).send('User not found');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    console.log('Reset token generated:', resetToken); // Log the generated reset token

    const hash = await bcrypt.hash(resetToken, Number(process.env.BCRYPT_SALT_ROUNDS));
    console.log('Hashed token:', hash); // Log the hashed token

    user.resetPasswordToken = hash;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
    await user.save();
    console.log(user,'User saved with reset token and expiry'); // Log after saving the user

    const link = `${process.env.FRONTEND_URL}/password-reset/${encodeURIComponent(resetToken)}`;
    console.log('Reset link:', link); // Log the reset link

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: 'Password Reset Request',
      text: `Hi ${user.name},\n\nPlease click on the following link to reset your password:\n\n${link}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    await sgMail.send(mailOptions);
    console.log('Password reset email sent'); // Log after sending the email

    res.send('A link to reset your password has been sent to your email address.');
  } catch (error) {
    console.error('Error in requestPasswordReset:', error); // Log any errors that occur
    res.status(500).send('Error in sending password reset email');
  }
};

router.post('/:token', async (req, res) => {
  try {
    const { newPassword } = req.body;
    const token = decodeURIComponent(req.params.token);
    console.log('Reset Password Request Received:', { token, newPassword });

    // Find the user by the reset token expiration
    const user = await UserModel.findOne({
      resetPasswordExpires: { $gt: Date.now() }
    });
    console.log('Stored token:', user.resetPasswordToken); // Log the stored hashed token
    console.log('Received token:', token); // Log the received token
    if (!user) {
      console.log('Token expired or user not found');
      return res.status(400).send('Invalid or expired password reset token');
    }

    // Compare the received token with the hashed token stored in the database
    const isTokenValid = await bcrypt.compare(token, user.resetPasswordToken);

    if (!isTokenValid) {
      console.log('Invalid token');
      return res.status(400).send('Invalid password reset token');
    }

    // If the token is valid, proceed to reset the password
    user.password = await bcrypt.hash(newPassword, Number(process.env.BCRYPT_SALT_ROUNDS));
    user.resetPasswordToken = undefined; // Clear the reset token fields
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log('Password reset successful for user:', user._id);
    res.send('Your password has been updated.');
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).send('Error resetting password');
  }
});




router.post('/', requestPasswordReset);

router.get("/", async(req,res) => {
  try{
    let data = await UserModel.find({}).limit(20);
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})
module.exports = router;
