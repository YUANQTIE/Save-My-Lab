const express = require('express');
const router = express.Router();
const User = require('../models/User.js'); // Import User model

// GET ROUTES 

/*
  Purpose: Search For Users
  Description: Given inputs of characters, this will continuously update the search bar 
  Input: Username
 */

/*
  Purpose: Search For Users:
  Description: Gets Username, Bio, Profile Picture, and list of reservations of a user given the clicked id sa search bar
 */

/* Purpose: General use
  Description: Gets all of the users and their records (no particular arrangement)
  RETURNS ALL Fields*/

router.get('/all', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
});

// Purpose: Dashboard use
// Description: Gets the number of users currently in the system
// Returns COUNT of users

router.get('/count', async (req, res) => {
  try {
    const noOfUsers = await User.countDocuments({})
    res.json(noOfUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
});

// Purpose: Reservation Display
// Description: Gets the list of reservations of a user arranged by starting timestamp (ascending)

router.get('/reservations-date-ascending/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate({
        path: "reservations",
        options: { sort: { reservation_start_timestamp: 1 } }
      });
    
    res.json(user.reservations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
});

// Purpose: Reservation Display
// Description: Gets the list of reservations of a user arranged by starting timestamp (descending)

router.get('/reservations-date-descending/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate({
        path: "reservations",
        options: { sort: { reservation_start_timestamp: -1 } }
      });
    
    res.json(user.reservations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
});

// Purpose: Reservation Display
// Description: Gets the list of reservations of a user arranged by creation timestamp (ascending)

router.get('/creation-date-ascending/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate({
        path: "reservations",
        options: { sort: { reservation_start_timestamp: 1 } }
      });
    
    res.json(user.reservations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
});

// Purpose: Reservation Display
// Description: Gets the list of reservations of a user arranged by creation timestamp (descending)

router.get('/creation-date-descending/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate({
        path: "reservations",
        options: { sort: { reservation_start_timestamp: -1 } }
      });
    
    res.json(user.reservations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
});

// Purpose: Login Verification
// Description: Gets the users whose last login date was 21 days ago
// Returns Fields: ID

router.get('/login-validity', async (req, res) => {
  try {
    const Week3Users = await User.find(
      { last_login : { $gte : 21 }}
    ).select("_id");
    res.json(Week3Users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
});

/* Purpose: Login Verification
   Description: Checks if inputted email has this inputted password in User collection
   Accepts: emailInput (str), passwordInput (str)
   Returns Fields: true if yes, false if no
*/
router.get('/user/:emailInput/:passwordInput', async (req, res) => {
  try {
    const { emailInput, passwordInput } = req.params;
    const user = await User.findOne({
      email: emailInput,
      password: passwordInput
    });
    const isValid = user ? true : false;
    res.json(isValid);
  } catch (err) {
    res.status(500).send('Error');
  }
});

// PUT ROUTES 

/*Purpose: Profile Personalization
  Description: Updates the bio of the user
  Accepts: id (mongoDB id), bio (str: from fetch api)
*/

router.put('/bio/:id', async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.params.id,
      { bio: req.body.bio }
    );

    res.send("User bio updated successfully");
  } catch (err) {
    res.status(500).send("Error");
  }
});


/*Purpose: Profile Personalization
  Description: Updates the profile picture of the user to a given profile picture
  Accepts: id (mongoDB id), profile_picture (req from fetch api)\
  // SHOULD ALSO DELETE THE PROFILE PIC FROM THE DIRECTORY IF THERE IS ONE
*/

router.put("/profile-picture/:id", async (req, res) => {
  try {
    const file = req.files.profile_picture;

    const fileName = `${req.params.id}.jpg`;
    const savePath = `public/profile_pictures/${fileName}`;

    await file.mv(savePath);

    await User.findByIdAndUpdate(req.params.id, {
      profile_picture: `public/profile_pictures/${fileName}`
    });

    res.send("Profile picture updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

/*Purpose: Profile Personalization
  Description: Updates the profile picture of the user to the default
  Accepts: id (mongoDB id)
*/

router.put("/profile-picture-default/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.params.id,
      { profile_picture: "/images/blank_picture.png" }
    );

    res.send("Profile picture updated successfully");
  } catch (err) {
    res.status(500).send("Error");
  }
});

/*Purpose: Profile Personalization
  Description: Updates the username of the user
  Accepts: id (mongoDB id), username (str: from fetch api (JSON))
*/

router.put('/username/:id', async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.params.id,
      { username: req.body.username }
    );

    res.send("User bio updated successfully");
  } catch (err) {
    res.status(500).send("Error");
  }
});

/*Purpose: Forgot Password
  Description: Updates the password of the user
  Accepts: id (mongoDB id), password (str: from fetch api (JSON))
*/

router.put('/forgot-password', async (req, res) => {
  try {
    const found = await User.findOne(
      { email: req.body.email }
    );

    if (!found) {
      return res.status(404).send("User not found");
    }

    const id = found._id

    await User.findByIdAndUpdate(id,
      { password: req.body.password });
    res.send("User password updated successfully");
  } catch (err) {
    res.status(500).send("Error");
  }
});


// POST ROUTES

// Purpose: Register (User)
// Description: Adds a user 
// Accepts: email (str), username (str), bio (str), password(str), profile_picture (file)

router.post("/add-user", async (req, res) => {
  try {
    const file = req.files.profile_picture;

    const user = await User.create({
      email: req.body.email,
      username: req.body.username,
      bio: req.body.bio,
      date_created: new Date(Date.now()),
      password: req.body.password,
      last_login: 0
    });

    const id = user._id

    const fileName = `${id}.jpg`;
    const savePath = `public/profile_pictures/${fileName}`;

    await file.mv(savePath);

    await User.find(req.params.id, {
      profile_picture: `public/profile_pictures/${fileName}`
    });

    res.send("User added successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

// DELETE ROUTES

// Purpose: Account deletion
// Description: Deletes the user account logged in from the users collection
// SHOULD ALSO DELETE THE PROFILE PIC FROM THE DIRECTORY IF THERE IS ONE

router.delete("/delete-user/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.send("User deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});
                         

module.exports = router;