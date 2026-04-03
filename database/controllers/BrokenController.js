const express = require('express');
const Broken = require('../models/Broken.js'); 
const Seat = require('../models/Seat.js'); 
const Room = require('../models/Room.js'); 

// GET ROUTES

/* 
    Purpose: General Use
    Description: Get all the fields in the collection
*/

exports.getAllBrokens = async (req, res) =>{
    try{
        const brokens = await Broken.find().populate({
            path: 'seats',
            populate: {
                path: 'room_id'
            }
        });
        
        res.json(brokens)
    }
    catch (err){
        console.error(err);
        res.status(500).send("Error");
    }
};

/* 
    Purpose: Filtering broken computers (admin view)
    optional room, building, creationTimeStart, creationTimeEnd, timestart & timeend
*/

exports.getFilteredBrokens = async (req, res) => {
    try {

        const roomName = req.query.roomName;
        const building = req.query.building;
        const brokenTimeStart = req.query.brokenTimeStart;
        const reason = req.query.reason;

        console.log(roomName, building, reason)
        console.log(brokenTimeStart)

        let firstStage = { };

        if (brokenTimeStart) {
            console.log("1st true")
            firstStage.broken_start_timestamp = {
                $gte: new Date(brokenTimeStart + "Z")
            };
        }

        if (reason) {
            console.log("2st true")
            firstStage.reason = {
                $regex: reason,
                $options: "i"
            };
        }

        let brokens = await Broken.find(firstStage)
        .populate({
            path: 'seats',
            populate: {
                path: 'room_id',
                select: 'room_name building'
            }
        });

        if (roomName) {
            console.log("3rd true")
            brokens = brokens.filter(broke => broke.seats[0].room_id.room_name === roomName);
        }

        if (building) {
            console.log("4tth true")
            brokens = brokens.filter(broke => broke.seats[0].room_id.building === building);
        }

        const result = brokens.map(broke => ({
            broken_id: broke._id,
            creation_timestamp: broke.creation_timestamp,
            broken_start_timestamp: broke.broken_start_timestamp,
            reason: broke.reason, 
            room_name: broke.seats[0].room_id.room_name,
            building: broke.seats[0].room_id.building,
            seats: broke.seats.map(
                seat => seat.seat_name
            )
        }));

        res.json(result);

    }
    catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
};

exports.getSeats = async (req, res) => {
    try {
        const broken = await Broken.findById(req.params.brokenId).populate({
            path: 'seats',
            populate: {
                path: 'room_id',
                select: 'room_name building'
            }
        });;
        if (!broken) {
            return res.status(404).json({ msg: 'Broken not found' });
        }

        const result = {
            seats: broken.seats.map(seat => seat.seat_name)
        }
        res.json(result)
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Error');
    }
};

exports.getBrokenDocument = async (req, res) => {
    try {
        const brokenId = req.session.brokenId;

        const broken = await Broken.findById(brokenId)
        .populate({
            path: 'seats',
            populate: {
                path: 'room_id'
            }
        });

        if (!broken) {
            return res.status(404).json({ msg: 'Broken not found' });
        }

        const result = {
            broken_id: broken._id,
            broken_start_timestamp: broken.broken_start_timestamp,
            reason: broken.reason,
            room_name: broken.seats[0].room_id.room_name,
            building: broken.seats[0].room_id.building,
            seats: broken.seats.map(seat => seat._id),
            seat_names: broken.seats.map(seat => seat.seat_name)
        };

        console.log(result);

        res.json(result);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Error');
    }
};



// POST ROUTES

/* 
    Purpose: Broken Computer Adding
    Description: Adds a "broken" document to the collection
    Returns: seat_names (str in JSON format), room_name (str in JSON format)
*/

exports.addBroken = async (req, res) => {
  try {
    const brokenRecord = await Broken.create({
      broken_start_timestamp: new Date(req.body.brokenTimeStart + "Z"),
      seats: req.body.seats,
      reason: req.body.reason,
      administered_by: req.session.adminId
    });

    res.json({
      message: "Broken Computer(s) successfully added",
      brokenId: brokenRecord._id
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
};

// PUT ROUTES

/* 
    Purpose: Edit Computer Status
    Description: Edit details any of the details in the document (set creation to now)
*/

exports.editBroken = async (req, res) =>{
  try {
    await Broken.findByIdAndUpdate( 
        req.session.brokenId,
        {
            seats: req.body.seats,
            administered_by: req.session.adminId
        }
    );

    res.send("Broken Computer(s) successfully edited");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
}

// DELETE ROUTES

/* 
    Purpose: When all the computers in a "broken" document are fixed na 
    Description: Remove a document from broken collection
*/

exports.deleteBroken = async (req, res) =>{
  try {
    await Broken.findByIdAndDelete( req.session.brokenId );

    res.send("Broken Computer(s) successfully deleted");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
}