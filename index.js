

const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/Save-My-Lab')

/* Initialize express */
const express = require('express')
const app = new express()

const adminRoutes = require('./database/routes/admin');
const brokenRoutes = require('./database/routes/broken.js')
const reservationRoutes = require('./database/routes/reservation.js')
const roomRoutes = require('./database/routes/room.js')
const seatRoutes = require('./database/routes/seat.js')
const userRoutes = require('./database/routes/user');

/* For file uploads */
const fileUpload = require('express-fileupload')

/* We'll use handlebars for this one */
var hbs = require('hbs')
app.set('view engine','hbs');

const path = require('path') // our path directory

app.use(express.json()) // use json
app.use(express.text()) // use json
app.use(express.urlencoded( {extended: true})); // files consist of more than strings
app.use(express.static('public')) // we'll add a static directory named "public"
app.use(fileUpload()) // for fileuploads

app.use('/admin', adminRoutes)
app.use('/broken', brokenRoutes)
app.use('/reservation', reservationRoutes)
app.use('/room', roomRoutes)
app.use('/seat', seatRoutes)
app.use('/users', userRoutes)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

var server = app.listen(3000, function () {
    console.log('server running');
});