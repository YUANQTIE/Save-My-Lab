const express = require('express');
const router = express.Router();
const Broken = require('../models/Broken.js'); // Import Broken model

// GET ROUTES

/* 
    Purpose: General Use
    Description: Get all the fields in the collection
*/

/* 
    Purpose: Information Display (For hovering over a blue computer)
    Description: Get the seat_name, broken_date of a broken computer
    Returns: seat_names (str in JSON format), room_name (str in JSON format)
*/

/*    
    Purpose: Information Display 
    Description: Get all of the seat_ids within a room
*/

/* 
    Purpose: Information Display 
    Description: Get all of the seat_ids that are broken within a room given two timestamps
*/

/* 
    Purpose: Information Display (Auxiliary)
    Description: Get the count of broken seats within a room given two timestamps
*/

/* 
    Purpose: Information Display 
    Description: Get all of the seat_ids that are broken within a building given two timestamps
*/

/* 
    Purpose: Information Display (Auxiliary)
    Description: Get the count of broken seats within a building given two timestamps
*/

/* 
    Purpose: Information Display 
    Description: Get all of the seat_ids that are broken within the entire system given two timestamps
*/

/* 
    Purpose: Information Display (Auxiliary)
    Description: Get the count of broken seats within the entire system given two timestamps
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