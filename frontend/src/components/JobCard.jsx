// frontend/src/components/JobCard.jsx
export default function JobCard({ job, onClick, saved, onSave }) {
  const typeColors = {
    "full-time": { bg: "#dcfce7", color: "#16a34a" },
    "part-time": { bg: "#fef3c7", color: "#d97706" },
    "remote": { bg: "#dbeafe", color: "#2563eb" },
    "contract": { bg: "#f3e8ff", color: "#9333ea" },
    "internship": { bg: "#fce7f3", color: "#db2777" },
  };
  const tc = typeColors[job.job_type] || { bg: "#f1f5f9", color: "#64748b" };
  const initials = job.company_name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const colors = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];
  const bgColor = colors[job.company_name?.charCodeAt(0) % colors.length] || "#6366f1";

  const formatSalary = (min, max) => {
    if (!min && !max) return null;
    const fmt = (n) => n >= 100000 ? `₹${(n / 100000).toFixed(0)}L` : `₹${(n / 1000).toFixed(0)}K`;
    if (min && max) return `${fmt(min)} – ${fmt(max)}`;
    if (min) return `From ${fmt(min)}`;
    return `Up to ${fmt(max)}`;
  };

  const timeAgo = (date) => {
    const d = new Date(date), now = new Date();
    const diff = Math.floor((now - d) / 86400000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return `${Math.floor(diff / 30)} months ago`;
  };

  return (
    <div onClick={onClick} style={{
      background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: "22px 24px",
      cursor: "pointer", transition: "all 0.2s", position: "relative",
      animation: "fadeIn 0.3s ease"
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(99,102,241,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
    >
      {/* Save Button */}
      {onSave && (
        <button onClick={e => { e.stopPropagation(); onSave(job.id); }} style={{
          position: "absolute", top: 16, right: 16, background: "none", border: "none",
          fontSize: 20, cursor: "pointer", color: saved ? "#6366f1" : "#cbd5e1"
        }} title={saved ? "Saved" : "Save job"}>
          {saved ? "🔖" : "🔖"}
        </button>
      )}

      {/* Header */}
      <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
        <div style={{
          width: 50, height: 50, borderRadius: 12, background: bgColor,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 700, fontSize: 16, flexShrink: 0
        }}>{initials}</div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1e293b", marginBottom: 2 }}>{job.title}</h3>
          <p style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>{job.company_name}</p>
        </div>
      </div>

      {/* Meta */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}>
          📍 {job.location || "Remote"}
        </span>
        <span style={{ fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}>
          💼 {job.experience_required || 0}+ yrs
        </span>
        {formatSalary(job.salary_min, job.salary_max) && (
          <span style={{ fontSize: 13, color: "#16a34a", fontWeight: 600 }}>
            {formatSalary(job.salary_min, job.salary_max)}/yr
          </span>
        )}
      </div>

      {/* Skills */}
      {job.skills_required && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {(typeof job.skills_required === "string" ? JSON.parse(job.skills_required) : job.skills_required)
            .slice(0, 4).map((skill, i) => (
            <span key={i} style={{
              background: "#f8fafc", border: "1px solid #e2e8f0", color: "#475569",
              fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 20
            }}>{skill}</span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{
          background: tc.bg, color: tc.color, fontSize: 12, fontWeight: 600,
          padding: "4px 12px", borderRadius: 20, textTransform: "capitalize"
        }}>{job.job_type?.replace("-", " ")}</span>
        <span style={{ fontSize: 12, color: "#94a3b8" }}>{timeAgo(job.created_at)}</span>
      </div>
    </div>
  );
}
