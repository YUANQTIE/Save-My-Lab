const express = require('express');
const Reservation = require('../models/Reservation.js'); // Import Reservation model
const Seat = require('../models/Seat.js');
const Room = require('../models/Room.js');
const User = require('../models/User.js');
const Admin = require('../models/Admin.js');

// GET ROUTES 

/* 
    Purpose: General Use
    Description: Get all the fields in the collection (populate seats)
*/

exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find() //joins everything
            .populate({
                path: 'seats',
                populate: {
                    path: 'room_id'
                }
            });

        const result = reservations.map(reserve => ({ //map everything to the actual details
            reservation_id: reserve._id,
            creation_timestamp: reserve.creation_timestamp,
            reservation_start_timestamp: reserve.reservation_start_timestamp,
            reservation_end_timestamp: reserve.reservation_end_timestamp,
            reservedBy: reserve.reservedBy,
            checkedIn: reserve.checkedIn,
            room_name: reserve.seats[0].room_id.room_name,
            building: reserve.seats[0].room_id.building,
            seats: reserve.seats.map(seat => seat.seat_name)
        }));

        res.json(result);

    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Error');
    }
};
/* 
    Purpose: Filtering for showing profile and for user search 
    Should require user (optional filters creationTimeStart, creationTimeEnd, optional room, building, reservationTimeStart & reservationTimeEnd)
*/

exports.getUserReservations = async (req, res) => {
    try {
        const creationTimeStart = req.query.creationTimeStart;
        const creationTimeEnd = req.query.creationTimeEnd;
        const roomName = req.query.roomName;
        const building = req.query.building;
        const reservationTimeStart = req.query.reservationTimeStart;
        const reservationTimeEnd = req.query.reservationTimeEnd;
        const seatCount = req.query.seatCount;

        let firstStage = { reservedBy: req.params.id }; //filters by username

        if (creationTimeStart && creationTimeEnd) {
            firstStage.creation_timestamp = {
                $gte: new Date(creationTimeStart + "Z"),
                $lte: new Date(creationTimeEnd + "Z") //filters the creation date/time
            };
        }

        if (reservationTimeStart && reservationTimeEnd) {
            firstStage.reservation_start_timestamp = {
                $gte: new Date(reservationTimeStart)
            };
            firstStage.reservation_end_timestamp = {
                $lte: new Date(reservationTimeEnd) //filters the reservation date/time
            };
        }

        if (seatCount && seatCount !== "undefined") {
            firstStage.seats = { $size: Number(seatCount) }; //filters the number of seats
        }


        let reservations = await Reservation.find(firstStage) //gets the first stage of filtering
            .populate({
                path: 'seats',
                populate: {
                    path: 'room_id',
                    select: 'room_name building'
                }
            });


        if (roomName) {
            reservations = reservations.filter(reserve => reserve.seats[0].room_id.room_name === roomName); //filters by the room name
        }


        if (building) {
            reservations = reservations.filter(reserve => reserve.seats[0].room_id.building === building); //filters by the building
        }

        const result = reservations.map(reserve => ({ //map the final json
            reservation_id: reserve._id,
            creation_timestamp: reserve.creation_timestamp,
            reservation_start_timestamp: reserve.reservation_start_timestamp,
            reservation_end_timestamp: reserve.reservation_end_timestamp,
            checkedIn: reserve.checkedIn,
            room_name: reserve.seats[0].room_id.room_name,
            building: reserve.seats[0].room_id.building,
            seats: reserve.seats.map(seat => seat.seat_name)
        }));

        console.log("Result: ", result)

        res.json(result);

    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Error');
    }
};

/* 
    Gets all seats of a reservation
    Requires reservationId
*/
exports.getSeats = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.reservationId).populate({
            path: 'seats',
            populate: {
                path: 'room_id',
                select: 'room_name building'
            }
        });;
        if (!reservation) {
            return res.status(404).json({ msg: 'Reservation not found' });
        }

        const result = {
            seats: reservation.seats.map(seat => seat.seat_name)
        }
        res.json(result)
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Error');
    }
};



/* 
    Purpose: Filtering for all reservations (admin view)
    optional filtering with user, room, building, timestart and timend, creation_date
*/

