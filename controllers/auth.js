const { validationResult } = require('express-validator/check')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../Models/user');

const SECRET_KEY = 'somesupersecretsecret'

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error('validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
  
      throw error;
    }
    const {email, name, password} = req.body;
    const passwordHashed = await bcrypt.hash(password, 12);

    const user = new User({ 
      email: email, 
      password: passwordHashed,
      name: name
    })

    await user.save();

    res.statusCode(201).json({
      message: 'User created', 
      userId: user._id
    })

  }catch(error){
    if(!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.login = async (req, res, next ) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()){
      const error = new Error('Validation failed.')
      error.statusCode = 422;
      error.data = errors.array();

      throw error;
    }

    const {email, password} = req.body;
    const user = await User.findOne({ email: email})

    if (!user) {
      const error = new Error('email or password incorrect.')
      error.statusCode = 401;
      error.data = errors.array();

      throw error;
    }

    isPasswordCorrect = bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      const error = new Error('email or password incorrect.')
      error.statusCode = 401;
      error.data = errors.array();

      throw error;
    }

    const token = jwt.sign({
      email: user.email,
      userId: user._id.toString()
    },
    SECRET_KEY, 
    { expiresIn: '1h' }
    );

    res.statusCode(200).json({token: token, userId: user_id.toString()})

  }catch(err){
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err)
  }
};