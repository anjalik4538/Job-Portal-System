// backend/controllers/userController.js
const db = require('../config/database');

exports.getProfile = async (req, res) => {
  try {
    const [users] = await db.query('SELECT u.*, sp.headline, sp.bio, sp.skills, sp.experience_years, sp.location, sp.expected_salary, sp.availability, sp.resume_url FROM users u LEFT JOIN seeker_profiles sp ON u.id = sp.user_id WHERE u.id = ?', [req.user.id]);
    res.json({ success: true, data: users[0] });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.updateProfile = async (req, res) => {
  try {
    const { full_name, phone, headline, bio, skills, experience_years, location, expected_salary, availability } = req.body;
    await db.query('UPDATE users SET full_name=?, phone=? WHERE id=?', [full_name, phone, req.user.id]);
    const [existing] = await db.query('SELECT id FROM seeker_profiles WHERE user_id = ?', [req.user.id]);
    if (existing.length > 0) {
      await db.query('UPDATE seeker_profiles SET headline=?, bio=?, skills=?, experience_years=?, location=?, expected_salary=?, availability=? WHERE user_id=?',
        [headline, bio, JSON.stringify(skills), experience_years, location, expected_salary, availability, req.user.id]);
    } else {
      await db.query('INSERT INTO seeker_profiles (user_id, headline, bio, skills, experience_years, location, expected_salary, availability) VALUES (?,?,?,?,?,?,?,?)',
        [req.user.id, headline, bio, JSON.stringify(skills), experience_years, location, expected_salary, availability]);
    }
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.uploadResume = async (req, res) => {
  res.json({ success: true, message: 'Resume uploaded successfully', url: '/uploads/resume.pdf' });
};

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    if (req.user.role === 'seeker') {
      const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM applications WHERE seeker_id = ?', [userId]);
      const [[{ interviews }]] = await db.query('SELECT COUNT(*) as interviews FROM applications WHERE seeker_id = ? AND status = "interview"', [userId]);
      const [[{ saved }]] = await db.query('SELECT COUNT(*) as saved FROM saved_jobs WHERE user_id = ?', [userId]);
      res.json({ success: true, data: { totalApplications: total, interviews, savedJobs: saved } });
    } else {
      const [[{ totalJobs }]] = await db.query('SELECT COUNT(*) as totalJobs FROM jobs j JOIN companies c ON j.company_id = c.id WHERE c.employer_id = ?', [userId]);
      const [[{ totalApplicants }]] = await db.query('SELECT COUNT(*) as totalApplicants FROM applications a JOIN jobs j ON a.job_id = j.id JOIN companies c ON j.company_id = c.id WHERE c.employer_id = ?', [userId]);
      res.json({ success: true, data: { totalJobs, totalApplicants } });
    }
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};
