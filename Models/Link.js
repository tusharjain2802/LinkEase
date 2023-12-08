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
    },
    createdAt: { 
        type: Date, 
        default: Date.now ,
        expires:60*60*48
        
    }
});


module.exports = mongoose.model('link',linkSchema)