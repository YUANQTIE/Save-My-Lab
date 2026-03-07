const express = require('express');
const router = express.Router();
const Broken = require('../models/Broken.js'); // Import Broken model

// GET ROUTES

/* 
    Purpose: General Use
    Description: Get all the fields in the collection
*/

/* 
    Purpose: Filtering broken computers (admin view)
    optional room, building, timestart & timeend)
*/



// POST ROUTES

/* 
    Purpose: Broken Computer Adding
    Description: Adds a "broken" document to the collection
    Returns: seat_names (str in JSON format), room_name (str in JSON format)
*/

// PUT ROUTES

/* 
    Purpose: Edit Computer Status
    Description: Edit details any of the details in the document (set creation to now)
*/

// DELETE ROUTES

/* 
    Purpose: When all the computers in a "broken" document are fixed na 
    Description: Remove a document from broken collection
*/


module.exports = router;