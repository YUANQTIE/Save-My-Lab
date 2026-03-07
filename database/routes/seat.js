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
        const seat_name = await Seat.findById(req.params.id).select("seat_name");

        res.send(seat_name);
    }
    catch (err){
        console.error(err.message);
        res.status(500).send('Error');
    }
});

router.post('/automate', async (req, res) => {
  var count = 1;
  const seat = "A1905";
  const maxno = 32;
  const roomId = "699d83403232deb9582da720";
    try{
        while (count <= maxno){
            await Seat.create({
                room_id : roomId,
                seat_name : seat + "-" + String(count).padStart(2, "0")
            }
            )
            count += 1;
        }
    }
    catch (err){
        console.error(err.message);
        res.status(500).send('Error');
    }
  

})

module.exports = router;