exports.getFilteredReservations = async (req, res) => {
    try {
        const reservedBy = req.query.reservedBy; //this is an email
        const creationTimeStart = req.query.creationTimeStart;
        const creationTimeEnd = req.query.creationTimeEnd;
        const roomName = req.query.roomName;
        const building = req.query.building;
        const reservationTimeStart = req.query.reservationTimeStart;
        const reservationTimeEnd = req.query.reservationTimeEnd;
        const seatCount = req.query.seatCount;

        console.log(reservedBy, creationTimeStart, creationTimeEnd, roomName, building, reservationTimeStart, reservationTimeEnd, seatCount)

        let firstStage = {}; //filters by username

        if (creationTimeStart && creationTimeEnd) {
            firstStage.creation_timestamp = {
                $gte: new Date(creationTimeStart + "Z"),
                $lte: new Date(creationTimeEnd + "Z") //filters the creation date/time
            };
        }

        if (reservationTimeStart && reservationTimeEnd) {
            firstStage.reservation_start_timestamp = {
                $gte: new Date(reservationTimeStart + "Z")
            };
            firstStage.reservation_end_timestamp = {
                $lte: new Date(reservationTimeEnd + "Z") //filters the reservation date/time
            };
        }

        if (seatCount) {
            firstStage.seats = { $size: Number(seatCount) }; //filters the number of seats
        }

        let reservations = await Reservation.find(firstStage) //gets the first stage of filtering
            .populate({
                path: 'seats',
                populate: {
                    path: 'room_id',
                    select: 'room_name building'
                }
            }).populate({
                path: 'reservedBy',
                select: 'email'
            });

        if (reservedBy) {
            reservations = reservations.filter(reserve => reserve.reservedBy.email === reservedBy);
        }


        if (roomName) {
            reservations = reservations.filter(reserve => reserve.seats[0].room_id.room_name === roomName); //filters by the room name
        }

        if (building) {
            reservations = reservations.filter(reserve => reserve.seats[0].room_id.building === building); //filters by the building
        }

        const EIGHT_HOURS_IN_MS = 8 * 60 * 60 * 1000;

        const result = reservations.map(reserve => {
            const adjustedStart = new Date(reserve.reservation_start_timestamp.getTime() - EIGHT_HOURS_IN_MS);
            const adjustedEnd = new Date(reserve.reservation_end_timestamp.getTime() - EIGHT_HOURS_IN_MS);
            const formattedStartDate = new Intl.DateTimeFormat('en-US', {
                month: 'long',
                day: '2-digit',
                year: 'numeric',
                timeZone: 'UTC'
            }).format(reserve.reservation_start_timestamp);

            return {
                reservation_id: reserve._id,
                creation_timestamp: reserve.creation_timestamp,
                reservation_start_timestamp: adjustedStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
                reservation_end_timestamp: adjustedEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
                date: formattedStartDate,
                reservedBy: reserve.reservedBy.email,
                checkedIn: reserve.checkedIn,
                room_name: reserve.seats[0].room_id.room_name,
                building: reserve.seats[0].room_id.building,
                seats: reserve.seats.map(seat => seat.seat_name)
            };
        });

        res.json(result);

    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Error');
    }
};

exports.isReservationDeletable = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.reservationId).select("checkedIn reservation_start_timestamp");

        if (reservation.checkedIn) {
            return res.json(false);
        }
        let currentDate = new Date();
        let currentTime = currentDate.toLocaleTimeString('en-US', { hour12: false })
        const [currentHours, currentMinutes] = currentTime.split(':').map(Number);
        let currentTimeInMinutes = currentHours * 60 + currentMinutes
        const reservationStart = new Date(reservation.reservation_start_timestamp);
        const startDate = [
            reservationStart.getUTCFullYear(),
            String(reservationStart.getUTCMonth() + 1).padStart(2, '0'),
            String(reservationStart.getUTCDate()).padStart(2, '0')
        ].join('-');
        currentDate = currentDate.toISOString().split('T')[0];

        const startTime = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
            timeZone: 'UTC'
        }).format(reservationStart);
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        let startTimeInMinutes = startHours * 60 + startMinutes
        console.log("currentTimeInMinutes ", currentTimeInMinutes)
        console.log("startTime: ", startTime)

        if (startDate > currentDate) {
            return res.json(false)
        }
        else if (startDate < currentDate) {
            return res.json(true);
        }
        else if (startDate == currentDate && currentTimeInMinutes - startTimeInMinutes >= 10) {
            return res.json(true)
        }
        else {
            return res.json(false);
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
};

