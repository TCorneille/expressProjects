const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../tourModel');
const User = require('./../../userModel');
const Review = require('./../../reviewModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

  mongoose
  .connect(DB, {
    useNewUrlParser: true, // Optional in Mongoose 6+, but okay to leave
  
    useUnifiedTopology: true // Add this for good connection behavior
  })
  .then(con => {
    // console.log(con.connections);
    console.log('DB connection successful!');
  })
  .catch(err => {
    console.error('Connection error:', err);
  });

// READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });

    await Review.create(reviews);
     console.log('Users:', users.length);
console.log('Reviews:', reviews.length);

    console.log('Data successfully loaded!');
   
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  //process.exit();
};
console.log(process.argv)
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
