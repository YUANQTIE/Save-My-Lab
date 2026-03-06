const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    date_created: { type: Date, required: true },
    password: { type: String, required: true },
});

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin