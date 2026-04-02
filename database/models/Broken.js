const mongoose = require('mongoose');

const BrokenSchema = new mongoose.Schema({
    seats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seat"
    }],
    broken_start_timestamp: { type: Date, required: true },
    reason: { type: String, required: true }
});

const Broken = mongoose.model("Broken", BrokenSchema);

module.exports = Broken