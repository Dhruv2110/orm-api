const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['company', 'individual'],
        required: true,
        trim: true
    },
    resetToken:{
        type: String,
    },
    resetTokenExpiration:{
        type: Number,
    },
    resetOtp: {
        type:String
    }
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('User', userSchema);