const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');

//GET ROUTES

//this is for yung recommended usernames sa search bar
//req.query: username
//res.json: _id, email, username, bio, date_created, password, profile_picture, last_login, id_number
router.get('/search', UserController.getRecommendedUsers);

//this is for getting the info of a user sa search bar
//req.params: id
//res.json: _id, email, username, bio, date_created, password, profile_picture, last_login, id_number
router.get('/search/:id', UserController.getUserById);

//gets all users
//res.json: _id, email, username, bio, date_created, password, profile_picture, last_login, id_number
router.get('/users', UserController.getAllUsers);

//gets all the users na lumagpas ng 21 days
//res.json: _id, email, username, bio, date_created, password, profile_picture
router.get('/login-validity', UserController.get21DaysUsers);

//checks if user can log in
//req.params: emailInput, passwordInput
//res.json: true/false
router.get('/:emailInput/:passwordInput', UserController.isUserValid);

//POST ROUTES
//req.files: profile_picture
//req.body: email, username, bio, password, id_number
router.post("/add", UserController.addUser);

//PUT ROUTES

//req.params: id
//req.body: bio
router.put('/:id/edit/bio', UserController.editBiography);

//req.params: id
//req.files: profile_picture
router.put("/:id/edit/profile-picture", UserController.editProfilePicture);

//req.params: id
router.put("/:id/edit/profile-picture-default", UserController.removeProfilePicture);

//req.params: id
//req.body: username
router.put('/:id/edit/username', UserController.editUsername);

//req.body: email, password
router.put('/edit/password', UserController.editPassword);

//DELETE ROUTES
//req.params: id
router.delete("/:id/delete", UserController.deleteUser);

module.exports = router