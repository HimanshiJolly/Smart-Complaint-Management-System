import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";


function App() {

  const token = localStorage.getItem("token");

  // REDIRECT IF NOT LOGGED IN
  useEffect(() => {
  if (!token) {
    window.location.href = "http://localhost:5174/login";
  }
}, [token]);

  const [activeTab, setActiveTab] =
    useState("dashboard");

  const [complaints, setComplaints] =
    useState([]);
const [students, setStudents] = useState([]);
  const API_URL =
    "http://localhost:5000/api";

  // ==========================================
  // FETCH COMPLAINTS
  // ==========================================

  const fetchComplaints = async () => {

    try {

      const response = await axios.get(
        `${API_URL}/complaints`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComplaints(response.data);

    } catch (error) {

      console.error(error);

    }
  };
  const fetchStudents = async () => {
  try {
    const res = await axios.get(
      `${API_URL}/admin/students`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

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

    const interval = setInterval(() => {

      fetchComplaints();

    }, 3000);

    return () => clearInterval(interval);

  }, []);
  useEffect(() => {
  if (activeTab === "students") {
    fetchStudents();
  }
}, [activeTab]);
useEffect(() => {
  fetchStudents();
}, []);

  // ==========================================
  // UPDATE STATUS
  // ==========================================

  const updateStatus = async (id, status) => {
  try {
    console.log("Updating:", id, status);

    const res = await axios.put(
      `${API_URL}/complaints/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Updated:", res.data);

    fetchComplaints();
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

    window.location.href =
      "http://localhost:5174/login";
  };

  // ==========================================
  // STATS
  // ==========================================

  const totalComplaints =
    complaints.length;

  const pendingComplaints =
    complaints.filter(
      (c) => c.status === "Pending"
    ).length;

  const resolvedComplaints =
    complaints.filter(
      (c) => c.status === "Resolved"
    ).length;

  const urgentComplaints =
    complaints.filter(
      (c) => c.priority === 3
    ).length;

  // ==========================================
  // RETURN
  // ==========================================

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
              className={
                activeTab === "dashboard"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab("dashboard")
              }
            >
              📊 Dashboard
            </button>

            <button
              className={
                activeTab === "complaints"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab("complaints")
              }
            >
              📋 Complaints
            </button>

            <button
              className={
                activeTab === "students"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab("students")
              }
            >
              🎓 Students
            </button>

            <button
              className={
                activeTab === "analytics"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab("analytics")
              }
            >
              📈 Analytics
            </button>

          </nav>

        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </aside>

      {/* MAIN */}
      <main className="main-content">

        {/* TOPBAR */}
        <div className="topbar">

          <div>

            <h1>Admin Dashboard</h1>

            <p>
              Manage complaints and
              student issues
            </p>

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

        {/* TOP STATS */}
        <div className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon">
              📋
            </div>

            <div>

              <h3>
                {totalComplaints}
              </h3>

              <p>
                Total Complaints
              </p>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              ⏳
            </div>

            <div>

              <h3>
                {pendingComplaints}
              </h3>

              <p>Pending</p>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              ✅
            </div>

            <div>

              <h3>
                {resolvedComplaints}
              </h3>

              <p>Resolved</p>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              🚨
            </div>

            <div>

              <h3>
                {urgentComplaints}
              </h3>

              <p>Urgent Cases</p>

            </div>

          </div>

        </div>

        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (

          <div className="table-section">

            <h2>
              Dashboard Overview
            </h2>

            <div className="dashboard-box">

              <p>
                Welcome to the
                Resolvio Admin Panel.
              </p>

              <p>
                Monitor complaints,
                resolve issues,
                and manage campus
                services efficiently.
              </p>

            </div>

          </div>

        )}

        {/* COMPLAINTS TAB */}
        {activeTab === "complaints" && (

          <div className="table-section">

            <div className="section-header">

              <h2>
                Recent Complaints
              </h2>

              <button
                className="view-btn"
                onClick={fetchComplaints}
              >
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

                      <td>
                        {item.title}
                      </td>

                      <td>
                        {item.userId
                          ?.fullName ||
                          "Unknown"}
                      </td>

                      <td>
                        {item.userId
                          ?.department ||
                          "General"}
                      </td>

                      <td>

                        <span
                          className={`status ${item.status
                            .toLowerCase()
                            .replace(
                              " ",
                              "-"
                            )}`}
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
                          onChange={(e) =>
                            updateStatus(
                              item._id,
                              e.target.value
                            )
                          }
                        >

                          <option value="Pending">
                            Pending
                          </option>

                          <option value="In Progress">
                            In Progress
                          </option>

                          <option value="Resolved">
                            Resolved
                          </option>

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
        {/* ANALYTICS TAB */}
        {activeTab === "analytics" && (

          <div className="table-section">

            <h2>
              Analytics Section
            </h2>

            <p>
              Complaint analytics
              and charts coming soon.
            </p>

          </div>

        )}

      </main>

    </div>
  );
}

export default App;