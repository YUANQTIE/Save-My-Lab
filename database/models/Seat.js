const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema({
    room_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true
    },
    seat_name: { type: String, required: true },
});

const Seat = mongoose.model("Seat", SeatSchema);

module.exports = Seat