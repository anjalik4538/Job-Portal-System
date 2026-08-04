// frontend/src/pages/Companies.jsx
import { useState } from "react";

const MOCK_COMPANIES = [
  { id: 1, name: "TechCorp India", industry: "Technology", size: "201-500", location: "Bangalore", description: "Leading software company building innovative solutions for enterprise clients.", job_count: 12, founded_year: 2010 },
  { id: 2, name: "StartupHub", industry: "E-Commerce", size: "11-50", location: "Mumbai", description: "Fast-growing e-commerce startup disrupting the retail industry.", job_count: 5, founded_year: 2018 },
  { id: 3, name: "CloudNine Tech", industry: "Cloud Services", size: "51-200", location: "Remote", description: "Cloud infrastructure provider helping businesses scale globally.", job_count: 8, founded_year: 2015 },
  { id: 4, name: "DesignFirst", industry: "Design & Creative", size: "11-50", location: "Delhi", description: "Award-winning design studio creating exceptional digital experiences.", job_count: 3, founded_year: 2017 },
  { id: 5, name: "Analytics Pro", industry: "Data & Analytics", size: "51-200", location: "Hyderabad", description: "Data analytics company turning raw data into business intelligence.", job_count: 7, founded_year: 2014 },
  { id: 6, name: "MobileFirst", industry: "Mobile Technology", size: "11-50", location: "Pune", description: "Mobile-first company building next-gen apps for iOS and Android.", job_count: 4, founded_year: 2019 },
];

const industryColors = {
  "Technology": "#6366f1", "E-Commerce": "#f59e0b", "Cloud Services": "#06b6d4",
  "Design & Creative": "#ec4899", "Data & Analytics": "#10b981", "Mobile Technology": "#8b5cf6"
};

export default function Companies({ navigate }) {
  const [search, setSearch] = useState("");
  const filtered = MOCK_COMPANIES.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.industry.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1e293b", marginBottom: 8 }}>Top Companies Hiring</h1>
        <p style={{ color: "#64748b", fontSize: 16, marginBottom: 24 }}>Explore the best companies and find your perfect workplace</p>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search companies or industries..."
          style={{ width: "100%", maxWidth: 480, padding: "13px 20px", border: "1.5px solid #e2e8f0", borderRadius: 12, fontSize: 15, outline: "none" }}
          onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
        {filtered.map(company => {
          const color = industryColors[company.industry] || "#6366f1";
          const initials = company.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
          return (
            <div key={company.id} style={{
              background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 20, padding: 24,
              cursor: "pointer", transition: "all 0.2s"
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 4px 20px ${color}20`; e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
              <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 20, flexShrink: 0 }}>{initials}</div>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>{company.name}</h3>
                  <span style={{ background: `${color}15`, color, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>{company.industry}</span>
                </div>
              </div>
              <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>{company.description}</p>
              <div style={{ display: "flex", gap: 20, fontSize: 13, color: "#94a3b8", marginBottom: 16 }}>
                <span>📍 {company.location}</span>
                <span>👥 {company.size} employees</span>
                <span>📅 Est. {company.founded_year}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: color }}>{company.job_count} open positions</span>
                <button style={{ background: color, color: "#fff", border: "none", padding: "8px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>View Jobs</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
