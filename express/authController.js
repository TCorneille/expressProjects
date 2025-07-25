const User = require('./userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('./email');
const crypto = require('crypto');

const signToken = id => {
   return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};


const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id); // Assuming signToken is defined elsewhere
   const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);

     createSendToken(newUser, 201, res);
  }
   catch (err) {
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

   createSendToken(user, 200, res);

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

    // 1. Get token from headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in! Please log in',
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    // 3. Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'error',
        message: 'The user no longer exists!',
      });
    }

    // 4. Check if user changed password after token was issued
    if (currentUser.changedPasswordAfter && currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: 'error',
        message: 'User recently changed password. Please log in again.',
      });
    }

    // 5. Attach user to request
    req.user = currentUser;
    

    // 6. Move on to the next middleware
    next();

  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message || 'Something went wrong!',
    });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log('req.user.role:', req.user.role); 
        console.log('req.user.email:', req.user.email); 

    console.log('Allowed Roles:', roles);
    
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) 
       return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action'
      });
    
    next();
  };
};
exports.forgotPassword = async (req, res, next) => {
  try {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'There is no user with that email address.'
      });
    }



    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
console.log('After token creation:', {
  token: resetToken,
  docToken: user.passwordResetToken,
  expires: user.passwordResetExpires
});

    await user.save({ validateBeforeSave: false });
      

    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message
      });

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!'
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        status: 'fail',
        message: 'There was an error sending the email. Try again later!'
      });
    }
  } catch (err) {
    next(err); // Forward to error handler middleware
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    // 1) Hash the token from the URL
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // 2) Find the user by token and check expiration
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Token is invalid or has expired'
      });
    }

    // 3) Set new password and clear reset fields
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save(); // Save triggers password hashing middleware if implemented

    // 4) Log the user in by sending a new JWT
   createSendToken(user, 200, res);
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong. Please try again later.'
    });
  }
};


exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, newPasswordConfirm } = req.body;

    // Check if all required fields are provided
    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide currentPassword, newPassword, and newPasswordConfirm.',
      });
    }

    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found.',
      });
    }

    // 2) Check if current password is correct
    const isCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isCorrect) {
      return res.status(401).json({
        status: 'error',
        message: 'Your current password is wrong.',
      });
    }

    // 3) Update password
    user.password = newPassword;
    user.passwordConfirm = newPasswordConfirm;
    await user.save();

    // 4) Log user in
    createSendToken(user, 200, res);
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message || 'Something went wrong',
    });
  }
};

