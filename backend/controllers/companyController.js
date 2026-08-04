// backend/controllers/companyController.js
const db = require('../config/database');

exports.getAllCompanies = async (req, res) => {
  try {
    const [companies] = await db.query('SELECT c.*, COUNT(j.id) as job_count FROM companies c LEFT JOIN jobs j ON c.id = j.company_id AND j.status = "active" GROUP BY c.id ORDER BY c.name');
    res.json({ success: true, data: companies });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getCompanyById = async (req, res) => {
  try {
    const [companies] = await db.query('SELECT * FROM companies WHERE id = ?', [req.params.id]);
    if (companies.length === 0) return res.status(404).json({ success: false, message: 'Company not found' });
    res.json({ success: true, data: companies[0] });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getCompanyJobs = async (req, res) => {
  try {
    const [jobs] = await db.query('SELECT * FROM jobs WHERE company_id = ? AND status = "active" ORDER BY created_at DESC', [req.params.id]);
    res.json({ success: true, data: jobs });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.createCompany = async (req, res) => {
  try {
    const { name, website, industry, size, description, location, founded_year } = req.body;
    const [result] = await db.query(
      'INSERT INTO companies (employer_id, name, website, industry, size, description, location, founded_year) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, name, website, industry, size, description, location, founded_year]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.updateCompany = async (req, res) => {
  try {
    const { name, website, industry, description, location } = req.body;
    await db.query('UPDATE companies SET name=?, website=?, industry=?, description=?, location=? WHERE id=?', [name, website, industry, description, location, req.params.id]);
    res.json({ success: true, message: 'Company updated' });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};
