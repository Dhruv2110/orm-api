const express = require('express');
const app = express();
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors')
var route = require('./routes/router.js');

app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(cors())

let config = require('./config/'+ process.env.NODE_ENV );
const PORT = process.env.PORT || 9641;

// Routes
app.use('/', route.init());

mongoose.connect(config.mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    app.listen(PORT, () => console.log('server is running on ' + PORT))
    console.log('mongodb connected')
}).catch(err => console.log(err))



