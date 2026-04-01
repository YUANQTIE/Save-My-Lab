const express = require('express');
require('../models/User.js'); // Import Room model
require('../models/Admin.js'); // Import Seat model
const Room = require('../models/Room.js'); // Import Room model
const Seat = require('../models/Seat.js'); // Import Seat model
const Broken = require('../models/Broken.js'); // Import Broken model
const Reservation = require('../models/Reservation.js'); // Import Reservation model

// GET ROUTES

/* 
    Purpose: General Use
    Description: Get all the fields in the collection
*/

exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
};

/* 
    Purpose: Filtering for building
*/
exports.getAllBuildings = async (req, res) =>{
    try{
        const rooms = await Room.distinct("building");
        res.json(rooms);
    } catch (err){
        console.error(err.message);
        res.status(500).send('Error');
    }
};


/* 
    Purpose: Filtering for rooms (add reservation)
    Should require for building
*/
exports.getRoomInBuilding = async (req, res) =>{
    try{
        const rooms = await Room.find( { building : req.query.buildingName }).select("room_name");
        console.log(rooms)
        res.json(rooms);
    } catch (err){
        console.error(err.message);
        res.status(500).send('Error');
    }
};

/* 
    Purpose: Filtering for available seats (add reservation)
    Should require for room name, time_start, and time_end to first appear
*/

