const express = require('express');
const router = express.Router();
const SystemLog = require('../models/SystemLog');

// @route   GET api/logs
// @desc    Get recent logs
// @access  Public
router.get('/', async (req, res) => {
    try {
        const logs = await SystemLog.find().sort({ timestamp: -1 }).limit(100);
        res.json(logs);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/logs
// @desc    Add a log entry
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { type, message, metadata } = req.body;
        const newLog = new SystemLog({
            type,
            message,
            metadata
        });
        const log = await newLog.save();
        res.json(log);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
