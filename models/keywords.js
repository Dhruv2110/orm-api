const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./users');

const keywordSchema = new Schema({
    keywords: {
        items: [
            {
                type: String,
                required: true,
                trim: true
            }
        ]
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true,
    }
    },{ timestamps: true, versionKey: false });


module.exports = mongoose.model('Keywords', keywordSchema);
