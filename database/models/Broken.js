const mongoose = require('mongoose');

const BrokenSchema = new mongoose.Schema({
    creation_timestamp: { type: Date, required: true },
    broken_start_timestamp: { type: Date, required: true },

    seats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seat"
    }],

});

const Broken = mongoose.model("Broken", BrokenSchema);

module.exports = Broken