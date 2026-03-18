const express = require('express');
const Admin = require('../models/Admin.js'); // Import Admin model
const User = require('../models/User.js'); // Import Admin model

// GET ROUTES 

// pls use the user route for search also its applicable din naman

/* Purpose: General use
  Description: Gets all of the admins and their records
  RETURNS ALL Fields*/

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
};

/* Purpose: Profile Use
  Description: Gets the field values of a specific value
  RETURNS ALL Fields*/

exports.getAdminFields = async (req, res) => {
  try {
    const admins = await Admin.findById(req.params.id);
    res.json(admins);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
};

/* Purpose: Login Verification
   Description: Checks if inputted email has this inputted password in Admin collection
   Accepts: emailInput (str), passwordInput (str)
   Returns Fields: true if yes, false if no
*/

exports.isAdminValid =  async (req, res) => {
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
};

/*
  Gets all registered users, including students and admins.
*/

exports.getAllAccounts = async (req, res) => {
  try{
    const students = await User.find().select("email")
    const admins = await Admin.find().select("email")

    const allUsers = [...new Set([...students,...admins])]; //unionizes all of the accounts

    console.log(allUsers)

    res.json(allUsers)
  }
  catch (err){
    res.status(500).send('Error')
  }
};

// POST

// Purpose: Register (Admin)
// Description: Adds an admin account
// Accepts: email (str), password(str)

exports.addAdmin = async (req, res) => {
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
};
