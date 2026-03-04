const express = require('express');
const router = express.Router();
const Room = require('../models/Room.js'); // Import Room model

// GET ROUTES

/* 
    Purpose: General Use
    Description: Get all the fields in the collection
*/

/*
    Purpose: Filter
    Description: Get all the rooms within a building
 */
/*    
    Purpose: Information Display 
    Description: Get all of the seat_ids within a room
*/

/* 
    Purpose: Information Display 
    Description: Get all of the seat_ids that are available within a room given two timestamps
*/

/* 
    Purpose: Information Display (Auxiliary)
    Description: Get the count of available seats within a room given two timestamps
*/

/* 
    Purpose: Information Display 
    Description: Get all of the seat_ids that are available within a building given two timestamps
*/

/* 
    Purpose: Information Display (Auxiliary)
    Description: Get the count of available seats within a building given two timestamps
*/

/* 
    Purpose: Information Display 
    Description: Get all of the seat_ids that are available within the entire system given two timestamps
*/

/* 
    Purpose: Information Display (Auxiliary)
    Description: Get the count of available seats within the entire system given two timestamps
*/





module.exports = router;