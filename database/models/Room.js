const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  room_name: { type: String, required: true, unique: true },
  building: { type: String, required: true },
  capacity: { type: Number, required: true },
  display_image: { type: String, required: true, default: "" },
  layout_image: { type: String, required: true },
  seats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seat",
    required: true
  }]
});

const Room = mongoose.model("Room", RoomSchema);

module.exports = Room