// backend/routes/applicationRoutes.js
const express = require('express');
const router = express.Router();
const { applyForJob, getMyApplications, getJobApplications, updateApplicationStatus, withdrawApplication } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/:jobId/apply', protect, authorize('seeker'), applyForJob);
router.get('/my', protect, authorize('seeker'), getMyApplications);
router.get('/job/:jobId', protect, authorize('employer', 'admin'), getJobApplications);
router.put('/:id/status', protect, authorize('employer', 'admin'), updateApplicationStatus);
router.delete('/:id', protect, authorize('seeker'), withdrawApplication);

module.exports = router;
