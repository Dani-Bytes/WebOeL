require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const feedbackRoutes = require('./routes/feedback');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', feedbackRoutes);

// Health check
app.get('/', (req, res) => res.json({ message: 'Feedback API running' }));

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/feedbackdb';

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    });
