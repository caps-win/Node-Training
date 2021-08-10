const express = require('express');
const { body } = require('express-validator/check');

const User = require('../Models/user');
const authController = requite('../controllers/auth.js');

const router = express.Router();

router.put('/signup', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom(async (value, {req }) => {
      var user = await User.findOne({ email: value});
      if (user) {
        return Promise.reject('E-mail address already exists!')
      }
    })
    .normalizeEmail(),
    body('password')
      .trim()
      .isLength({min: 5}),
    body('name')
      .trim()
      .not()
      .isEmpty()
], authController.signup);

router.post('/login', [
  body('email')
    .isEmail(),
    body('password')
    .trim()
    .isLength({min: 5})
], authController.login)


module.exports = router;