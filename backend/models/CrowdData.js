const mongoose = require('mongoose');

const CrowdDataSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    peopleCount: { type: Number, required: true },
    avgSpeed: { type: Number, default: 0 },
    stressLevel: { type: Number, default: 0 },
    status: { type: String, default: 'NORMAL' }, // NORMAL, WARNING, CRITICAL, IDLE
    camera: { type: String, default: 'CAM-01' }
});

module.exports = mongoose.model('CrowdData', CrowdDataSchema);
