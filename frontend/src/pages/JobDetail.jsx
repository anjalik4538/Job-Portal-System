// frontend/src/pages/JobDetail.jsx
import { useState } from "react";
import { useAuth } from "../App";
import { applicationAPI } from "../services/api";

export default function JobDetail({ job, navigate, showToast }) {
  const { user } = useAuth();
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [applied, setApplied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (!job) return <div style={{ textAlign: "center", padding: 80 }}>Job not found. <button onClick={() => navigate("home")}>Go back</button></div>;

  const colors = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"];
  const bgColor = colors[job.company_name?.charCodeAt(0) % colors.length] || "#6366f1";
  const initials = job.company_name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const formatSalary = (min, max) => {
    const fmt = (n) => n >= 100000 ? `₹${(n / 100000).toFixed(0)} LPA` : `₹${(n / 1000).toFixed(0)}K`;
    if (min && max) return `${fmt(min)} – ${fmt(max)}`;
    if (min) return `From ${fmt(min)}`;
    if (max) return `Up to ${fmt(max)}`;
    return "Negotiable";
  };

  const handleApply = async () => {
    if (!user) { navigate("login"); return; }
    if (user.role !== "seeker") { showToast("Only job seekers can apply", "error"); return; }
    setApplying(true);
    try {
      await applicationAPI.apply(job.id, { cover_letter: coverLetter });
      setApplied(true);
      setShowModal(false);
      showToast("Application submitted successfully! 🎉");
    } catch (err) {
      showToast(err.message || "Failed to apply", "error");
    } finally {
      setApplying(false);
    }
  };

  const skills = typeof job.skills_required === "string" ? JSON.parse(job.skills_required) : (job.skills_required || []);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#64748b" }}>
        <button onClick={() => navigate("home")} style={{ background: "none", border: "none", color: "#6366f1", fontWeight: 500, cursor: "pointer" }}>← Back to Jobs</button>
      </div>

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        {/* Main Content */}
        <div style={{ flex: 1 }}>
          {/* Header Card */}
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 20, padding: 32, marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
              <div style={{
                width: 72, height: 72, borderRadius: 18, background: bgColor,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 800, fontSize: 24, flexShrink: 0
              }}>{initials}</div>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1e293b", marginBottom: 6 }}>{job.title}</h1>
                <p style={{ fontSize: 16, color: "#6366f1", fontWeight: 600, marginBottom: 8 }}>{job.company_name}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  <span style={{ fontSize: 14, color: "#64748b" }}>📍 {job.location || "Remote"}</span>
                  <span style={{ fontSize: 14, color: "#64748b" }}>💼 {job.experience_required || 0}+ years</span>
                  <span style={{ fontSize: 14, color: "#64748b" }}>⏰ {job.job_type?.replace("-", " ")}</span>
                  <span style={{ fontSize: 14, color: "#16a34a", fontWeight: 600 }}>💰 {formatSalary(job.salary_min, job.salary_max)}</span>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingTop: 20, borderTop: "1px solid #f1f5f9" }}>
              {skills.map((skill, i) => (
                <span key={i} style={{
                  background: "#f0f0ff", color: "#6366f1", fontSize: 13, fontWeight: 600,
                  padding: "5px 14px", borderRadius: 20
                }}>{skill}</span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 20, padding: 32, marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", marginBottom: 16 }}>About This Role</h2>
            <p style={{ color: "#475569", lineHeight: 1.8, fontSize: 15 }}>
              {job.description || `We are looking for a talented ${job.title} to join our dynamic team at ${job.company_name}. You will be working on exciting projects that impact millions of users. This is a great opportunity to grow your career and work with cutting-edge technologies.`}
            </p>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: "24px 0 12px" }}>Responsibilities</h3>
            <ul style={{ color: "#475569", lineHeight: 2, paddingLeft: 20, fontSize: 15 }}>
              <li>Design and develop high-quality, scalable solutions</li>
              <li>Collaborate with cross-functional teams</li>
              <li>Write clean, maintainable, and testable code</li>
              <li>Participate in code reviews and technical discussions</li>
              <li>Contribute to architecture decisions</li>
            </ul>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", margin: "24px 0 12px" }}>Requirements</h3>
            <ul style={{ color: "#475569", lineHeight: 2, paddingLeft: 20, fontSize: 15 }}>
              <li>{job.experience_required || 0}+ years of relevant experience</li>
              {skills.map((s, i) => <li key={i}>Proficiency in {s}</li>)}
              <li>Strong problem-solving and communication skills</li>
              <li>Bachelor's degree in CS or related field preferred</li>
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ width: 300, flexShrink: 0 }}>
          {/* Apply Card */}
          <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 20, padding: 24, marginBottom: 16 }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#6366f1", marginBottom: 4 }}>
                {formatSalary(job.salary_min, job.salary_max)}
              </div>
              <p style={{ fontSize: 13, color: "#94a3b8" }}>per year</p>
            </div>

            {applied ? (
              <div style={{
                background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 12,
                padding: "14px", textAlign: "center", color: "#16a34a", fontWeight: 600
              }}>✅ Application Submitted!</div>
            ) : (
              <button onClick={() => user ? setShowModal(true) : navigate("login")} style={{
                width: "100%", padding: "14px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700,
                cursor: "pointer", marginBottom: 12
              }}>
                {user ? "Apply Now" : "Login to Apply"}
              </button>
            )}

            <button style={{
              width: "100%", padding: "12px", background: "none", border: "1.5px solid #e2e8f0",
              borderRadius: 12, fontSize: 14, fontWeight: 600, color: "#475569", cursor: "pointer"
            }}>🔖 Save Job</button>
          </div>

          {/* Job Info */}
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 20, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 16 }}>Job Overview</h3>
            {[
              ["📅", "Posted", "Recently"],
              ["⏰", "Job Type", job.job_type?.replace("-", " ")],
              ["📍", "Location", job.location || "Remote"],
              ["💼", "Experience", `${job.experience_required || 0}+ years`],
              ["🎓", "Education", job.education_required || "Bachelor's Degree"],
              ["👥", "Vacancies", "2-3 Positions"],
            ].map(([icon, label, value], i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 16 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>{label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#334155", textTransform: "capitalize" }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20
        }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 32, width: "100%", maxWidth: 520 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1e293b", marginBottom: 8 }}>Apply for {job.title}</h2>
            <p style={{ color: "#64748b", marginBottom: 24, fontSize: 15 }}>at {job.company_name}</p>

            <label style={{ fontSize: 14, fontWeight: 600, color: "#475569" }}>Cover Letter</label>
            <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)}
              placeholder="Tell the employer why you're a great fit for this role..."
              style={{
                width: "100%", height: 140, marginTop: 8, padding: "12px 16px",
                border: "1.5px solid #e2e8f0", borderRadius: 12, fontSize: 14,
                resize: "vertical", outline: "none", color: "#334155", lineHeight: 1.6
              }} />

            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <button onClick={() => setShowModal(false)} style={{
                flex: 1, padding: "13px", background: "none", border: "1.5px solid #e2e8f0",
                borderRadius: 12, fontWeight: 600, color: "#64748b", fontSize: 15
              }}>Cancel</button>
              <button onClick={handleApply} disabled={applying} style={{
                flex: 2, padding: "13px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 15
              }}>{applying ? "Submitting..." : "Submit Application"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
