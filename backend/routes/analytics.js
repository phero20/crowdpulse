const express = require('express');
const router = express.Router();
const CrowdData = require('../models/CrowdData');

// @route   GET api/analytics/history
// @desc    Get recent crowd data for charts
// @access  Public
router.get('/history', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        // Get latest N records
        const data = await CrowdData.find().sort({ timestamp: -1 }).limit(limit);
        // Return combined/formatted if needed, or just raw list
        // Reversing to make it chronological (oldest -> newest) for charts
        res.json(data.reverse());
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/analytics
// @desc    Save crowd data snapshot
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { peopleCount, avgSpeed, stressLevel, status, camera } = req.body;
        const newData = new CrowdData({
            peopleCount,
            avgSpeed,
            stressLevel,
            status,
            camera
        });
        const saved = await newData.save();
        res.json(saved);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
