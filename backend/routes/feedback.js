const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// POST /feedback - Submit new feedback
router.post('/feedback', async (req, res) => {
    try {
        const { studentName, subject, rating, comments } = req.body;
        const feedback = new Feedback({ studentName, subject, rating, comments });
        await feedback.save();
        res.status(201).json({ success: true, data: feedback });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({ success: false, errors: messages });
        }
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /feedbacks - Retrieve all feedbacks with optional pagination
router.get('/feedbacks', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await Feedback.countDocuments();
        const feedbacks = await Feedback.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            success: true,
            data: feedbacks,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit,
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /feedbacks/:subject - Retrieve feedbacks by subject with avg rating
router.get('/feedbacks/:subject', async (req, res) => {
    try {
        const subject = req.params.subject;
        const feedbacks = await Feedback.find({
            subject: { $regex: new RegExp(`^${subject}$`, 'i') },
        }).sort({ createdAt: -1 });

        // Compute average rating
        const avgRating =
            feedbacks.length > 0
                ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
                : 0;

        res.json({
            success: true,
            data: feedbacks,
            averageRating: parseFloat(avgRating.toFixed(2)),
            subject,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /subjects - Get all distinct subjects with average ratings
router.get('/subjects', async (req, res) => {
    try {
        const subjects = await Feedback.aggregate([
            {
                $group: {
                    _id: '$subject',
                    averageRating: { $avg: '$rating' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        res.json({ success: true, data: subjects });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
