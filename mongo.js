const mongoose = require('mongoose');
let db = mongoose.connection;

mongoose
  .connect('mongodb://localhost:27017/authorization', {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => {
    console.info('Connected!');
  })
  .catch(err => {
    console.error('Connection failed: ', err);
    process.exit();
  });

module.exports = db;
