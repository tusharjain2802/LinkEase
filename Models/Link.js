const mongoose = require('mongoose')

const linkSchema = new mongoose.Schema({
    original:{
        type:String,
        required:true,
    },
    shorten:{
        type:String,
        required:true,
    },
    visits:{
        type:Number,
        required:true
    }
});


module.exports = mongoose.model('link',linkSchema)