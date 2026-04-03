const express = require('express');
const path = require("path");
const router = express.Router();

const NotificationController = require("../controllers/NotificationController");

//GET ROUTES

router.get('/notifs-user', NotificationController.getNotificationsOfUser);

router.get('/notifs-admin', NotificationController.getNotificationsOfAdmin);

router.post('/add', NotificationController.addNotification);

router.put('/:notifId/read', NotificationController.readNotification);



module.exports = router