const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//const Tour = require('./../Model');
const Weather = require('./../Model');

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
const weathers = JSON.parse(
  fs.readFileSync(`${__dirname}/weather.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Weather.create(weathers);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Weather.deleteMany();
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
