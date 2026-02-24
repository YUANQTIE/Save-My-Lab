

const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/Save-My-Lab')

/* Initialize express */
const express = require('express')
const app = new express()

/* For file uploads */
const fileUpload = require('express-fileupload')

/* We'll use handlebars for this one */
var hbs = require('hbs')
app.set('view engine','hbs');

/* Initialize our models */
const Admin = require("./database/models/Admin")
const Reservation = require("./database/models/Reservation")
const Room = require("./database/models/Room")
const Seat = require("./database/models/Seat")
const User = require("./database/models/User")
const Broken = require("./database/models/Broken")

const path = require('path') // our path directory

app.use(express.json()) // use json
app.use(express.urlencoded( {extended: true})); // files consist of more than strings
app.use(express.static('public')) // we'll add a static directory named "public"
app.use(fileUpload()) // for fileuploads

app.get('/test', async (req, res) => {
  try {
    const users = await User.find({})
    console.log("Rooms fetched:", users);

    res.render('test', { users });

  } catch (err) {
    console.error("Error in /test route:", err);
    res.status(500).send("Something went wrong");
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

var server = app.listen(3000, function () {
    console.log('Node server is running..');
});