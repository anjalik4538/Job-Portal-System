// frontend/src/pages/Login.jsx
import { useState } from "react";
import { authAPI } from "../services/api";

export default function Login({ onLogin, navigate, showToast }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { showToast("Please fill all fields", "error"); return; }
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      onLogin(res.user, res.token);
      showToast(`Welcome back, ${res.user.full_name}! 👋`);
    } catch (err) {
      showToast(err.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (role) => {
    const creds = role === "employer" ? { email: "employer@techcorp.com", password: "demo123" } : { email: "john@seeker.com", password: "demo123" };
    setForm(creds);
    setLoading(true);
    try {
      const res = await authAPI.login(creds);
      onLogin(res.user, res.token);
    } catch {
      // Demo mode - create mock user
      const mockUser = { id: role === "employer" ? 2 : 3, email: creds.email, full_name: role === "employer" ? "Rahul Sharma" : "John Doe", role };
      onLogin(mockUser, "demo-token");
      showToast(`Demo ${role} login successful!`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 60, height: 60, background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, fontWeight: 800, color: "#fff", margin: "0 auto 16px"
          }}>J</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1e293b", marginBottom: 8 }}>Welcome back</h1>
          <p style={{ color: "#64748b", fontSize: 15 }}>Login to access your account</p>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 20, padding: 32, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#475569", marginBottom: 8 }}>Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                style={{ width: "100%", padding: "12px 16px", border: "1.5px solid #e2e8f0", borderRadius: 12, fontSize: 15, outline: "none", color: "#1e293b", transition: "border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor = "#6366f1"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#475569", marginBottom: 8 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPassword ? "text" : "password"} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Enter your password"
                  style={{ width: "100%", padding: "12px 48px 12px 16px", border: "1.5px solid #e2e8f0", borderRadius: 12, fontSize: 15, outline: "none", color: "#1e293b" }}
                  onFocus={e => e.target.style.borderColor = "#6366f1"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#94a3b8", fontSize: 18, cursor: "pointer" }}>
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "14px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.8 : 1, marginBottom: 16
            }}>{loading ? "Logging in..." : "Login"}</button>
          </form>

          <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 20 }}>
            <p style={{ textAlign: "center", fontSize: 13, color: "#94a3b8", marginBottom: 12 }}>Demo accounts</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => demoLogin("seeker")} style={{
                flex: 1, padding: "10px", border: "1.5px solid #e2e8f0", borderRadius: 10,
                fontSize: 13, fontWeight: 600, color: "#475569", background: "#f8fafc", cursor: "pointer"
              }}>👤 Job Seeker</button>
              <button onClick={() => demoLogin("employer")} style={{
                flex: 1, padding: "10px", border: "1.5px solid #e2e8f0", borderRadius: 10,
                fontSize: 13, fontWeight: 600, color: "#475569", background: "#f8fafc", cursor: "pointer"
              }}>🏢 Employer</button>
            </div>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, color: "#64748b", fontSize: 15 }}>
          Don't have an account?{" "}
          <button onClick={() => navigate("register")} style={{ background: "none", border: "none", color: "#6366f1", fontWeight: 700, cursor: "pointer", fontSize: 15 }}>Sign up</button>
        </p>
      </div>
    </div>
  );
}
