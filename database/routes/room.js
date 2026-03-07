const express = require('express');
const router = express.Router();
const Room = require('../models/Room.js'); // Import Room model
const Seat = require('../models/Seat.js'); // Import Seat model
const Broken = require('../models/Broken.js'); // Import Broken model
const Reservation = require('../models/Reservation.js'); // Import Reservation model

// GET ROUTES

/* 
    Purpose: General Use
    Description: Get all the fields in the collection
*/

router.get('/all', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
});

/* 
    Purpose: Filtering for building
*/
router.get('/buildings', async (req, res) =>{
    try{
        const rooms = await Room.distinct("building");
        res.json(rooms);
    } catch (err){
        console.error(err.message);
        res.status(500).send('Error');
    }
});


/* 
    Purpose: Filtering for rooms (add reservation)
    Should require for building
*/
router.get('/buildingRooms', async (req, res) =>{
    try{
        const rooms = await Room.find( { building : req.query.buildingName }).select("room_name");
        res.json(rooms);
    } catch (err){
        console.error(err.message);
        res.status(500).send('Error');
    }
});

/* 
    Purpose: Filtering for available seats (add reservation)
    Should require for room name, time_start, and time_end to first appear
*/

router.get('/add-availableSeats', async (req, res) =>{
    try {
        const timeStart = new Date(req.query.timeStart + "Z");
        const timeEnd = new Date(req.query.timeEnd + "Z"); //real-time querying

        const reservedSeats = await Reservation.find({
        reservation_start_timestamp: { $lte: timeEnd }, //gets reservations within the ending time and starting time
        reservation_end_timestamp: { $gte: timeStart }
        }).select("seats");

        const brokenSeats = await Broken.find({ //gets reservations that are greater than or equal the time start
        broken_start_timestamp: { $gte: timeStart }
        }).select("seats");

        const reservedSeatIds = reservedSeats.flatMap(doc => doc.seats); //turns the object array of seats into a regular array of seats
        const brokenSeatIds = brokenSeats.flatMap(doc => doc.seats);

        const unavailableSeatIds = [...new Set([...reservedSeatIds,...brokenSeatIds])]; //unionizes all of the seats
        
        const room = await Room.findOne({room_name: req.query.roomName});
        
        const availableSeats = await Seat.find({room_id: room,_id: { $nin: unavailableSeatIds }});

        res.json(availableSeats);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error');
    }
});

/* 
    Purpose: getting the counts and labels of seats
    Should require for the current room name, time-start, and time end to first appear
*/
router.get('/add-seatcount', async (req, res) =>{
    try {
        const timeStart = new Date(req.query.timeStart + "Z");
        const timeEnd = new Date(req.query.timeEnd + "Z"); //real-time querying

        const reservedSeats = await Reservation.find({
        reservation_start_timestamp: { $lte: timeEnd }, //gets reservations within the ending time and starting time
        reservation_end_timestamp: { $gte: timeStart }
        }).select("seats");

        const brokenSeats = await Broken.find({ //gets reservations that are greater than or equal the time start
        broken_start_timestamp: { $gte: timeStart }
        }).select("seats");

        const reservedSeatIds = reservedSeats.flatMap(doc => doc.seats); //turns the object array of seats into a regular array of seats
        const brokenSeatIds = brokenSeats.flatMap(doc => doc.seats);

        const unavailableSeatIds = [...new Set([...reservedSeatIds,...brokenSeatIds])]; //unionizes all of the seats
        
        const room = await Room.findOne({room_name: req.query.roomName});


        const actuallyReservedSeats = await Seat.find({room_id: room,_id: { $in: reservedSeatIds }});
        const actuallyBrokenSeats = await Seat.find({room_id: room,_id: { $in: brokenSeatIds }});
        const availableSeats = await Seat.find({room_id: room,_id: { $nin: unavailableSeatIds }});

        res.json({
            "reserved": actuallyReservedSeats.length,
            "broken": actuallyBrokenSeats.length,
            "available": availableSeats.length
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error');
    }
});


module.exports = router;