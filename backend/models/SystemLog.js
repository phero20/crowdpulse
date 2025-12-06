const mongoose = require('mongoose');

const SystemLogSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    type: { type: String, enum: ['info', 'success', 'warning', 'error'], required: true },
    message: { type: String, required: true },
    metadata: { type: Object } // Optional extra details
});

module.exports = mongoose.model('SystemLog', SystemLogSchema);
