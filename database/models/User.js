const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    bio: {type: String, default: ""},
    profile_picture: { type: String, required: true, default: "/images/blank_picture.png" },
    date_created: {type: Date, required: true},
    password: {type: String, required: true},
    last_login: {type: Number, required: true, default : 0}
})

const User = mongoose.model('User', UserSchema);

module.exports = User