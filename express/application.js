
const express = require('express');
const fs = require('fs')
const app = express();
const morgan=require('morgan');
const rateLimit =require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');


const tourRouter=require('./tourRoutes');
const userRouter=require('./userRoutes');
const reviewRouter=require('./reviewRoutes');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));


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

app.get('/', (req, res) => {
  res.status(200).render('base', {
    tour: 'The Forest Hiker',
    user: 'Jonas'
  });
});

app.get('/overview', (req, res) => {
  res.status(200).render('overview', {
    title: 'All Tours'
  });
});

app.get('/tour', (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour'
  });
});


  app.use('/api/v1/tours', tourRouter);
   app.use('/api/v1/users', userRouter);
  app.use('/api/v1/reviews', reviewRouter);
 


module.exports=app