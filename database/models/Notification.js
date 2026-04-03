const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({

    reservationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reservation"
    },

    brokenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Broken"
    },

    isRead : { type: Boolean, required: true, default : false},
});

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification