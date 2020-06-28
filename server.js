
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const usersRouter = require('./routes/users');

const mongoose = require("mongoose");
const cors = require('cors')

mongoose.connect('mongodb://localhost:27017/techhunt', { useNewUrlParser: true });
const db = mongoose.connection

db.on('error', err => {
    console.error('connection error:', err)
})

app.use(cors())
app.use(bodyParser.json());


app.use('/users', usersRouter);

// app.post('/', function (req, res) {
//     res.send('Got a POST request')
// })

app.listen(5000, function () {
    console.log('listening on 5000');
});