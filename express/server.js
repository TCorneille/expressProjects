const port = 3000;
const mongoose = require('mongoose'); 


 const dotenv=require('dotenv');
const app=require('./application')
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
  
  


app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});