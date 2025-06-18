
const APIFeatures = require('./apiFeatures');

exports.deleteOne = Model =>async (req, res, next) => {
    try{
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc){
      return res.status(404).json({
        status: 'fail',
        message: 'No document found with that ID'
      });
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
}catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message || 'Something went wrong',
    });
  }

  }

exports.updateOne = Model =>async (req, res, next) => {
    try{
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    
    if (!doc){
      return res.status(404).json({
        status: 'fail',
        message: 'No document found with that ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
}catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message || 'Something went wrong',
    });
  }
  }

exports.createOne = Model =>async (req, res, next) => {
    try{
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
}catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message || 'Something went wrong',
    });
  }
  }



exports.getOne = (Model, popOptions) =>async (req, res, next) => {
    try{
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

      if (!doc){
      return res.status(404).json({
        status: 'fail',
        message: 'No document found with that ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
}catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err.message || 'Something went wrong',
    });
  }
  }

// exports.getAll = Model =>async (req, res, next) => {
//     // To allow for nested GET reviews on tour (hack)
//     try{
//     let filter = {};
//     if (req.params.tourId) filter = { tour: req.params.tourId };

//     const features = new APIFeatures(Model.find(filter), req.query)
//       .filter()
//       .sort()
//       .limitFields()
//       .paginate();
//     // const doc = await features.query.explain();
//     const doc = await features.query;

//     // SEND RESPONSE
//     res.status(200).json({
//       status: 'success',
//       results: doc.length,
//       data: {
//         data: doc
//       }
//     });
//   }catch (err) {
//     return res.status(500).json({
//       status: 'error',
//       message: err.message || 'Something went wrong',
//     });
//   }
//   }