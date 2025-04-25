
const mongoose = require('mongoose'); 
 const dotenv=require('dotenv');

 const app=require('./application')

const port = 5000;


// const weather = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/weather.json`))

dotenv.config({path:'./config.env'})
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



app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});