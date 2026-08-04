// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, uploadResume, getDashboardStats } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/resume', protect, uploadResume);
router.get('/dashboard', protect, getDashboardStats);

module.exports = router;
