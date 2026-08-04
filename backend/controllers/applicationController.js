// backend/controllers/applicationController.js
const db = require('../config/database');

// @desc    Apply for a job
exports.applyForJob = async (req, res) => {
  try {
    const { cover_letter, resume_url } = req.body;
    const { jobId } = req.params;

    const [existing] = await db.query('SELECT id FROM applications WHERE job_id = ? AND seeker_id = ?', [jobId, req.user.id]);
    if (existing.length > 0) return res.status(400).json({ success: false, message: 'Already applied for this job' });

    const [result] = await db.query(
      'INSERT INTO applications (job_id, seeker_id, cover_letter, resume_url) VALUES (?, ?, ?, ?)',
      [jobId, req.user.id, cover_letter, resume_url]
    );

    // Notify employer
    const [jobs] = await db.query('SELECT c.employer_id, j.title FROM jobs j JOIN companies c ON j.company_id = c.id WHERE j.id = ?', [jobId]);
    if (jobs.length > 0) {
      await db.query(
        'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
        [jobs[0].employer_id, 'New Application', `New application received for ${jobs[0].title}`, 'application']
      );
    }

    res.status(201).json({ success: true, message: 'Application submitted successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my applications (seeker)
exports.getMyApplications = async (req, res) => {
  try {
    const [applications] = await db.query(
      `SELECT a.*, j.title, j.job_type, j.location, c.name as company_name, c.logo as company_logo
       FROM applications a JOIN jobs j ON a.job_id = j.id JOIN companies c ON j.company_id = c.id
       WHERE a.seeker_id = ? ORDER BY a.applied_at DESC`, [req.user.id]
    );
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get applications for a job (employer)
exports.getJobApplications = async (req, res) => {
  try {
    const [applications] = await db.query(
      `SELECT a.*, u.full_name, u.email, u.phone, sp.headline, sp.experience_years, sp.skills
       FROM applications a JOIN users u ON a.seeker_id = u.id LEFT JOIN seeker_profiles sp ON u.id = sp.user_id
       WHERE a.job_id = ? ORDER BY a.applied_at DESC`, [req.params.jobId]
    );
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['applied', 'reviewing', 'shortlisted', 'interview', 'offered', 'hired', 'rejected'];
    if (!validStatuses.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status' });

    await db.query('UPDATE applications SET status = ?, updated_at = NOW() WHERE id = ?', [status, req.params.id]);

    const [apps] = await db.query('SELECT seeker_id, job_id FROM applications WHERE id = ?', [req.params.id]);
    if (apps.length > 0) {
      const [jobs] = await db.query('SELECT title FROM jobs WHERE id = ?', [apps[0].job_id]);
      await db.query(
        'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
        [apps[0].seeker_id, 'Application Update', `Your application for ${jobs[0]?.title} has been ${status}`, 'application']
      );
    }

    res.json({ success: true, message: 'Application status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Withdraw application
exports.withdrawApplication = async (req, res) => {
  try {
    await db.query('DELETE FROM applications WHERE id = ? AND seeker_id = ?', [req.params.id, req.user.id]);
    res.json({ success: true, message: 'Application withdrawn' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
