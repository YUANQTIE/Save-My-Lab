const express = require('express');
const router = express.Router();

const BrokenController = require("../controllers/BrokenController");

//GET ROUTES

//gets all broken documents no filter
//res.json: "_id", creation_timestamp, broken_start_timestamp, "[seats : _id (ng seat), seat_name, [room_id : _id (ng room), room_name, building, capacity]]"
router.get('/brokens', BrokenController.getAllBrokens);

//gets all brokens with possible filters for: room name, building, broken time start, creation time start and creation end start <- these both have to be inputted
//req.query: roomName, building, brokenTimeStart, creationTimeStart, creationTimeEnd
//res.json: "_id", creation_timestamp, broken_start_timestamp, "[seats : _id (ng seat), seat_name, [room_id : _id (ng room), room_name, building, capacity]]"

router.get('/brokens/filter', BrokenController.getFilteredBrokens);

//POST ROUTES
//req.body: brokenTimeStart, seats
router.post('/add', BrokenController.addBroken);

//PUT ROUTES
//req.body: brokenTimeStart, seats
router.put('/edit/:id', BrokenController.editBroken);

//DELETE ROUTES
//req.params: id
router.delete('/delete/:id', BrokenController.deleteBroken);

module.exports = router