// frontend/src/components/Navbar.jsx
import { useState } from "react";
import { useAuth } from "../App";

export default function Navbar({ navigate, currentPage }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Jobs", page: "home" },
    { label: "Companies", page: "companies" },
  ];

  return (
    <nav style={{
      background: "#fff", borderBottom: "1px solid #e2e8f0",
      position: "sticky", top: 0, zIndex: 100,
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* Logo */}
        <div onClick={() => navigate("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 36, height: 36, background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 800, color: "#fff"
          }}>J</div>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#1e293b" }}>
            Job<span style={{ color: "#6366f1" }}>Spark</span>
          </span>
        </div>

        {/* Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {navLinks.map(link => (
            <button key={link.page} onClick={() => navigate(link.page)} style={{
              background: "none", border: "none", padding: "8px 16px", borderRadius: 8,
              fontSize: 15, fontWeight: 500, color: currentPage === link.page ? "#6366f1" : "#64748b",
              background: currentPage === link.page ? "#f0f0ff" : "none", cursor: "pointer",
              transition: "all 0.2s"
            }}>{link.label}</button>
          ))}

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8 }}>
              {user.role === "employer" && (
                <button onClick={() => navigate("post-job")} style={{
                  background: "#6366f1", color: "#fff", border: "none",
                  padding: "8px 18px", borderRadius: 8, fontSize: 14, fontWeight: 600
                }}>+ Post Job</button>
              )}
              <button onClick={() => navigate("dashboard")} style={{
                background: currentPage === "dashboard" ? "#f0f0ff" : "none",
                border: "1px solid #e2e8f0", padding: "7px 16px", borderRadius: 8,
                fontSize: 14, fontWeight: 500, color: "#475569"
              }}>Dashboard</button>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer"
                }} onClick={() => navigate("dashboard")}>
                  {user.full_name?.[0]?.toUpperCase()}
                </div>
                <button onClick={logout} style={{
                  background: "none", border: "1px solid #e2e8f0", padding: "7px 14px",
                  borderRadius: 8, fontSize: 14, color: "#64748b", fontWeight: 500
                }}>Logout</button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8, marginLeft: 8 }}>
              <button onClick={() => navigate("login")} style={{
                background: "none", border: "1px solid #e2e8f0", padding: "8px 18px",
                borderRadius: 8, fontSize: 14, fontWeight: 500, color: "#475569"
              }}>Login</button>
              <button onClick={() => navigate("register")} style={{
                background: "#6366f1", color: "#fff", border: "none",
                padding: "8px 18px", borderRadius: 8, fontSize: 14, fontWeight: 600
              }}>Sign Up</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
