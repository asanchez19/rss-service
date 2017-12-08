const Mongoose = require('mongoose')
const { log, error } = require('console')
const ObjectId = require('mongoose').Types.ObjectId;

/*
* Creates a new MongoDB connection.
*/
exports.connectToMongo = function (url) {

  /* 
  * Register all your model schemas here 
  */

  return Mongoose.createConnection(url);

}
