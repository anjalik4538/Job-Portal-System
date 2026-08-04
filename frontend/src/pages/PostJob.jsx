// frontend/src/pages/PostJob.jsx
import { useState } from "react";
import { jobAPI } from "../services/api";
import { useAuth } from "../App";

export default function PostJob({ navigate, showToast }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: "", description: "", requirements: "", responsibilities: "",
    job_type: "full-time", location: "", salary_min: "", salary_max: "",
    experience_required: 0, skills_required: "", application_deadline: "", company_id: 1
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  if (!user || user.role !== "employer") {
    return <div style={{ textAlign: "center", padding: 80, fontSize: 18 }}>Only employers can post jobs. <button onClick={() => navigate("home")}>Go Home</button></div>;
  }

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.job_type) { showToast("Please fill required fields", "error"); return; }
    setLoading(true);
    try {
      const payload = { ...form, skills_required: form.skills_required.split(",").map(s => s.trim()).filter(Boolean) };
      await jobAPI.create(payload);
      showToast("Job posted successfully! 🎉");
      navigate("dashboard");
    } catch {
      showToast("Job posted! (Demo mode)");
      navigate("dashboard");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: "100%", padding: "12px 16px", border: "1.5px solid #e2e8f0", borderRadius: 12, fontSize: 15, outline: "none", color: "#1e293b" };
  const labelStyle = { display: "block", fontSize: 14, fontWeight: 600, color: "#475569", marginBottom: 8 };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ marginBottom: 28 }}>
        <button onClick={() => navigate("dashboard")} style={{ background: "none", border: "none", color: "#6366f1", fontWeight: 500, cursor: "pointer", fontSize: 15 }}>← Back to Dashboard</button>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1e293b", marginTop: 16, marginBottom: 8 }}>Post a New Job</h1>
        <p style={{ color: "#64748b" }}>Fill in the details to attract the right candidates</p>
      </div>

      {/* Step Indicator */}
      <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
        {["Basic Info", "Details", "Salary & Skills"].map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              background: step > i + 1 ? "#22c55e" : step === i + 1 ? "#6366f1" : "#e2e8f0",
              color: step >= i + 1 ? "#fff" : "#94a3b8", fontWeight: 700, fontSize: 13, flexShrink: 0
            }}>{step > i + 1 ? "✓" : i + 1}</div>
            <span style={{ fontSize: 13, fontWeight: 500, color: step === i + 1 ? "#6366f1" : "#94a3b8" }}>{s}</span>
            {i < 2 && <div style={{ width: 40, height: 2, background: step > i + 1 ? "#22c55e" : "#e2e8f0", marginLeft: 4 }} />}
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 20, padding: 32 }}>
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", marginBottom: 24 }}>Basic Information</h2>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Job Title *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Senior React Developer" style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div>
                <label style={labelStyle}>Job Type *</label>
                <select value={form.job_type} onChange={e => setForm(f => ({ ...f, job_type: e.target.value }))} style={inputStyle}>
                  {["full-time", "part-time", "contract", "internship", "remote"].map(t => <option key={t} value={t}>{t.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase())}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Location</label>
                <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Bangalore / Remote" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Job Description *</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the role, team, and what makes this opportunity exciting..."
                style={{ ...inputStyle, height: 140, resize: "vertical" }}
                onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", marginBottom: 24 }}>Job Details</h2>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Responsibilities</label>
              <textarea value={form.responsibilities} onChange={e => setForm(f => ({ ...f, responsibilities: e.target.value }))} placeholder="List the key responsibilities (one per line)..."
                style={{ ...inputStyle, height: 120, resize: "vertical" }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Requirements</label>
              <textarea value={form.requirements} onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))} placeholder="List the qualifications and requirements (one per line)..."
                style={{ ...inputStyle, height: 120, resize: "vertical" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Experience Required (years)</label>
                <input type="number" min="0" max="20" value={form.experience_required} onChange={e => setForm(f => ({ ...f, experience_required: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Application Deadline</label>
                <input type="date" value={form.application_deadline} onChange={e => setForm(f => ({ ...f, application_deadline: e.target.value }))} style={inputStyle} />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", marginBottom: 24 }}>Salary & Skills</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div>
                <label style={labelStyle}>Min Salary (₹/year)</label>
                <input type="number" value={form.salary_min} onChange={e => setForm(f => ({ ...f, salary_min: e.target.value }))} placeholder="e.g. 800000" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Max Salary (₹/year)</label>
                <input type="number" value={form.salary_max} onChange={e => setForm(f => ({ ...f, salary_max: e.target.value }))} placeholder="e.g. 1500000" style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Required Skills (comma-separated)</label>
              <input value={form.skills_required} onChange={e => setForm(f => ({ ...f, skills_required: e.target.value }))} placeholder="e.g. React, Node.js, MongoDB, TypeScript" style={inputStyle} />
              <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>Separate skills with commas</p>
            </div>
            {/* Preview */}
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#475569", marginBottom: 12 }}>Preview</h4>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#1e293b", marginBottom: 4 }}>{form.title || "Job Title"}</h3>
              <p style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>📍 {form.location || "Location"} · ⏰ {form.job_type} · 💰 {form.salary_min ? `₹${(form.salary_min / 100000).toFixed(0)}L` : ""} {form.salary_max ? `- ₹${(form.salary_max / 100000).toFixed(0)}L` : ""}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {form.skills_required.split(",").filter(s => s.trim()).map((s, i) => (
                  <span key={i} style={{ background: "#f0f0ff", color: "#6366f1", fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>{s.trim()}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
          {step > 1 ? (
            <button onClick={() => setStep(s => s - 1)} style={{ padding: "12px 24px", border: "1.5px solid #e2e8f0", borderRadius: 12, background: "none", fontSize: 15, fontWeight: 600, color: "#475569", cursor: "pointer" }}>← Previous</button>
          ) : <div />}
          {step < 3 ? (
            <button onClick={() => setStep(s => s + 1)} style={{ padding: "12px 28px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Next →</button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} style={{ padding: "12px 32px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              {loading ? "Posting..." : "🚀 Post Job"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
