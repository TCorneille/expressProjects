const express = require('express');
const morgan = require('morgan');
const path = require('path');
const Routes = require('./Routes');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to add request time
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log('Hello from the middleware 👋');
  next();
});

// Mount routes
app.use('/api/v1/weather', Routes);

module.exports = app;
