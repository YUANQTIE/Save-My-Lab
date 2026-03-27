const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const fileUpload = require('express-fileupload');


const app = express(); // Define app FIRST
const port = process.env.PORT || 3000;
const url = process.env.MONGODB_URI;

const adminRoutes = require('./database/routes/AdminRoutes');
const brokenRoutes = require('./database/routes/BrokenRoutes.js');
const reservationRoutes = require('./database/routes/ReservationRoutes.js')
const roomRoutes = require('./database/routes/RoomRoutes.js')
const seatRoutes = require('./database/routes/SeatRoutes.js')
const userRoutes = require('./database/routes/UserRoutes.js');
const auxRoutes = require('./database/routes/AuxiliaryRoutes.js');


/* We'll use handlebars for this one */
var hbs = require('hbs')
app.engine("hbs", exphbs.engine({ extname: 'hbs', defaultLayout: 'main', partialsDir: __dirname + '/views/partials' }))
app.set('view engine', 'hbs');
app.set("views", "./views")

app.use(express.json()) // use json
app.use(express.text()) // use json
app.use(express.urlencoded({ extended: true })); // files consist of more than strings
app.use(express.static('public')) // we'll add a static directory named "public"
//app.use('/views', express.static(path.join(__dirname, 'views')));
app.use(fileUpload()) // for fileuploads
app.use(express.static(path.join(__dirname, ''))); // serve everything in project folder

app.use('/admin', adminRoutes)
app.use('/broken', brokenRoutes)
app.use('/reservations', reservationRoutes)
app.use('/room', roomRoutes)
app.use('/seat', seatRoutes)
app.use('/user', userRoutes)
app.use('/aux', auxRoutes)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/default/index.html'));
});


mongoose.connect(url)
  .then(() => {
    console.log("Mongoose connected to Atlas");
    app.listen(port, () => {
      console.log(`port at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
});