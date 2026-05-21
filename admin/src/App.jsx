import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import "./App.css";


function App() {
  const token = localStorage.getItem("token");

  // REDIRECT IF NOT LOGGED IN
  useEffect(() => {
    if (!token) {
      window.location.href = "http://localhost:5174/admin-login";
    }
  }, [token]);



  const [activeTab, setActiveTab] = useState("dashboard");

  const [complaints, setComplaints] = useState([]);
  const [students, setStudents] = useState([]);

  const [analytics, setAnalytics] = useState({
    totalStudents: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    categoryStats: {}
  });

  const API_URL = "http://localhost:5000/api";

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/analytics`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAnalytics(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // ==========================================
  // FETCH COMPLAINTS
  // ==========================================

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(`${API_URL}/complaints`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setComplaints(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/students`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setStudents(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // ==========================================
  // AUTO REFRESH
  // ==========================================

  useEffect(() => {
    fetchComplaints();
    fetchAnalytics();

    const interval = setInterval(() => {
      fetchComplaints();
    }, 3000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeTab === "students") {
      fetchStudents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // ==========================================
  // UPDATE STATUS
  // ==========================================

  const updateStatus = async (id, status) => {
    try {
      const res = await axios.put(
        `${API_URL}/complaints/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchComplaints();
      fetchAnalytics();
    } catch (error) {
      console.error("STATUS UPDATE ERROR:", error.response?.data || error.message);
      alert("Failed to update status");
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "http://localhost:5173/";
  };

  // ==========================================
  // HOME
  // ==========================================

  const handleHome = () => {
    // Redirect to frontend landing page (Home.jsx at /)
    window.location.href = "http://localhost:5174/";
  };


  // ==========================================
  // STATS (Dashboard)
  // ==========================================

  const totalComplaints = analytics?.totalComplaints ?? complaints.length;
  const pendingComplaints =
    analytics?.pendingComplaints ??
    complaints.filter((c) => c.status === "Pending").length;
  const resolvedComplaints =
    analytics?.resolvedComplaints ??
    complaints.filter((c) => c.status === "Resolved").length;
  const totalStudents = analytics?.totalStudents ?? 0;

  const categoryEntries = Object.entries(analytics?.categoryStats || {});
  const pieData = [
    "Cleanliness",
    "Management",
    "Infrastructure",
    "Food/Hostel",
    "Other"
  ].map((cat) => ({ name: cat, value: analytics?.categoryStats?.[cat] ?? 0 }));

  const topCategory = useMemo(() => {
    let best = { name: "—", value: 0 };
    for (const p of pieData) {
      if (p.value > best.value) best = p;
    }
    return best;
  }, [pieData]);

  const pieColors = [
    "#dc2626",
    "#f97316",
    "#ef4444",
    "#fb7185",
    "#fca5a5"
  ];

  const barData = [
    { name: "Pending", value: pendingComplaints },
    { name: "Resolved", value: resolvedComplaints }
  ];

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div>
          <div className="sidebar-top">
            <h2>Resolvio</h2>
            <p>Admin Panel</p>
          </div>

          <nav className="sidebar-menu">
            <button
              className={activeTab === "dashboard" ? "active" : ""}
              onClick={() => setActiveTab("dashboard")}
            >
              📊 Dashboard
            </button>

            <button
              className={activeTab === "complaints" ? "active" : ""}
              onClick={() => setActiveTab("complaints")}
            >
              📋 Complaints
            </button>

            <button
              className={activeTab === "students" ? "active" : ""}
              onClick={() => setActiveTab("students")}
            >
              🎓 Students
            </button>
          </nav>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="main-content">
        {/* TOPBAR */}
        <div className="topbar">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage complaints and student issues</p>
          </div>

          <div className="topbar-right">
            <button className="home-btn" onClick={handleHome}>
              Home
            </button>

            <div className="admin-profile">
              <div className="profile-circle">A</div>
              <div>
                <h4>Admin</h4>
                <p>Campus Authority</p>
              </div>
            </div>
          </div>
        </div>

        {/* TOP STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div>
              <h3>{totalComplaints}</h3>
              <p>Total Complaints</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div>
              <h3>{pendingComplaints}</h3>
              <p>Pending</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div>
              <h3>{resolvedComplaints}</h3>
              <p>Resolved</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎓</div>
            <div>
              <h3>{totalStudents}</h3>
              <p>Total Registered Students</p>
            </div>
          </div>
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div className="table-section">
            <h2>Analytics Overview</h2>

            <div className="dashboard-grid">
              <div className="top-category-card">
                <div className="top-category-header">Top Complaint Category</div>
                <div className="top-category-value">{topCategory.name}</div>
                <div className="top-category-sub">Total: {topCategory.value}</div>
              </div>

              <div className="charts-grid">
                <div className="chart-card">
                  <div className="chart-title">Complaint Categories Distribution</div>
                  <div className="chart-body">
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={95}
                          label
                        >
                          {pieData.map((entry, index) => (
                            <Cell
                              key={`cell-${entry.name}`}
                              fill={pieColors[index % pieColors.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="chart-card">
                  <div className="chart-title">Complaint Status Comparison</div>
                  <div className="chart-body">
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <XAxis dataKey="name" stroke="#dc2626" />
                        <YAxis stroke="#dc2626" allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#dc2626" radius={[12, 12, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COMPLAINTS TAB */}
        {activeTab === "complaints" && (
          <div className="table-section">
            <div className="section-header">
              <h2>Recent Complaints</h2>
              <button className="view-btn" onClick={fetchComplaints}>
                Refresh
              </button>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Complaint</th>
                    <th>Student</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {complaints.map((item) => (
                    <tr key={item._id}>
                      <td>{item.title}</td>
                      <td>{item.userId?.fullName || "Unknown"}</td>
                      <td>{item.userId?.department || "General"}</td>

                      <td>
                        <span
                          className={`status ${item.status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`priority ${
                            item.priority === 3
                              ? "high"
                              : item.priority === 2
                              ? "medium"
                              : "low"
                          }`}
                        >
                          {item.priority === 3
                            ? "High"
                            : item.priority === 2
                            ? "Medium"
                            : "Low"}
                        </span>
                      </td>

                      <td>
                        <select
                          className="action-btn"
                          value={item.status}
                          onChange={(e) => updateStatus(item._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* STUDENTS TAB */}
        {activeTab === "students" && (
          <div className="table-section">
            <div className="section-header">
              <h2>Students</h2>
              <button className="view-btn" onClick={fetchStudents}>
                Refresh
              </button>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Total</th>
                    <th>Pending</th>
                    <th>Resolved</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((s) => (
                    <tr key={s._id}>
                      <td>{s.fullName}</td>
                      <td>{s.collegeEmail}</td>
                      <td>{s.department}</td>
                      <td>{s.totalComplaints}</td>
                      <td>{s.pendingComplaints}</td>
                      <td>{s.resolvedComplaints}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

