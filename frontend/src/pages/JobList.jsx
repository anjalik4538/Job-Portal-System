// frontend/src/pages/JobList.jsx
import { useState, useEffect } from "react";
import { jobAPI } from "../services/api";
import JobCard from "../components/JobCard";
import { useAuth } from "../App";

const MOCK_JOBS = [
  { id: 1, title: "Senior React Developer", company_name: "TechCorp India", location: "Bangalore", job_type: "full-time", salary_min: 1200000, salary_max: 2000000, experience_required: 3, skills_required: ["React", "JavaScript", "Node.js", "MongoDB"], created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 2, title: "Python Backend Engineer", company_name: "StartupHub", location: "Remote", job_type: "remote", salary_min: 1000000, salary_max: 1800000, experience_required: 2, skills_required: ["Python", "FastAPI", "PostgreSQL", "Docker"], created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: 3, title: "UI/UX Designer", company_name: "DesignFirst", location: "Mumbai", job_type: "full-time", salary_min: 800000, salary_max: 1400000, experience_required: 2, skills_required: ["Figma", "Adobe XD", "CSS", "Prototyping"], created_at: new Date(Date.now() - 259200000).toISOString() },
  { id: 4, title: "DevOps Engineer", company_name: "CloudNine Tech", location: "Remote", job_type: "contract", salary_min: 1500000, salary_max: 2500000, experience_required: 4, skills_required: ["AWS", "Docker", "Kubernetes", "Terraform"], created_at: new Date(Date.now() - 345600000).toISOString() },
  { id: 5, title: "Data Scientist", company_name: "Analytics Pro", location: "Hyderabad", job_type: "full-time", salary_min: 1100000, salary_max: 1900000, experience_required: 3, skills_required: ["Python", "ML", "TensorFlow", "SQL"], created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 6, title: "iOS Developer", company_name: "MobileFirst", location: "Pune", job_type: "full-time", salary_min: 900000, salary_max: 1600000, experience_required: 2, skills_required: ["Swift", "iOS", "Xcode", "SwiftUI"], created_at: new Date(Date.now() - 432000000).toISOString() },
  { id: 7, title: "Frontend Intern", company_name: "InnovateTech", location: "Delhi", job_type: "internship", salary_min: 200000, salary_max: 400000, experience_required: 0, skills_required: ["HTML", "CSS", "JavaScript", "React"], created_at: new Date().toISOString() },
  { id: 8, title: "Product Manager", company_name: "GrowthCo", location: "Bangalore", job_type: "full-time", salary_min: 1800000, salary_max: 3000000, experience_required: 5, skills_required: ["Product Strategy", "Agile", "Roadmapping", "Analytics"], created_at: new Date(Date.now() - 518400000).toISOString() },
];

