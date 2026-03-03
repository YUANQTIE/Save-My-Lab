const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin.js'); // Import Admin model

// GET ROUTES 

/* Purpose: General use
  Description: Gets all of the admins and their records
  RETURNS ALL Fields*/

router.get('/all', async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
});

module.exports = router;