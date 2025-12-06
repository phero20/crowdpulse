const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    organization: { type: String },
    areaLoginKey: { type: String },
    role: { type: String, default: 'user' }, // user, admin
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
