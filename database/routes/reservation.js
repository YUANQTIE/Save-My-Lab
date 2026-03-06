const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation.js'); // Import Reservation model

// GET ROUTES 

// POST ROUTES

/* 
    Purpose: Add Reservation
    Description: Adds a "Reservation" document to the collection
*/

// PUT ROUTES

/* 
    Purpose: Edit Computer Reservation
    Description: Edit any of the details in the document (set creation to now)
*/

//make a checker also to ensure the reservation can be made first

// DELETE ROUTES

/* 
    Purpose: When reservation is finished or deleted by admin. when time passes by 10
    Description: Remove a document from reservation collection
*/

module.exports = router;