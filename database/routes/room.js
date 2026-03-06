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
    Purpose: Filter
    Description: Get all the rooms within a building
 */

router.get('/room-search/:buildingName', async (req, res) => {
  try {
    const rooms = await Room.find({ building : req.params.buildingName });
    res.json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
});

/*    
    Purpose: Information Display: Seats in the Room
    Description: Get all of the seat_ids within a room given a d
*/

router.get('/room-seats/:id', async (req, res) => {
  try {
    const seats = await Seat.find( {room_id: req.params.id} );
    res.json(seats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
});

/* 
    Purpose: Information Display: Seats in a room along with their status given two timestamps
    Description: Get all of the seat_ids that are available within a room given two timestamps
*/

router.get('/room-available-seats-status/:id', async (req, res) => {
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

    const seats = await Seat.aggregate([
      {
        $match: {
          room_id: req.params.id
        }
      },
      {
        $addFields: {
          status: {
            $cond: {
              if: { $in: ["$_id", reservedSeatIds] },
              then: "reserved",
              else: {
                $cond: {
                  if: { $in: ["$_id", brokenSeatIds] },
                  then: "broken",
                  else: "available"
                }
              }
            }
          }
        }
      }
    ]);

    res.json(seats);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
});

/* 
    Purpose: Information Display: Availalbe Seats in the Building (seat selection)
    Description: Get all of the seat_ids that are available within a room given two timestamps
*/

router.get('/room-available-seats/:id', async (req, res) => {
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

    const availableSeats = await Seat.find({ //finds the seats in a room that are not in the unionized seats of unavailable rooms
      room_id: req.params.id,
      _id: { $nin: unavailableSeatIds }
    });
    res.json(availableSeats);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
});


/* 
    Purpose: Information Display: Available Seats in the Building
    Description: Get all of the seat_ids that are available within a building given two timestamps
*/

router.get('/room-available-seats-building', async (req, res) => {
  try {
    const timeStart = new Date(req.query.timeStart + "Z");
    const timeEnd = new Date(req.query.timeEnd + "Z"); //real-time querying

    const reservedSeats = await Reservation.find({
      reservation_start_timestamp: { $lt: timeEnd }, //gets reservations within the ending time and starting time
      reservation_end_timestamp: { $gt: timeStart }
    }).select("seats");

    const brokenSeats = await Broken.find({ //gets reservations that are greater than or equal the time start
      broken_start_timestamp: { $gte: timeStart }
    }).select("seats");

    const reservedSeatIds = reservedSeats.flatMap(doc => doc.seats); //turns the object array of seats into a regular array of seats
    const brokenSeatIds = brokenSeats.flatMap(doc => doc.seats);

    const unavailableSeatIds = [...new Set([...reservedSeatIds,...brokenSeatIds])]; //unionizes all of the seats
    
    const roomBuildingIds = await Room.find({
      building : req.query.buildingName
    }).select("_id");

    const roomIds = roomBuildingIds.map(room => room._id.toString()); //stringifies the contents of the array

    const availableSeats = await Seat.find({
      room_id : { $in : roomIds },
      _id: { $nin: unavailableSeatIds }
    });

    res.json(availableSeats);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
});


module.exports = router;