const express = require('express');
const path = require('path');
const fs = require('fs');
const User = require('../models/User.js'); // Import User model

// GET ROUTES 

exports.isUsernameInDB = async (req, res) => {
  try {
    const username = req.query.username;
    const user = await User.findOne({ username });

    if (!user) {
      return res.json(false);
    }

    return res.json(true);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
};

exports.isUserEmailInDB = async (req, res) => {
  try {
    const email = req.query.email;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json(false);
    }

    return res.json(true);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
};

exports.isUserIdNumberInDB = async (req, res) => {
  try {
    const id_number = Number(req.query.idNumber);
    const user = await User.findOne({ id_number });


    if (!user) {
      return res.json(false);
    }

    return res.json(true);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
};

exports.showUserSearched = async (req, res) => {
  try {
    const userData = await User.findById(req.query.id).lean();
    res.render('user/view-other-user-profile', { user: userData });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
}

// Get and Render Profile of User for Profile Settings
exports.showProfile = async (req, res) => {
  try {
    const userData = await User.findById(req.query.originalId).lean();
    res.render('user/profile-settings', { user: userData });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
}

// Get and Render Profile of User for Account Security
exports.showProfileAccountSecurity = async (req, res) => {
  try {
    const userData = await User.findById(req.query.originalId).lean();
    res.render('user/account-security', { user: userData });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
}

// Get and Render Profile of User for Reservations
exports.showProfileReservations = async (req, res) => {
  try {
    const userData = await User.findById(req.query.originalId).lean();
    res.render('user/account-reservations', { user: userData });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
}

exports.addReservation = async (req, res) => {
  try {
    const userData = await User.findById(req.query.originalId).lean();
    console.log(userData)
    res.render('user/student-add-reservation', { user: userData });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
}

//Get Profile of User
exports.getIdGivenEmail = async (req, res) => {
  try {
    const email = req.query.email;
    const user = await User.findOne({ email }).select("_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
};

/*
  Purpose: Search For Users
  Description: Given inputs of characters, this will continuously update the search bar 
  Input: Username
 */

exports.getRecommendedUsers = async (req, res) => {
  try {
    const usernameSearched = req.query.username;

    const users = await User.find({
      username: { $regex: usernameSearched, $options: 'i'}
    });

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
};

/*
  Purpose: Search For Users:
  Description: Gets Username, Bio, Profile Picture, and list of reservations of a user given the clicked id sa search bar
 */

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
};

/* Purpose: General use
  Description: Gets all of the users and their records (no particular arrangement)
  RETURNS ALL Fields*/

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
};


// Purpose: Login Verification
// Description: Gets the users whose last login date was 21 days ago
// Returns Fields: ID

exports.get21DaysUsers = async (req, res) => {
  try {
    const Week3Users = await User.find(
      { last_login: { $gte: 21 } }
    ).select("_id");
    res.json(Week3Users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
};

/* Purpose: Login Verification
   Description: Checks if inputted email has this inputted password in User collection
   Accepts: emailInput (str), passwordInput (str)
   Returns Fields: true if yes, false if no
*/
exports.isUserValid = async (req, res) => {
  try {
    const { emailInput, passwordInput } = req.params;
    const user = await User.findOne({
      email: emailInput,
      password: passwordInput
    });
    console.log("DB RESULT:", user);
    if (user) {
      user.last_login = new Date();
      await user.save();
      return res.json(true);
    }
    res.json(false);
  } catch (err) {
    res.status(500).send('Error');
  }
};

// PUT ROUTES 

/*Purpose: Profile Personalization
  Description: Updates the bio of the user
  Accepts: id (mongoDB id), bio (str: from fetch api)
*/

exports.editBiography = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.params.id,
      { bio: req.body.bio }
    );

    res.send("User bio updated successfully");
  } catch (err) {
    res.status(500).send("Error");
  }
};


/*Purpose: Profile Personalization
  Description: Updates the profile picture of the user to a given profile picture
  Accepts: id (mongoDB id), profile_picture (req from fetch api)\
  // SHOULD ALSO DELETE THE PROFILE PIC FROM THE DIRECTORY IF THERE IS ONE
*/

exports.editProfilePicture = async (req, res) => {
  try {
    if (!req.files || !req.files.profile_picture) {
      return res.status(400).send("No file was uploaded. Check your field name.");
    }

    const file = req.files.profile_picture;

    const fileName = `${req.params.id}.jpg`;
    const uploadDir = path.join(__dirname, '..', '..', 'public', 'profile_pictures');
    console.log("FULL SYSTEM PATH:", uploadDir);
    const savePath = path.join(uploadDir, fileName);
    console.log(file)
    await file.mv(savePath);

    await User.findByIdAndUpdate(req.params.id, {
      profile_picture: `/profile_pictures/${fileName}`
    });
    return res.status(200).json({ message: "Profile picture updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};

/*Purpose: Profile Personalization
  Description: Updates the profile picture of the user to the default
  Accepts: id (mongoDB id)
*/

exports.removeProfilePicture = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.params.id,
      { profile_picture: "/images/blank_picture.png" }
    );

    res.send("Profile picture updated successfully");
  } catch (err) {
    res.status(500).send("Error");
  }
};

/*Purpose: Profile Personalization
  Description: Updates the username of the user
  Accepts: id (mongoDB id), username (str: from fetch api (JSON))
*/

exports.editUsername = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.params.id,
      { username: req.body.username }
    );

    res.send("User bio updated successfully");
  } catch (err) {
    res.status(500).send("Error");
  }
};

/*Purpose: Forgot Password
  Description: Updates the password of the user
  Accepts: id (mongoDB id), password (str: from fetch api (JSON))
*/

exports.editPassword = async (req, res) => {
  try {
    console.log("im here")
    const id = req.query.originalId
    const containsWhitespace = str => /\s/.test(str);

    const user = await User.findById(id);

    const pw = req.body.password;
    // if (pw.length < 8) {
    //   return res.send("Password must have minimum 8 characters")
    // }
    // if (containsWhitespace(pw)) {
    //   return res.send("Password must not have whitespaces")
    // }
    // if (pw === user.password) {
    //   return res.send("Password must not be the same from previous password.")
    // }

    await User.findByIdAndUpdate(id,
      { password: pw });
    res.send("User password updated successfully");



  } catch (err) {
    res.status(500).send("Error");
  }
};


// POST ROUTES

// Purpose: Register (User)
// Description: Adds a user 
// Accepts: email (str), username (str), bio (str), password(str), profile_picture (file)

exports.addUser = async (req, res) => {
  try {
    const { email, username, bio, password, id_number } = req.body;

    const user = await User.create({
      email,
      username,
      bio,
      date_created: new Date(),
      password,
      id_number
    });

    if (req.files && req.files.profile_picture) {
      const file = req.files.profile_picture;
      const fileName = `${user._id}.jpg`;
      const savePath = `./public/images/${fileName}`;

      await file.mv(savePath);

      user.profile_picture = `/images/${fileName}`;
      await user.save();
    }

    res.status(201).send("User added successfully");

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).send("Username or Email already exists.");
    }
    console.error(err);
    res.status(500).send("Error saving user");
  }
};

// DELETE ROUTES

// Purpose: Account deletion
// Description: Deletes the user account logged in from the users collection
// SHOULD ALSO DELETE THE PROFILE PIC FROM THE DIRECTORY IF THERE IS ONE

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.send("User deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
};

