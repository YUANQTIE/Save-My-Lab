const express = require('express');
const Admin = require('../models/Admin.js'); // Import Admin model
const User = require('../models/User.js'); // Import Admin model
const bcrypt = require('bcrypt')
const saltCount = 10;


// GET ROUTES 

// pls use the user route for search also its applicable din naman

/* Purpose: General use
  Description: Gets all of the admins and their records
  RETURNS ALL Fields*/

  //Get Profile of User
exports.getIdGivenEmail = async (req, res) => {
  try {
    const email = req.query.email;
    const admin = await Admin.findOne({ email }).select("_id");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
};

exports.showAdmin = async(req, res) => {
  try {
    const adminData = await Admin.findById(req.query.id).lean();
    res.render('lab/see-reservations', {
      admin: adminData, 
      isAdmin: true 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
}

// Do the same for showEditComputerStatus and showAddReservation

// Get and Render Profile of User for Profile Settings
exports.showEditComputerStatus = async(req, res) => {
  try {
    const adminData = await Admin.findById(req.query.id).lean();
    res.render('lab/edit-computer-status', {admin: adminData, isAdmin: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
}

// Get and Render Profile of User for Account Security
exports.showAddReservation = async(req, res) => {
  try {
    const adminData = await Admin.findById(req.query.id).lean();
    res.render('lab/add-reservation', {admin: adminData, isAdmin: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
}


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
    const { emailInput, passwordInput, rememberMe } = req.body;
    const admin = await Admin.findOne({ email: emailInput });

    console.log(emailInput, passwordInput, rememberMe)

    if (!admin){
      return res.json(false);
    }

    const match = await bcrypt.compare(passwordInput, admin.password)

    if (match) {
      req.session.adminId = admin._id
      await admin.save();

      if (rememberMe === true) {
        req.session.cookie.maxAge = 21 * 24 * 60 * 60 * 1000;
      } else {
        req.session.cookie.expires = false;
        req.session.cookie.maxAge = null;
      }

      return res.json(true);
    }
    res.json(false);
  } catch (err) {
    res.status(500).send('Error');
  }
};

exports.adminLogout = async (req, res) => {
  try {
    req.session.destroy(err => {
      if (err) {
          console.error("Session destroy error:", err);
          return res.status(500).send("Could not log out");
      }
      res.clearCookie("connect.sid"); 
      res.redirect("/"); 
    });
  } catch (err) {
    res.status(500).send('Error');
  }
};

exports.isAdminEmailInDB = async (req, res) => {
  try {
    const email = req.query.email;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.json(false);
    }

    return res.json(true);

  } catch (err) {
    console.error(err.message);
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
    const hashedPassword = await bcrypt.hash(req.body.password, saltCount);

    const admin = await Admin.create({
      email: req.body.email,
      date_created: new Date(Date.now()),
      password: hashedPassword,
    });

    res.send("Admin added successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
};

// PUT

exports.editPassword = async (req, res) => {
  try {
    const id = req.query.originalId
    const containsWhitespace = str => /\s/.test(str);

    const admin = await Admin.findById(id);

    if (!admin){
      return res.send("No admin found");
    }

    const pw = req.body.password;

    const hashedPassword = await bcrypt.hash(pw, saltCount);
    // if (pw.length < 8) {
    //   return res.send("Password must have minimum 8 characters")
    // }
    // if (containsWhitespace(pw)) {
    //   return res.send("Password must not have whitespaces")
    // }
    // if (pw === user.password) {
    //   return res.send("Password must not be the same from previous password.")
    // }

    await Admin.findByIdAndUpdate(id, { password: hashedPassword });

    return res.send("Admin password updated successfully");

  } catch (err) {
    res.status(500).send("Error");
  }
};
