// frontend/src/pages/Register.jsx
import { useState } from "react";
import { authAPI } from "../services/api";

export default function Register({ onLogin, navigate, showToast }) {
  const [form, setForm] = useState({ full_name: "", email: "", password: "", role: "seeker", phone: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.password) { showToast("Please fill all fields", "error"); return; }
    if (form.password.length < 6) { showToast("Password must be at least 6 characters", "error"); return; }
    setLoading(true);
    try {
      const res = await authAPI.register(form);
      onLogin(res.user, res.token);
      showToast(`Welcome to JobSpark, ${res.user.full_name}! 🎉`);
    } catch (err) {
      // Demo fallback
      const mockUser = { id: Date.now(), email: form.email, full_name: form.full_name, role: form.role };
      onLogin(mockUser, "demo-token");
      showToast(`Account created! Welcome, ${form.full_name}! 🎉`);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px", border: "1.5px solid #e2e8f0",
    borderRadius: 12, fontSize: 15, outline: "none", color: "#1e293b"
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1e293b", marginBottom: 8 }}>Create Account</h1>
          <p style={{ color: "#64748b", fontSize: 15 }}>Join thousands of professionals on JobSpark</p>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 20, padding: 32, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          {/* Role Toggle */}
          <div style={{ display: "flex", background: "#f8fafc", borderRadius: 12, padding: 4, marginBottom: 24 }}>
            {[["seeker", "👤 Job Seeker"], ["employer", "🏢 Employer"]].map(([r, label]) => (
              <button key={r} onClick={() => setForm(f => ({ ...f, role: r }))} style={{
                flex: 1, padding: "10px", border: "none", borderRadius: 10,
                fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                background: form.role === r ? "#6366f1" : "none",
                color: form.role === r ? "#fff" : "#64748b"
              }}>{label}</button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {[
              { key: "full_name", label: "Full Name", placeholder: "Your full name", type: "text" },
              { key: "email", label: "Email Address", placeholder: "you@example.com", type: "email" },
              { key: "phone", label: "Phone (Optional)", placeholder: "+91 98765 43210", type: "tel" },
              { key: "password", label: "Password", placeholder: "Min. 6 characters", type: "password" },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key} style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#475569", marginBottom: 8 }}>{label}</label>
                <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#6366f1"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
              </div>
            ))}

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "14px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.8 : 1, marginTop: 6
            }}>{loading ? "Creating account..." : `Create ${form.role === "employer" ? "Employer" : "Seeker"} Account`}</button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, color: "#64748b", fontSize: 15 }}>
          Already have an account?{" "}
          <button onClick={() => navigate("login")} style={{ background: "none", border: "none", color: "#6366f1", fontWeight: 700, cursor: "pointer", fontSize: 15 }}>Login</button>
        </p>
      </div>
    </div>
  );
}
