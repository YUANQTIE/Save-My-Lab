const express = require('express');
const path = require("path");
const router = express.Router();

const AdminController = require("../controllers/AdminController");

//GET ROUTES

//gets all admins in the collection
//res.json: "_id", "email", "date_created", "password"
router.get('/admins', AdminController.getAllAdmins);

//gets all the field values in an id collection
//req.params: "id"
//res.json: "_id", "email", "date_created", "password"
router.get('/:id/info', AdminController.getAdminFields);

//gets all accounts of registered users (student and admin)
//res.json: "_id", "email"
router.get('/accounts', AdminController.getAllAccounts);

//checks if the admin logging in is valid
//req.params: "emailInput", "passwordInput"
//res.json: true/false
router.get('/verify/:emailInput/:passwordInput', AdminController.isAdminValid);

router.get('/forgot', AdminController.getIdGivenEmail);

//req.body: password
router.put('/edit/password', AdminController.editPassword);


//POST ROUTES

//checks if the admin logging in is valid
//req.body: "email", "password"
router.post('/add', AdminController.addAdmin);

//PUT ROUTE

//req.body: password
router.put('/edit/password/:id', AdminController.editPassword);

router.get("/landing", (req, res) => {
    res.render('lab/see-reservations', {id: req.query.id, isAdmin: true})
});

router.get("/edit-computer-status", AdminController.showEditComputerStatus);
router.get("/add-reservation", AdminController.showAddReservation);

module.exports = router