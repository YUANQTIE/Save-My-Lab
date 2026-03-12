const express = require('express');
const router = express.Router();

const RoomController = require("../controllers/RoomController");

//GET ROUTES

//all room documents
//res.json: display_image, _id, room_name, building, capacity, layout_image
router.get('/rooms', RoomController.getAllRooms);

//all buildings (andrew, goks, yuch, ls)
//res.json: array of strings nung buildings
router.get('/buildings', RoomController.getAllBuildings);

//all rooms inside a building
//req.query: buildingName
//res.json: _id, room_name
router.get('/building/room-names', RoomController.getRoomInBuilding);

//gets all seat id's and seat names with status (available, reserved, broken), if reserved, displays the person who reserved it.
//req.query: timeStart, timeEnd, roomName
//res.json: _id, seat_name, status, (if reserved, also has reservedBy, reservationStart, reservationEnd properties)
router.get('/seat-status', RoomController.getSeatStatus);

//gets the count per status
//req.query: timeStart, timeEnd, roomName
//res.json: available, reserved, broken
router.get('/seat-status/counts', RoomController.getSeatStatusCounts);


module.exports = router