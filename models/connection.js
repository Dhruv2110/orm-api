const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./users');

const connectionSchema = new Schema({
    twitter: {
        URL: {
            type: String,
            trim: true
            },
        useHttps: {
            type: Boolean
        },
        pageSpeedIndex: {
            type: Number
        },
        hasTitle:{
            type: Boolean
        },
        hasMetaDesc:{
            type: Boolean
        },
        hasCanTag: {
            type: Boolean
        },
        isValid: {
            type: Boolean
        }
    },
    facebook: {
        URL: {
            type: String,
            trim: true
        },
        useHttps: {
            type: Boolean
        },
        pageSpeedIndex: {
            type: Number
        },
        hasTitle: {
            type: Boolean
        },
        hasMetaDesc: {
            type: Boolean
        },
        hasCanTag: {
            type: Boolean
        },
        isValid: {
            type: Boolean
        }
        
    },
    linkedin: {
        URL: {
            type: String,
            trim: true
        },
        useHttps: {
            type: Boolean
        },
        pageSpeedIndex: {
            type: Number
        },
        hasTitle: {
            type: Boolean
        },
        hasMetaDesc: {
            type: Boolean
        },
        hasCanTag: {
            type: Boolean
        },
        isValid: {
            type: Boolean
        }
        
    },
    website: {
        URL: {
            type: String,
            trim: true
        },
        useHttps: {
            type: Boolean
        },
        pageSpeedIndex: {
            type: Number
        },
        hasTitle: {
            type: Boolean
        },
        hasMetaDesc: {
            type: Boolean
        },
        hasCanTag: {
            type: Boolean
        },
        isValid: {
            type: Boolean
        }
        
    },
    pinterest: {
        URL: {
            type: String,
            trim: true
        },
        useHttps: {
            type: Boolean
        },
        pageSpeedIndex: {
            type: Number
        },
        hasTitle: {
            type: Boolean
        },
        hasMetaDesc: {
            type: Boolean
        },
        hasCanTag: {
            type: Boolean
        },
        isValid: {
            type: Boolean
        }
    },
    youtube: {
        URL: {
            type: String,
            trim: true
        },
        useHttps: {
            type: Boolean
        },
        pageSpeedIndex: {
            type: Number
        },
        hasTitle: {
            type: Boolean
        },
        hasMetaDesc: {
            type: Boolean
        },
        hasCanTag: {
            type: Boolean
        },
        isValid: {
            type: Boolean
        }
    },
    crunchbase: {
        URL: {
            type: String,
            trim: true
        },
        useHttps: {
            type: Boolean
        },
        pageSpeedIndex: {
            type: Number
        },
        hasTitle: {
            type: Boolean
        },
        hasMetaDesc: {
            type: Boolean
        },
        hasCanTag: {
            type: Boolean
        },
        isValid: {
            type: Boolean
        }
    },
    medium: {
        URL: {
            type: String,
            trim: true
        },
        useHttps: {
            type: Boolean
        },
        pageSpeedIndex: {
            type: Number
        },
        hasTitle: {
            type: Boolean
        },
        hasMetaDesc: {
            type: Boolean
        },
        hasCanTag: {
            type: Boolean
        },
        isValid: {
            type: Boolean
        }
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true,
    }
    },{ timestamps: true, versionKey: false });


module.exports = mongoose.model('connections', connectionSchema);
