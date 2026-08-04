// backend/routes/companyRoutes.js
const express = require('express');
const router = express.Router();
const { getAllCompanies, getCompanyById, createCompany, updateCompany, getCompanyJobs } = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAllCompanies);
router.get('/:id', getCompanyById);
router.get('/:id/jobs', getCompanyJobs);
router.post('/', protect, authorize('employer'), createCompany);
router.put('/:id', protect, authorize('employer', 'admin'), updateCompany);

module.exports = router;
