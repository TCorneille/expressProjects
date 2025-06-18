const express = require('express');
const reviewController = require('./reviewController');
const authController = require('./authController');
// const Router = express.Router();

 const Router = express.Router({ mergeParams: true });

// Router.use(authController.protect);

Router
  .route('/')
  .get(reviewController.getAll)
  .post(
    authController.protect,                // ⬅️ This sets req.user
    authController.restrictTo('user'),     // ⬅️ Now this can safely access req.user.role
     reviewController.setTourUserIds,
    reviewController.createOne
  );


Router
  .route('/:id')
  .get(reviewController.getOne)
  .patch(
    //authController.restrictTo('user', 'admin'),
    reviewController.updateOne
  )
  .delete(
   // authController.restrictTo('user', 'admin'),
    reviewController.deleteOne
  );

module.exports = Router;