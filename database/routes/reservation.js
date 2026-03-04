const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation.js'); // Import Reservation model

// GET ROUTES 
/* 
    Purpose: General Use
    Description: Get all the fields in the collection
*/

/*    
    Purpose: Information Display 
    Description: Get all of the reserved seat_ids
*/

/* 
    Purpose: Information Display 
    Description: Get all of the seat_ids that are reserved within a room given two timestamps
*/

/* 
    Purpose: Information Display (Auxiliary)
    Description: Get the count of reserved seats within a room given two timestamps
*/

/* 
    Purpose: Information Display 
    Description: Get all of the seat_ids that are reserved within a building given two timestamps
*/

/* 
    Purpose: Information Display (Auxiliary)
    Description: Get the count of reserved seats within a building given two timestamps
*/

/* 
    Purpose: Information Display 
    Description: Get all of the seat_ids that are reserved within the entire system given two timestamps
*/

/* 
    Purpose: Information Display (Auxiliary)
    Description: Get the count of reserved seats within the entire system given two timestamps
*/

/* 
    Purpose: Filters 
    Description: Get all of the fields of the reservations of a specific user id
*/

/* 
    Purpose: Filters
    Description: Get count of all the reservations of a specific user id
*/

/* 
    Purpose: Filters 
    Description: Get all of the fields of the reservations within two timestamps
*/

/* 
    Purpose: Filters
    Description: Get count of all the reservations within two timestamps
*/

/* 
    Purpose: Filters 
    Description: Get all of the fields of the reservations inside a room
*/

/* 
    Purpose: Filters
    Description: Get count of all the reservations within inside a room
*/

/* 
    Purpose: Filters 
    Description: Get all of the fields of the reservations inside a room within two timestamps
*/

/* 
    Purpose: Filters
    Description: Get count of all the reservations within inside a room within two timestamps
*/

/* 
    Purpose: Filters 
    Description: Get all of the fields of the reservations inside a room by an account
*/

/* 
    Purpose: Filters
    Description: Get count of all the reservations within inside a room by an account
*/

/* 
    Purpose: Filters 
    Description: Get all of the fields of the reservations inside a room by an account within two timestamps
*/

/* 
    Purpose: Filters
    Description: Get count of all the reservations within inside a room by an account within two timestamps
*/


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

// DELETE ROUTES

/* 
    Purpose: When reservation is finished or deleted by admin
    Description: Remove a document from reservation collection
*/

module.exports = router;