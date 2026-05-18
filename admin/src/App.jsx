import { useState } from "react";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const stats = [
    {
      title: "Total Complaints",
      value: "1,248",
      icon: "📋",
    },
    {
      title: "Pending",
      value: "126",
      icon: "⏳",
    },
    {
      title: "Resolved",
      value: "982",
      icon: "✅",
    },
    {
      title: "Urgent Cases",
      value: "18",
      icon: "🚨",
    },
  ];

  const complaints = [
    {
      title: "Hostel Washroom Leakage",
      student: "Aman Sharma",
      department: "CSE",
      status: "Pending",
      priority: "High",
    },
    {
      title: "WiFi Not Working",
      student: "Priya Verma",
      department: "ECE",
      status: "In Progress",
      priority: "Medium",
    },
    {
      title: "Library AC Issue",
      student: "Rahul Mehta",
      department: "BBA",
      status: "Resolved",
      priority: "Low",
    },
  ];

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">
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

          <button
            className={activeTab === "analytics" ? "active" : ""}
            onClick={() => setActiveTab("analytics")}
          >
            📈 Analytics
          </button>

          <button
            className={activeTab === "settings" ? "active" : ""}
            onClick={() => setActiveTab("settings")}
          >
            ⚙ Settings
          </button>
        </nav>

        <button className="logout-btn">
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

          <div className="admin-profile">
            <div className="profile-circle">
              A
            </div>

            <div>
              <h4>Admin</h4>
              <p>Campus Authority</p>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="stats-grid">
          {stats.map((item, index) => (
            <div className="stat-card" key={index}>
              <div className="stat-icon">{item.icon}</div>

              <div>
                <h3>{item.value}</h3>
                <p>{item.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* RECENT COMPLAINTS */}
        <div className="table-section">

          <div className="section-header">
            <h2>Recent Complaints</h2>

            <button className="view-btn">
              View All
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
                {complaints.map((item, index) => (
                  <tr key={index}>
                    <td>{item.title}</td>
                    <td>{item.student}</td>
                    <td>{item.department}</td>

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
                        className={`priority ${item.priority.toLowerCase()}`}
                      >
                        {item.priority}
                      </span>
                    </td>

                    <td>
                      <button className="action-btn">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;