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

exports.getFilteredBrokens = async (req, res) =>{
    try{
        const roomName = req.query.roomName
        const building = req.query.building
        const brokenTimeStart = req.query.brokenTimeStart
        const creationTimeStart = req.query.creationTimeStart
        const creationTimeEnd = req.query.creationTimeEnd

        let firstStage = { };

        if (creationTimeStart && creationTimeEnd) {
            firstStage.creation_timestamp = {
                $gte: new Date(creationTimeStart + "Z"),
                $lte: new Date(creationTimeEnd + "Z") //filters the creation date/time
            };
        }

        if (brokenTimeStart) {
            firstStage.broken_start_timestamp = {
                $gte: new Date(brokenTimeStart + "Z")
            };
        }

        let brokens = await Broken.find(firstStage) //gets the first stage of filtering
        .populate({
            path: 'seats',
            populate: {
                path: 'room_id',
                select: 'room_name building'
            }
        });

        if (roomName) {
            brokens = brokens.filter(broke => broke.seats[0].room_id.room_name === roomName); //filters by the room name
        }

        if (building) {
            brokens = brokens.filter(broke => broke.seats[0].room_id.building === building); //filters by the building
        }

        const result = brokens.map(broke => ({ //map the final json
            broken_id: broke._id,
            creation_timestamp: broke.creation_timestamp,
            broken_start_timestamp: broke.broken_start_timestamp,
            room_name: broke.seats[0].room_id.room_name,
            building: broke.seats[0].room_id.building,
            seats: broke.seats.map(seat => seat.seat_name)
        }));
        
        res.json(result)
    }
    catch (err){
        console.error(err);
        res.status(500).send("Error");
    }
};



// POST ROUTES

/* 
    Purpose: Broken Computer Adding
    Description: Adds a "broken" document to the collection
    Returns: seat_names (str in JSON format), room_name (str in JSON format)
*/

exports.addBroken = async (req, res) =>{
  try {
    await Broken.create({
      creation_timestamp: new Date(Date.now()),
      broken_start_timestamp: new Date(req.body.brokenTimeStart),
      seats: req.body.seats
    });

    res.send("Broken Computer(s) successfully added");
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
        req.params.id,
        {
            creation_timestamp: new Date(Date.now()),
            broken_start_timestamp: new Date(req.body.brokenTimeStart),
            seats: req.body.seats
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
    await Broken.findByIdAndDelete( req.params.id );

    res.send("Broken Computer(s) successfully deleted");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
}