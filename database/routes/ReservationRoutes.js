const express = require('express');
const path = require("path");
const router = express.Router();

const ReservationController = require("../controllers/ReservationController");

//GET ROUTES

//gets all broken documents no filter
//res.json: reservation_id, creation_timestamp, reservation_start_timestamp, reservation_end_timestamp, reservedBy, checkedIn, room_name, building, seats: [seat_name]
router.get('/reservations', ReservationController.getAllReservations);

router.get('/specific-reservation', ReservationController.getReservationById);

//filters for a specific user
//req.query: creationTimeStart, creationTimeEnd, roomName, building, reservationTimeStart, reservationTimeEnd, seatCount
//req.params: id
//res.json: reservation_id, creation_timestamp, reservation_start_timestamp, reservation_end_timestamp, checkedIn, room_name, building, seats: [seat_name]
router.get('/api/list', ReservationController.getUserReservations);

//gets all seats from one reservation
router.get('/:reservationId/seats', ReservationController.getSeats);

//filters for everyone
//req.query: reservedBy, creationTimeStart, creationTimeEnd, roomName, building, reservationTimeStart, reservationTimeEnd, seatCount
//res.json: reservation_id, creation_timestamp, reservation_start_timestamp, reservation_end_timestamp, reservedBy, checkedIn, room_name, building, seats: [seat_name]
router.get('/reservationsAdmin/filter', ReservationController.getFilteredReservations);

//checks if the user has not checkedIn on their reservation after 10 minutes (should enable the delete function)
//req.params: id
//res.json: true/false
router.get('/:reservationId/checkDeletable', ReservationController.isReservationDeletable);

//checks if the reservation has already ended, if not, then it is editable
//req.params: id
//res.json: true/false
router.get('/:reservationId/checkEditable', ReservationController.isReservationEditable);

//POST ROUTES

//req.params: adminId
//req.body: timeStart, timeEnd, seats
router.post('/:adminId/add-admin', ReservationController.addAdminReservation);

//req.params: userId
//req.body: timeStart, timeEnd, seats, anonymous
router.post('/:userId/add-user', ReservationController.addUserReservation);

//PUT ROUTES

//req.params: reservationId
//req.body: timeStart, timeEnd, seats, anonymous
router.put('/:reservationId/edit', ReservationController.editUserReservation);

//req.params: reservationId, adminId
//req.body: timeStart, timeEnd, seats
router.put('/:adminId/:reservationId/edit', ReservationController.editAdminReservation);

//DELETE ROUTES
//req.params: reservationId
router.delete('/:reservationId/delete', ReservationController.deleteReservation);

module.exports = router