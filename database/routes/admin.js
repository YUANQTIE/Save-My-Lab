const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin.js'); // Import Admin model

// GET ROUTES 

// pls use the user route for search also its applicable din naman

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

/* Purpose: Profile Use
  Description: Gets the field values of a specific value
  RETURNS ALL Fields*/

router.get('/details/:id', async (req, res) => {
  try {
    const admins = await Admin.findById(req.params.id);
    res.json(admins);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
});

/* Purpose: Login Verification
   Description: Checks if inputted email has this inputted password in Admin collection
   Accepts: emailInput (str), passwordInput (str)
   Returns Fields: true if yes, false if no
*/

router.get('/login/:emailInput/:passwordInput', async (req, res) => {
  try {
    const { emailInput, passwordInput } = req.params;
    const admin = await Admin.findOne({
      email: emailInput,
      password: passwordInput
    });
    const isValid = admin ? true : false;
    res.json(isValid);
  } catch (err) {
    res.status(500).send('Error');
  }
});

// POST

// Purpose: Register (Admin)
// Description: Adds an admin account
// Accepts: email (str), password(str)

router.post("/add-admin", async (req, res) => {
  try {
    const user = await Admin.create({
      email: req.body.email,
      date_created: new Date(Date.now()),
      password: req.body.password,
    });

    res.send("Admin added successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

// DELETE
// no delete


module.exports = router;