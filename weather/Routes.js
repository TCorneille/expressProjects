const express = require('express');
const Router = express.Router();
const Controllers = require('./Controllers');

// Router
//   .route('/top-5-cheap')
//   .get(tourController.aliasTop5, tourController.getAll);
// Router
//   .route('/monthly/:year')
//   .get(tourController.getMonthly);
  
// Router
//   .route('/tour-stats')
//   .get(tourController.getStats);

Router
  .route('/')
  .get(Controllers.getAll)
  .post(Controllers.createOne);

// Router
//   .route('/:id')
//   .get(Controllers.getOne)
//   .patch(Controllers.updateOne) // <-- Ensure the function is correctly named
//   .delete(Controllers.deleteOne);

// Router.param('id', (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);
//   next();
// });

module.exports = Router;  // <-- Corrected here
