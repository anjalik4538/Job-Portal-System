// backend/controllers/jobController.js
const db = require('../config/database');

// @desc    Get all jobs with filters
// @route   GET /api/jobs
exports.getAllJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, location, experience } = req.query;
    const offset = (page - 1) * limit;

    let query = `SELECT j.*, c.name as company_name, c.logo as company_logo, c.location as company_location
                 FROM jobs j JOIN companies c ON j.company_id = c.id WHERE j.status = 'active'`;
    const params = [];

    if (type) { query += ' AND j.job_type = ?'; params.push(type); }
    if (location) { query += ' AND j.location LIKE ?'; params.push(`%${location}%`); }
    if (experience) { query += ' AND j.experience_required <= ?'; params.push(experience); }

    query += ' ORDER BY j.created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [jobs] = await db.query(query, params);
    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM jobs WHERE status = "active"');

    res.json({ success: true, data: jobs, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Search jobs
// @route   GET /api/jobs/search
exports.searchJobs = async (req, res) => {
  try {
    const { q, location, type, salary_min } = req.query;
    let query = `SELECT j.*, c.name as company_name, c.logo as company_logo
                 FROM jobs j JOIN companies c ON j.company_id = c.id WHERE j.status = 'active'`;
    const params = [];

    if (q) { query += ' AND (j.title LIKE ? OR j.description LIKE ?)'; params.push(`%${q}%`, `%${q}%`); }
    if (location) { query += ' AND j.location LIKE ?'; params.push(`%${location}%`); }
    if (type) { query += ' AND j.job_type = ?'; params.push(type); }
    if (salary_min) { query += ' AND j.salary_min >= ?'; params.push(salary_min); }

    query += ' ORDER BY j.created_at DESC LIMIT 20';
    const [jobs] = await db.query(query, params);
    res.json({ success: true, data: jobs, count: jobs.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
exports.getJobById = async (req, res) => {
  try {
    await db.query('UPDATE jobs SET views_count = views_count + 1 WHERE id = ?', [req.params.id]);
    const [jobs] = await db.query(
      `SELECT j.*, c.name as company_name, c.logo as company_logo, c.description as company_desc, c.website, c.industry, c.size
       FROM jobs j JOIN companies c ON j.company_id = c.id WHERE j.id = ?`, [req.params.id]
    );
    if (jobs.length === 0) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, data: jobs[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create job
// @route   POST /api/jobs
exports.createJob = async (req, res) => {
  try {
    const { company_id, title, description, requirements, responsibilities, job_type, location, salary_min, salary_max, skills_required, experience_required, application_deadline } = req.body;
    const [result] = await db.query(
      'INSERT INTO jobs (company_id, title, description, requirements, responsibilities, job_type, location, salary_min, salary_max, skills_required, experience_required, application_deadline) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [company_id, title, description, requirements, responsibilities, job_type, location, salary_min, salary_max, JSON.stringify(skills_required), experience_required, application_deadline]
    );
    res.status(201).json({ success: true, message: 'Job created successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update job
exports.updateJob = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    await db.query('UPDATE jobs SET title = ?, description = ?, status = ?, updated_at = NOW() WHERE id = ?', [title, description, status, req.params.id]);
    res.json({ success: true, message: 'Job updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete job
exports.deleteJob = async (req, res) => {
  try {
    await db.query('DELETE FROM jobs WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save/unsave job
exports.saveJob = async (req, res) => {
  try {
    const [existing] = await db.query('SELECT id FROM saved_jobs WHERE user_id = ? AND job_id = ?', [req.user.id, req.params.id]);
    if (existing.length > 0) {
      await db.query('DELETE FROM saved_jobs WHERE user_id = ? AND job_id = ?', [req.user.id, req.params.id]);
      return res.json({ success: true, saved: false, message: 'Job removed from saved' });
    }
    await db.query('INSERT INTO saved_jobs (user_id, job_id) VALUES (?, ?)', [req.user.id, req.params.id]);
    res.json({ success: true, saved: true, message: 'Job saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get saved jobs
exports.getSavedJobs = async (req, res) => {
  try {
    const [jobs] = await db.query(
      `SELECT j.*, c.name as company_name, c.logo as company_logo, sj.saved_at
       FROM saved_jobs sj JOIN jobs j ON sj.job_id = j.id JOIN companies c ON j.company_id = c.id
       WHERE sj.user_id = ? ORDER BY sj.saved_at DESC`, [req.user.id]
    );
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
