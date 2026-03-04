const express = require('express');
const router = express.Router();
const Seat = require('../models/Seat.js'); // Import Seat model

// GET ROUTE
/* 
    Purpose: Information Display
    Description: Getting the name of a seat
    Accepts: _id (mongoDB object)
    Returns: seat_name (str in JSON format)
*/

router.get('/seat-name/:id', async (req, res) => {
    try{
        const seat_name = await Seat.findById(req.params.id).select("seat_nam0");

        res.send(seat_name);
    }
    catch (err){
        console.error(err.message);
        res.status(500).send('Error');
    }
});


module.exports = router;