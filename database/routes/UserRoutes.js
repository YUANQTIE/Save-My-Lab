const express = require('express');
const app = express();
const path = require("path");
const router = express.Router();
const exphbs = require('express-handlebars')


const UserController = require('../controllers/UserController');
app.set('views', path.join(__dirname, 'views'));
app.engine("hbs", exphbs.engine({extname: 'hbs'}))
app.engine("hbs", exphbs.engine({defaultLayout: 'main', partialsDir: __dirname + 'views/partials/'}))
app.set('view engine','hbs');
app.set("views", "./views")

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

//checks if user can log in
//req.params: emailInput, passwordInput
//res.json: true/false
router.get('/forgot', UserController.getIdGivenEmail);

router.get('/emailCheck', UserController.isUserEmailInDB)

router.get('/idNumberCheck', UserController.isUserIdNumberInDB)

router.get('/usernameCheck', UserController.isUsernameInDB)

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

//req.body: password
router.put('/edit/password/:id', UserController.editPassword);

//DELETE ROUTES
//req.params: id
router.delete("/:id/delete", UserController.deleteUser);


router.get("/landing", (req, res) => {
    res.render('user/homepage2', {id: req.query.id})
});

router.get("/profile-settings", UserController.showProfile);
router.get("/account-security", UserController.showProfileAccountSecurity);
router.get("/reservations", UserController.showProfileReservations);
router.get("/student-add-reservation", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "views", "user", "student-add-reservation.html"));
});


module.exports = router