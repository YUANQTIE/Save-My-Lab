const express = require('express');
const path = require("path");
const router = express.Router();

router.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "views", "default", "register.html"));
});

router.get("/forgot", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "views", "default", "forgot.html"));
});

router.get("/vsa", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "views", "default", "view-slot-availability.html"));
});


module.exports = router