const express = require('express');

const Router = express.Router();
const tourController=require('./tourController')
const authController=require('./authController')
const reviewController=require('./reviewController')
const reviewRouter=require('./reviewRoutes');

 Router.use('/:tourId/reviews',reviewRouter);


Router
  .route('/top-5-cheap')
  .get(tourController.aliasTop5, tourController.getAll);
  Router
  .route('/monthly/:year')
  .get(tourController.getMonthly);
  
Router
  .route('/tour-stats')
  .get(tourController.getStats);
  
  Router
  .route('/')
  .get(authController.protect,tourController.getAll)
  .post(tourController.createOne);

Router
  .route('/:id')
  .get(tourController.getOne)
  .patch(tourController.UpdateOne)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteOne
  );

  
  // Router.param('id', (req, res, next, val) => {
  //   console.log(`Tour id is: ${val}`);
  //   next();
  // });


  
  // Router
  // .route('/:tourId/reviews')
  //  .post(
  //     authController.protect,                // ⬅️ This sets req.user
  //     authController.restrictTo('user'),     // ⬅️ Now this can safely access req.user.role
  //     // reviewController.setTourUserIds,
  //     reviewController.createOne
  //   );
  

  module.exports=Router
