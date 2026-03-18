const express = require('express');
const router = express.Router();

const SeatController = require("../controllers/SeatController");

//GET ROUTES

//gets all admins in the collection
router.get('/seats', SeatController.getAllSeats);

module.exports = router