const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    creation_timestamp: { type: Date, required: true },
    reservation_start_timestamp: { type: Date, required: true },
    reservation_end_timestamp: { type: Date, required: true },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true
    },

    seats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seat"
    }],

    checked_in: { type: Boolean, default: false }
});

const Reservation = mongoose.model("Reservation", ReservationSchema);

module.exports = Reservation