// frontend/src/pages/Dashboard.jsx
import { useState } from "react";
import { useAuth } from "../App";

const MOCK_APPLICATIONS = [
  { id: 1, title: "Senior React Developer", company_name: "TechCorp India", location: "Bangalore", job_type: "full-time", status: "shortlisted", applied_at: new Date(Date.now() - 259200000).toISOString(), company_logo: null },
  { id: 2, title: "Python Backend Engineer", company_name: "StartupHub", location: "Remote", job_type: "remote", status: "reviewing", applied_at: new Date(Date.now() - 172800000).toISOString(), company_logo: null },
  { id: 3, title: "DevOps Engineer", company_name: "CloudNine", location: "Remote", job_type: "contract", status: "interview", applied_at: new Date(Date.now() - 86400000).toISOString(), company_logo: null },
];

const MOCK_POSTED_JOBS = [
  { id: 1, title: "Senior React Developer", status: "active", views_count: 245, applications_count: 18, created_at: new Date(Date.now() - 604800000).toISOString() },
  { id: 2, title: "Python Backend Engineer", status: "active", views_count: 189, applications_count: 12, created_at: new Date(Date.now() - 432000000).toISOString() },
  { id: 3, title: "UI/UX Designer", status: "paused", views_count: 310, applications_count: 25, created_at: new Date(Date.now() - 1209600000).toISOString() },
];

const statusConfig = {
  applied: { label: "Applied", color: "#2563eb", bg: "#dbeafe" },
  reviewing: { label: "Reviewing", color: "#d97706", bg: "#fef3c7" },
  shortlisted: { label: "Shortlisted", color: "#7c3aed", bg: "#ede9fe" },
  interview: { label: "Interview", color: "#059669", bg: "#d1fae5" },
  offered: { label: "Offered!", color: "#16a34a", bg: "#dcfce7" },
  hired: { label: "Hired 🎉", color: "#15803d", bg: "#bbf7d0" },
  rejected: { label: "Not Selected", color: "#dc2626", bg: "#fee2e2" },
};