exports.getSeatStatus = async (req, res) => {
    try {
        console.log(req.query.timeStart, req.query.timeEnd);
        const timeStart = new Date(req.query.timeStart + "Z");
        const timeEnd = new Date(req.query.timeEnd + "Z");

        const room = await Room.findOne({ room_name: req.query.roomName });

        console.log(req.query.roomName)

        console.log(room)

        const allSeats = await Seat.find({ room_id: room._id }).sort({ seat_number: 1 });

        const reservedSeats = await Reservation.find({
            reservation_start_timestamp: { $lte: timeEnd },
            reservation_end_timestamp: { $gte: timeStart }
        })
        .populate("reservedBy").select("reservedBy reservedByModel seats reservation_start_timestamp reservation_end_timestamp anonymous");

        const brokenSeats = await Broken.find({
            broken_start_timestamp: { $lte: timeEnd }
        }).select("seats");

        const reservedSeatMap = {}; 
        reservedSeats.forEach(resv => {
            resv.seats.forEach(seatId => {
                let ownerDisplay = resv.reservedBy?.email || "sheeesh";
                if (resv.anonymous === true) {
                    ownerDisplay = "Anonymous";
                }
                reservedSeatMap[seatId.toString()] = {
                    email: ownerDisplay, 
                    reservationStart: resv.reservation_start_timestamp,
                    reservationEnd: resv.reservation_end_timestamp
                };
            });
        });

        const brokenSeatIds = brokenSeats.flatMap(doc => doc.seats.map(s => s.toString()));

        const seatsWithStatus = allSeats.map(seat => {
            const id = seat._id.toString();
            let seatData = {
                _id: seat._id,
                seat_name: seat.seat_name,
                status: 'available'
            };

            if (brokenSeatIds.includes(id)) {
                seatData.status = 'broken';
            } else if (reservedSeatMap[id]) {
                seatData.status = 'reserved';
                seatData.reservedBy = reservedSeatMap[id].email; 
                seatData.reservationStart = reservedSeatMap[id].reservationStart;
                seatData.reservationEnd = reservedSeatMap[id].reservationEnd;
            }

            return seatData;
        });

        res.json(seatsWithStatus);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
};

// 
exports.getEditSeatStatus = async (req, res) => {
    try {
        const timeStart = new Date(req.query.timeStart + "Z");
        const timeEnd = new Date(req.query.timeEnd + "Z");

        let selectedSeats = req.query.selectedSeats || [];

        if (typeof selectedSeats === "string") {
            selectedSeats = selectedSeats.split(",");
        }

        selectedSeats = selectedSeats.map(id =>
            id.toString().trim()
        );

        const room = await Room.findOne({ room_name: req.query.roomName });

        const allSeats = await Seat.find({ room_id: room._id }).sort({ seat_number: 1 });

        const reservedSeats = await Reservation.find({
            reservation_start_timestamp: {
                $lte: timeEnd
            },
            reservation_end_timestamp: {
                $gte: timeStart
            }
        }).populate({ path: "reservedBy", select: "email"})
        .select(
            "reservedBy reservedByModel seats reservation_start_timestamp reservation_end_timestamp anonymous"
        );

        const brokenSeats = await Broken.find({
            broken_start_timestamp: {
                $lte: timeEnd
            }
        }).select("seats");

        const reservedSeatMap = {};

        reservedSeats.forEach(resv => {

            resv.seats.forEach(seatId => {

                let ownerDisplay = "Unknown";

                if (resv.reservedByModel === "Admin") {
                    ownerDisplay = "Anonymous";
                }

                else if (resv.reservedByModel === "User") {
                    ownerDisplay =
                        resv.reservedBy?.email || "Unknown";
                }

                if (resv.anonymous === true) {
                    ownerDisplay = "Anonymous";
                }

                reservedSeatMap[seatId.toString()] = {
                    email: ownerDisplay,
                    reservationStart:
                        resv.reservation_start_timestamp,
                    reservationEnd:
                        resv.reservation_end_timestamp
                };

            });

        });

        const brokenSeatIds = brokenSeats.flatMap(doc => doc.seats.map(s =>
                s.toString()
            )
        );

        const seatsWithStatus =
            allSeats.map(seat => {
                const id =
                    seat._id.toString();

                let seatData = {
                    _id: seat._id,
                    seat_name: seat.seat_name,
                    status: "available"
                };

                if (selectedSeats.includes(id)) {
                    seatData.status = "selected";
                }

                else if (reservedSeatMap[id]) {
                    seatData.status = "reserved";
                    seatData.reservedBy = reservedSeatMap[id].email;
                    seatData.reservationStart = reservedSeatMap[id].reservationStart;
                    seatData.reservationEnd = reservedSeatMap[id].reservationEnd;
                }

                else if ( brokenSeatIds.includes(id)) {
                    seatData.status = "broken";
                }

                return seatData;

            });

        res.json(seatsWithStatus);

    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
};

exports.getEditSeatStatus2 = async (req, res) => {
    try {
        const timeStart = new Date(req.query.timeStart + "Z");
        const timeEnd = new Date(req.query.timeEnd + "Z");

        const resId = req.session.resId;

        const initialReservation = await Reservation.findById(resId);

        const room = await Room.findOne({ room_name: req.query.roomName });

        const allSeats = await Seat.find({ room_id: room._id });

        const selectedSeats =
            initialReservation.seats.map(s =>
                s.toString()
            );

        const reservedSeats = await Reservation.find({
            _id: { $ne: resId },
            reservation_start_timestamp: {
                $lte: timeEnd
            },
            reservation_end_timestamp: {
                $gte: timeStart
            }
        }).select("reservedBy reservedByModel seats reservation_start_timestamp reservation_end_timestamp anonymous")
        .populate({ path: "reservedBy", select: "email" });

        const brokenSeats = await Broken.find({
            broken_start_timestamp: {
                $lte: timeEnd
            }
        }).select("seats");

        const reservedSeatMap = {};

        reservedSeats.forEach(resv => {

            resv.seats.forEach(seatId => {

                let ownerDisplay = "Unknown";

                if (resv.reservedByModel === "Admin") {
                    ownerDisplay = "Anonymous";
                }

                else if (resv.reservedByModel === "User") {
                    ownerDisplay =
                        resv.reservedBy?.email || "Unknown";
                }

                if (resv.anonymous === true) {
                    ownerDisplay = "Anonymous";
                }

                reservedSeatMap[seatId.toString()] = {
                    email: ownerDisplay,
                    reservationStart: resv.reservation_start_timestamp,
                    reservationEnd: resv.reservation_end_timestamp
                };
            });

        });

        const brokenSeatIds = brokenSeats.flatMap(doc =>
            doc.seats.map(s =>
                s.toString()
            )
        );

        const seatsWithStatus = allSeats.map(seat => {
            const id = seat._id.toString();

            let seatData = {
                _id: seat._id,
                seat_name: seat.seat_name,
                status: "available"
            };

            if (reservedSeatMap[id]) {
                seatData.status = "reserved";
                seatData.reservedBy = reservedSeatMap[id].email;
                seatData.reservationStart = reservedSeatMap[id].reservationStart;
                seatData.reservationEnd = reservedSeatMap[id].reservationEnd;
            }

            else if (brokenSeatIds.includes(id)) {
                seatData.status = "broken";
            }

            else if (selectedSeats.includes(id)) {
                seatData.status = "selected";
            }

            return seatData;
        });

        seatsWithStatus.sort((a, b) =>a.seat_name.localeCompare(
                b.seat_name,
                undefined,
                {
                    numeric: true,
                    sensitivity: "base"
                }
            )
        );

        res.json(seatsWithStatus);

    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
};

/* 
    Purpose: getting the counts and labels of seats
    Should require for the current room name, time-start, and time end to first appear
*/
exports.getSeatStatusCounts = async (req, res) =>{
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
};