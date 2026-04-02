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

router.get('/forgot', AdminController.getIdGivenEmail);

router.get('/emailCheck', AdminController.isAdminEmailInDB)

//req.body: password
router.put('/edit/password', AdminController.editPassword);

router.get("/logout", AdminController.adminLogout);

//POST ROUTES

//checks if the admin logging in is valid
//req.body: "email", "password"
router.post('/add', AdminController.addAdmin);

//checks if the admin logging in is valid
//req.params: "emailInput", "passwordInput"
//res.json: true/false
router.post('/verify', AdminController.isAdminValid);

//PUT ROUTE

//req.body: password
router.put('/edit/password/:id', AdminController.editPassword);

router.get("/landing", (req, res) => {
    if (!req.session.adminId) {
        return res.redirect("/");
    }
    
    const adminId = req.session.adminId;
    res.render('lab/homepage', { id: adminId, isAdmin: true });
});

router.post("/edit-reservation", (req, res) => {
    req.session.resId = req.body.resId;

    console.log("Session set to:", req.session.resId);

    res.sendStatus(200);
});

router.get("/edit-reservation", (req, res) => {
    const adminId = req.session.adminId;

    res.render("lab/edit-reservation", {
        id: adminId,
        isAdmin: true
    });
});

router.get("/see-broken-computers", AdminController.showBrokenComputers);
router.get("/see-reservations", AdminController.showReservations);
router.get("/edit-computer-status", AdminController.showEditComputerStatus);
router.get("/add-reservation", AdminController.showAddReservation);

module.exports = router