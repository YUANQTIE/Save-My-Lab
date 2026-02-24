const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true
    },
    seat_number: { type: String, required: true },
});

const Seat = mongoose.model("Seat", SeatSchema);

module.exports = Seat