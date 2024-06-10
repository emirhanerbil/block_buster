const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    userName:{
        type: String,
        required: true
    },
    password:{
        type:String,
        required:true
    },
    role: { 
        type: String,
        enum: ['user', 'admin'],
        default: 'user' 
        }
})

const User = new mongoose.model("User",userSchema)

module.exports = User;