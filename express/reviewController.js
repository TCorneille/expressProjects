const Review= require('./reviewModel')
const factory = require('./handlerFactory');


exports.getAll = async (req, res, next) => {
  try{
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await Review.find(filter);

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
}catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message || 'Something went wrong',
    });
  }
}

//  exports.createOne = async (req, res) => {
//       try {
//         if (!req.body.tour) req.body.tour = req.params.tourId;
//         if (!req.body.user) req.body.user = req.user.id;
       
//         const newReview = await Review.create(req.body);
//         res.status(201).json({
//           status: 'success',
//           data: {
//             tour: newReview
//           }
//         });
//       } catch (err) {
//         res.status(400).json({
//           status: 'fail',
//           message: err.message
//         });
//       }
//     };

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

    exports.getOne = factory.getOne(Review);
    exports.updateOne = factory.updateOne(Review);
    exports.deleteOne = factory.deleteOne(Review);
    exports.createOne=factory.createOne(Review)





