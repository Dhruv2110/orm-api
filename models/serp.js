const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./users');

const serpSchema = new Schema({
    url: {
        type: String,
        required: true,
        trim: true
    },
    currentPosition: {
        type: Number,
        required: true
    },
    previousPosition: {
        type: Number,
        required: true
    },
    keyword: {
        type: String,
        required: true 
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true,
    }

    },{ timestamps: true, versionKey: false });


module.exports = mongoose.model('Serp', serpSchema);
