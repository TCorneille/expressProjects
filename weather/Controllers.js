
const Weather=require('./Model')
//  const fs = require('fs');
// const weather = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/weather.json`));



// Fetch all weather data
exports.getAll = async (req, res) => {
  try {
    const weatherData = await Weather.find();
    res.status(200).json({
      status: 'success',
      data: {weatherData}
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: 'Error fetching weather data'
    });
  }
};

// Add new weather data
exports.createOne = async (req, res) => {
  try {
    const newWeather = await Weather.create(req.body);
    res.status(201).json({
      status: 'success',
      data: newWeather
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};


// exports.getOne=async(req, res) => {
//     try{
//         const weather=await Weather.findById(req.params.id)
//         if (!weather) {
//             return res.status(404).json({
//               status: 'fail',
//               message: 'No weather found with that ID'
//             });
//           }
//         res.status(200).json({
//                     status: 'Yes',
//                     //results: tours.length,
//                     data: {
//                             weather
//                     }
//                 })
        

//     }catch(err) {
//         res.status(404).json({
//           status: 'fail',
//           message: err.message
//         });
//       }
//     };

// exports.createOne = (req, res) => {
//     const newId = weathers[weathers.length - 1].id + 1;
//     const newW = Object.assign({ id: newId }, req.body);
  
//     weathers.push(newW);
  
//     fs.writeFile(
//         `${__dirname}/dev-data/weather.json`,
//         JSON.stringify(weathers),
//         err => {
//             res.status(201).json({
//                 status: 'success',
//                 data: {
//                     weather: newW
//                 }
//             });
//         }
//     );
// };

// exports.updateOne = (req, res) => {
//     const id = req.params.id * 1;
//     const weatherIndex = weathers.findIndex(el => el.id === id);
  
//     if (weatherIndex === -1) {
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Invalid ID'
//         });
//     }

//     // Here, update the weather item based on the body
//     const updatedWeather = { ...weathers[weatherIndex], ...req.body };
//     weathers[weatherIndex] = updatedWeather;
  
//     fs.writeFile(
//         `${__dirname}/dev-data/weather.json`,
//         JSON.stringify(weathers),
//         err => {
//             res.status(200).json({
//                 status: 'success',
//                 data: {
//                     weather: updatedWeather
//                 }
//             });
//         }
//     );
// };

// exports.deleteOne = (req, res) => {
//     const id = req.params.id * 1;
//     const weatherIndex = weathers.findIndex(el => el.id === id);
  
//     if (weatherIndex === -1) {
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Invalid ID'
//         });
//     }

//     weathers.splice(weatherIndex, 1);
  
//     fs.writeFile(
//         `${__dirname}/dev-data/weather.json`,
//         JSON.stringify(weathers),
//         err => {
//             res.status(204).json({
//                 status: 'success',
//                 data: null
//             });
//         }
//     );
// };