exports.isReservationEditable = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.reservationId).select("reservation_end_timestamp");

        if (reservation.checkedIn) {
            return res.json(false);
        }
        let currentDate = new Date();
        let currentTime = currentDate.toLocaleTimeString('en-US', { hour12: false })
        const reservationEnd = new Date(reservation.reservation_end_timestamp);
        const endDate = [
            reservationEnd.getUTCFullYear(),
            String(reservationEnd.getUTCMonth() + 1).padStart(2, '0'),
            String(reservationEnd.getUTCDate()).padStart(2, '0')
        ].join('-');
        currentDate = currentDate.toISOString().split('T')[0];

        const endTime = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
            timeZone: 'UTC'
        }).format(reservationEnd);

        console.log("End time: ", endTime)

        if (endDate < currentDate) {
            return res.json(false)
        }
        else if (endDate > currentDate) {
            return res.json(true);
        }
        else if (endDate == currentDate && endTime > currentTime) {
            return res.json(true)
        }
        else {
            return res.json(false);
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
};

// POST ROUTES

/* 
    Purpose: Add Reservation (for admin)
    Description: Adds a "Reservation" document to the collection
*/

exports.addAdminReservation = async (req, res) => {
    try {
        await Reservation.create({
            creation_timestamp: new Date(Date.now()),
            reservation_start_timestamp: new Date(req.body.timeStart),
            reservation_end_timestamp: new Date(req.body.timeEnd),
            reservedBy: req.params.adminId,
            reservedByModel: "Admin",
            seats: req.body.seats
        });

        res.send("Reservation added successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
};
/* 
    Purpose: Add Reservation (for student)
    Description: Adds a "Reservation" document to the collection
*/

exports.addUserReservation = async (req, res) => {
    try {
        await Reservation.create({
            creation_timestamp: new Date(Date.now()),
            reservation_start_timestamp: req.body.timeStart + "Z",
            reservation_end_timestamp: req.body.timeEnd + "Z",
            reservedBy: req.params.userId,
            reservedByModel: "User",
            seats: req.body.seats,
            anonymous: req.body.anonymous
        });

        res.send("Reservation added successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
};

// PUT ROUTES
/* 
    Purpose: Edit Computer Reservation
    Description: Edit any of the details in the document (set creation to now)
*/

exports.editUserReservation = async (req, res) => {
    try {

        await Reservation.findByIdAndUpdate(
            req.params.reservationId,
            {
                reservation_start_timestamp: new Date(req.body.timeStart),
                reservation_end_timestamp: new Date(req.body.timeEnd),
                creation_timestamp: new Date(Date.now()),
                seats: req.body.seats,
                anonymous: req.body.anonymous
            }
        );

        res.send("Reservation updated successfully");

    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
};

/* 
    Purpose: Edit Computer Reservation (coerces creator to be the admin)
    Description: Edit any of the details in the document (set creation to now)
*/

exports.editAdminReservation = async (req, res) => {
    try {

        await Reservation.findByIdAndUpdate(
            req.params.reservationId,
            {
                reservation_start_timestamp: new Date(req.body.timeStart),
                reservation_end_timestamp: new Date(req.body.timeEnd),
                reservedBy: req.params.adminId,
                reservedByModel: "Admin",
                creation_timestamp: new Date(Date.now()),
                seats: req.body.seats
            }
        );

        res.send("Reservation updated successfully");

    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
};

// DELETE ROUTES

/* 
    Purpose: When reservation is finished or deleted by admin. when time passes by 10
    Description: Remove a document from reservation collection
    ADMIN ONLY!!
*/

exports.deleteReservation = async (req, res) => {
    try {
        await Reservation.findByIdAndDelete(req.params.reservationId);

        res.send("Reservation Deleted Successfully");

    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
};
