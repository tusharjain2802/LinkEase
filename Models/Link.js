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
    createdAt: { type: Date, 
        expires:20, 
        default: Date.now 
    }
});


module.exports = mongoose.model('link',linkSchema)