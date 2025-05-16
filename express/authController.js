const User = require('./userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);

    const token = signToken(newUser._id); // ✅ fixed variable name

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser
      }
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      status: 'error',
      message: err.message || 'Something went wrong!',
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password'
      });
    }

    const token = signToken(user._id); 
    res.status(200).json({
      status: 'success',
      token
    });

  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message || 'Something went wrong!'
    });
  }
};


exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    console.log(token);
    next();
    
    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in! Please log in'
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded);
 
 
  const currentUser = await User.findById(decoded.id);

try {
  if (!currentUser) {
    return res.status(401).json({
      status: 'error',
      message: 'The user no longer exists!'
    });
  }
} catch (err) {
  return res.status(500).json({
    status: 'error',
    message: err.message || 'Something went wrong while checking the user.'
  });
}

 if(currentUser.changedPasswordAfter(decoded.iat)){
  return res.status(401).json({
 status:error,
 message:'User recently changed password'   
  })
 } 
  
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message || 'Something went wrong!'
    });
  }
  
};
