const mongoose = require('mongoose')
require('dotenv').config()
const mongoURI = process.env.DB_URI 
module.exports = function (callback) {
    mongoose.set("strictQuery", false);
    mongoose.connect(mongoURI);
};
