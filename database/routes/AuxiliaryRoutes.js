const express = require('express');
const path = require("path");
const router = express.Router();

router.get("/register-user", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "views", "default", "register-user.html"));
});

router.get("/forgot-user", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "views", "default", "forgot-user.html"));
});

router.get("/register-admin", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "views", "default", "register-admin.html"));
});

router.get("/forgot-admin", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "views", "default", "forgot-admin.html"));
});

router.get("/vsa", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "views", "default", "view-slot-availability.html"));
});


module.exports = router