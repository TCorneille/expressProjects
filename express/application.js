
const express = require('express');
const fs = require('fs')
const app = express();
const morgan=require('morgan');
const rateLimit =require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');


const tourRouter=require('./tourRoutes');
const userRouter=require('./userRoutes');

app.use(helmet());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


app.use(express.json());

// app.all('*', (req, res, next) => {
//   res.status(404).json({
//     status: 'fail',
//     message: `Can't find ${req.originalUrl} on this server!`
//   });
// });

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

app.use(express.static(`${__dirname}/public`));


app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);



app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log('Hello from the middleware 👋');
   
    next();
  });
  




// app.get('/api/v1/tours',getAll )
// // app.get('/api/v1/tours/:id',getOne) 
//  app.post('/api/v1/tours',createOne)
// // app.patch('/api/v1/tours/:id',UpdateOne ) 
// app.delete('/api/v1/tours/:id',deleteOne )


// app
//   .route('/api/v1/tours')
//   .get(getAll)
//   .post(createOne);

// app
//   .route('/api/v1/tours/:id')
//   .get(getOne)
//   .patch(UpdateOne)
//   .delete(deleteOne);



  app.use('/api/v1/tours', tourRouter);
   app.use('/api/v1/users', userRouter);
  
 


module.exports=app