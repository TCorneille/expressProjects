const mongoose = require('mongoose'); 

const weatherSchema = new mongoose.Schema({
  city: {
    type: String,
    required: [true, 'The city must be stated'],
    unique: true
  },
  temperature: {
    type: Number,
    default: 26,
    required: [true, 'Temperature must be known']
  },
  humidity: {
    type: Number,
    required: false // You can also add default: null if you want
  }
}, {
  timestamps: true
});

const Weather = mongoose.model('Weather', weatherSchema);
module.exports = Weather;
