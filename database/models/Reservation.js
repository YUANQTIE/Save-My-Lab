const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    creation_timestamp: { type: Date, required: true },
    reservation_start_timestamp: { type: Date, required: true },
    reservation_end_timestamp: { type: Date, required: true },

    reservedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "reservedByModel"
    },
    
    reservedByModel: {
        type: String,
        enum: ["User", "Admin"]
    },

    seats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seat"
    }],

    anonymous: { type: Boolean, default: false },

    isCancelled: { type: Boolean, default : false },
});

const Reservation = mongoose.model("Reservation", ReservationSchema);

module.exports = Reservation