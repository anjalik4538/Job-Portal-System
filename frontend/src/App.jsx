// frontend/src/App.jsx
import { useState, useEffect, createContext, useContext } from "react";
import JobList from "./pages/JobList";
import JobDetail from "./pages/JobDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PostJob from "./pages/PostJob";
import Companies from "./pages/Companies";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");
  const [selectedJob, setSelectedJob] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setPage("home");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setPage("home");
  };

  const navigate = (p, data = null) => {
    setPage(p);
    if (data) setSelectedJob(data);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (page) {
      case "login": return <Login onLogin={login} navigate={navigate} showToast={showToast} />;
      case "register": return <Register onLogin={login} navigate={navigate} showToast={showToast} />;
      case "dashboard": return <Dashboard navigate={navigate} showToast={showToast} />;
      case "post-job": return <PostJob navigate={navigate} showToast={showToast} />;
      case "companies": return <Companies navigate={navigate} />;
      case "job-detail": return <JobDetail job={selectedJob} navigate={navigate} showToast={showToast} />;
      default: return <JobList navigate={navigate} showToast={showToast} />;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
        <Navbar navigate={navigate} currentPage={page} />
        <main style={{ flex: 1 }}>{renderPage()}</main>
        <Footer navigate={navigate} />
        {toast && (
          <div style={{
            position: "fixed", bottom: "24px", right: "24px", zIndex: 9999,
            background: toast.type === "error" ? "#ef4444" : "#22c55e",
            color: "#fff", padding: "12px 24px", borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)", fontWeight: 500,
            animation: "slideIn 0.3s ease"
          }}>{toast.msg}</div>
        )}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          button { cursor: pointer; font-family: inherit; }
          input, textarea, select { font-family: inherit; }
          a { text-decoration: none; }
        `}</style>
      </div>
    </AuthContext.Provider>
  );
}
