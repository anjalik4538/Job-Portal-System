// frontend/src/components/Footer.jsx
export default function Footer({ navigate }) {
  return (
    <footer style={{ background: "#0f172a", color: "#94a3b8", padding: "48px 24px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#fff" }}>J</div>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>Job<span style={{ color: "#818cf8" }}>Spark</span></span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>Connecting talented professionals with amazing companies. Your next career move starts here.</p>
          </div>
          {[
            ["For Job Seekers", ["Browse Jobs", "Companies", "Create Profile", "Career Tips"]],
            ["For Employers", ["Post a Job", "Browse Resumes", "Pricing Plans", "Recruiter Tools"]],
            ["Company", ["About Us", "Blog", "Privacy Policy", "Terms of Service"]],
          ].map(([title, links]) => (
            <div key={title}>
              <h4 style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>{title}</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {links.map(link => (
                  <span key={link} style={{ fontSize: 14, cursor: "pointer", transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = "#818cf8"}
                    onMouseLeave={e => e.target.style.color = "#94a3b8"}>{link}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid #1e293b", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
          <span>© 2025 JobSpark. All rights reserved.</span>
          <div style={{ display: "flex", gap: 16 }}>
            {["🐦 Twitter", "💼 LinkedIn", "📸 Instagram"].map(s => (
              <span key={s} style={{ cursor: "pointer" }} onMouseEnter={e => e.target.style.color = "#818cf8"} onMouseLeave={e => e.target.style.color = "#94a3b8"}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