export default function Dashboard({ navigate, showToast }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Please login to view your dashboard</h2>
        <button onClick={() => navigate("login")} style={{ background: "#6366f1", color: "#fff", border: "none", padding: "12px 28px", borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: "pointer" }}>Login</button>
      </div>
    );
  }

  const isEmployer = user.role === "employer";
  const stats = isEmployer
    ? [{ label: "Posted Jobs", value: "3", icon: "📋", color: "#6366f1" }, { label: "Total Applicants", value: "55", icon: "👥", color: "#8b5cf6" }, { label: "Active Listings", value: "2", icon: "✅", color: "#10b981" }, { label: "Total Views", value: "744", icon: "👁", color: "#f59e0b" }]
    : [{ label: "Applications", value: "3", icon: "📤", color: "#6366f1" }, { label: "Interviews", value: "1", icon: "🗓", color: "#8b5cf6" }, { label: "Saved Jobs", value: "5", icon: "🔖", color: "#10b981" }, { label: "Profile Views", value: "28", icon: "👁", color: "#f59e0b" }];

  const tabs = isEmployer
    ? [["overview", "Overview"], ["jobs", "My Jobs"], ["applicants", "Applicants"]]
    : [["overview", "Overview"], ["applications", "My Applications"], ["profile", "Profile"]];

  const timeAgo = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / 86400000);
    if (diff === 0) return "Today";
    if (diff < 7) return `${diff}d ago`;
    return `${Math.floor(diff / 7)}w ago`;
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1e293b", marginBottom: 4 }}>
            Hello, {user.full_name?.split(" ")[0]}! 👋
          </h1>
          <p style={{ color: "#64748b", fontSize: 15 }}>
            {isEmployer ? "Manage your job postings and applications" : "Track your job search progress"}
          </p>
        </div>
        {isEmployer && (
          <button onClick={() => navigate("post-job")} style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none",
            padding: "12px 24px", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer"
          }}>+ Post New Job</button>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, background: "#f1f5f9", borderRadius: 12, padding: 4, marginBottom: 24, width: "fit-content" }}>
        {tabs.map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{
            padding: "9px 20px", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600,
            cursor: "pointer", transition: "all 0.2s",
            background: activeTab === id ? "#fff" : "none",
            color: activeTab === id ? "#6366f1" : "#64748b",
            boxShadow: activeTab === id ? "0 1px 4px rgba(0,0,0,0.1)" : "none"
          }}>{label}</button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1e293b", marginBottom: 20 }}>
              {isEmployer ? "Recent Job Postings" : "Recent Applications"}
            </h3>
            {(isEmployer ? MOCK_POSTED_JOBS : MOCK_APPLICATIONS).slice(0, 3).map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: i < 2 ? "1px solid #f1f5f9" : "none" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                    {isEmployer ? `${item.applications_count} applications · ${item.views_count} views` : item.company_name}
                  </div>
                </div>
                {!isEmployer && item.status && (
                  <span style={{
                    background: statusConfig[item.status]?.bg, color: statusConfig[item.status]?.color,
                    fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20
                  }}>{statusConfig[item.status]?.label}</span>
                )}
                {isEmployer && (
                  <span style={{
                    background: item.status === "active" ? "#dcfce7" : "#fef3c7",
                    color: item.status === "active" ? "#16a34a" : "#d97706",
                    fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20, textTransform: "capitalize"
                  }}>{item.status}</span>
                )}
              </div>
            ))}
          </div>

          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1e293b", marginBottom: 20 }}>
              {isEmployer ? "Quick Actions" : "Profile Completion"}
            </h3>
            {isEmployer ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[["📋 Post a New Job", "post-job"], ["🏢 Update Company Profile", "dashboard"], ["📊 View Analytics", "dashboard"]].map(([label, page], i) => (
                  <button key={i} onClick={() => navigate(page)} style={{
                    padding: "14px 18px", background: "#f8fafc", border: "1px solid #e2e8f0",
                    borderRadius: 12, textAlign: "left", fontSize: 14, fontWeight: 600, color: "#334155", cursor: "pointer"
                  }}>{label}</button>
                ))}
              </div>
            ) : (
              <div>
                {[["Basic Info", 100], ["Work Experience", 60], ["Skills", 80], ["Resume Upload", 40]].map(([label, pct], i) => (
                  <div key={i} style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 500, color: "#475569" }}>{label}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: pct === 100 ? "#16a34a" : "#6366f1" }}>{pct}%</span>
                    </div>
                    <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3 }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#22c55e" : "linear-gradient(90deg, #6366f1, #8b5cf6)", borderRadius: 3, transition: "width 1s" }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "applications" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {MOCK_APPLICATIONS.map(app => (
            <div key={app.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                {app.company_name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>{app.title}</h4>
                <p style={{ fontSize: 14, color: "#64748b" }}>{app.company_name} · {app.location}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{
                  display: "block", background: statusConfig[app.status]?.bg, color: statusConfig[app.status]?.color,
                  fontSize: 13, fontWeight: 600, padding: "5px 14px", borderRadius: 20, marginBottom: 6
                }}>{statusConfig[app.status]?.label}</span>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{timeAgo(app.applied_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "jobs" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {MOCK_POSTED_JOBS.map(job => (
            <div key={job.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 22, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>{job.title}</h4>
                <div style={{ display: "flex", gap: 20, fontSize: 14, color: "#64748b" }}>
                  <span>👁 {job.views_count} views</span>
                  <span>📄 {job.applications_count} applications</span>
                  <span>📅 {timeAgo(job.created_at)}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{
                  background: job.status === "active" ? "#dcfce7" : "#fef3c7",
                  color: job.status === "active" ? "#16a34a" : "#d97706",
                  fontSize: 13, fontWeight: 600, padding: "5px 14px", borderRadius: 20, textTransform: "capitalize"
                }}>{job.status}</span>
                <button style={{ padding: "8px 16px", border: "1px solid #e2e8f0", borderRadius: 8, background: "none", fontSize: 13, fontWeight: 500, color: "#475569", cursor: "pointer" }}>Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