export default function JobList({ navigate, showToast }) {
  const { user } = useAuth();
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [filteredJobs, setFilteredJobs] = useState(MOCK_JOBS);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [experience, setExperience] = useState("");
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let filtered = jobs;
    if (search) filtered = filtered.filter(j => j.title.toLowerCase().includes(search.toLowerCase()) || j.company_name.toLowerCase().includes(search.toLowerCase()));
    if (location) filtered = filtered.filter(j => j.location?.toLowerCase().includes(location.toLowerCase()));
    if (jobType) filtered = filtered.filter(j => j.job_type === jobType);
    if (experience) filtered = filtered.filter(j => j.experience_required <= Number(experience));
    setFilteredJobs(filtered);
  }, [search, location, jobType, experience, jobs]);

  const handleSave = async (jobId) => {
    if (!user) { navigate("login"); return; }
    const newSaved = new Set(savedJobs);
    if (newSaved.has(jobId)) { newSaved.delete(jobId); showToast("Job removed from saved"); }
    else { newSaved.add(jobId); showToast("Job saved!"); }
    setSavedJobs(newSaved);
  };

  const stats = [
    { label: "Jobs Available", value: "10,000+", icon: "💼" },
    { label: "Companies", value: "2,500+", icon: "🏢" },
    { label: "Job Seekers", value: "50,000+", icon: "👥" },
    { label: "Placements", value: "15,000+", icon: "🎉" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div style={{
        background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)",
        padding: "64px 24px 80px", position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(139,92,246,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(99,102,241,0.3) 0%, transparent 50%)" }} />
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div style={{
            display: "inline-block", background: "rgba(255,255,255,0.1)", color: "#c4b5fd",
            fontSize: 13, fontWeight: 600, padding: "6px 16px", borderRadius: 20, marginBottom: 20,
            border: "1px solid rgba(255,255,255,0.15)"
          }}>🚀 Find Your Dream Job Today</div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 16 }}>
            Discover Jobs That<br />
            <span style={{ background: "linear-gradient(135deg, #a5b4fc, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Match Your Skills
            </span>
          </h1>
          <p style={{ color: "#a5b4fc", fontSize: 17, marginBottom: 36, lineHeight: 1.6 }}>
            Connect with top companies. Browse thousands of opportunities<br />and take the next step in your career.
          </p>

          {/* Search Bar */}
          <div style={{
            background: "#fff", borderRadius: 16, padding: "8px 8px 8px 20px",
            display: "flex", gap: 8, boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            maxWidth: 680, margin: "0 auto"
          }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Job title, company, or skills..."
              style={{ flex: 1, border: "none", outline: "none", fontSize: 15, color: "#1e293b", minWidth: 0, background: "none" }} />
            <span style={{ width: 1, background: "#e2e8f0", margin: "4px 4px" }} />
            <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location..."
              style={{ width: 160, border: "none", outline: "none", fontSize: 15, color: "#1e293b", background: "none" }} />
            <button onClick={() => {}} style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none",
              padding: "12px 24px", borderRadius: 10, fontSize: 15, fontWeight: 700, whiteSpace: "nowrap"
            }}>Search Jobs</button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: "#fff", padding: "24px", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#6366f1" }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", gap: 24 }}>
          {/* Filters Sidebar */}
          <div style={{ width: 240, flexShrink: 0 }}>
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 20, position: "sticky", top: 80 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", marginBottom: 20 }}>Filters</h3>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Job Type</label>
                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                  {["", "full-time", "part-time", "remote", "contract", "internship"].map(type => (
                    <label key={type} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14 }}>
                      <input type="radio" checked={jobType === type} onChange={() => setJobType(type)} style={{ accentColor: "#6366f1" }} />
                      <span style={{ color: "#475569" }}>{type === "" ? "All Types" : type.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase())}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Experience</label>
                <select value={experience} onChange={e => setExperience(e.target.value)} style={{
                  width: "100%", marginTop: 10, padding: "8px 12px", border: "1px solid #e2e8f0",
                  borderRadius: 8, fontSize: 14, color: "#475569", outline: "none"
                }}>
                  <option value="">Any</option>
                  <option value="0">Fresher (0 yrs)</option>
                  <option value="2">0-2 years</option>
                  <option value="5">0-5 years</option>
                  <option value="10">0-10 years</option>
                </select>
              </div>

              <button onClick={() => { setJobType(""); setExperience(""); setSearch(""); setLocation(""); }} style={{
                width: "100%", padding: "9px", background: "#f8fafc", border: "1px solid #e2e8f0",
                borderRadius: 8, fontSize: 14, fontWeight: 500, color: "#64748b"
              }}>Clear All</button>
            </div>
          </div>

          {/* Job Listings */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1e293b" }}>
                {filteredJobs.length} Jobs Found
                {(search || jobType || location) && <span style={{ fontSize: 14, fontWeight: 400, color: "#64748b", marginLeft: 8 }}>with filters</span>}
              </h2>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: 60, color: "#64748b" }}>Loading jobs...</div>
            ) : filteredJobs.length === 0 ? (
              <div style={{ textAlign: "center", padding: 80, color: "#64748b" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No jobs found</h3>
                <p>Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
                {filteredJobs.map(job => (
                  <JobCard key={job.id} job={job} saved={savedJobs.has(job.id)} onSave={handleSave}
                    onClick={() => navigate("job-detail", job)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
