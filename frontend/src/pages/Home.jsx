import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import "./Home.css";

// ---------------- Landing Page ----------------
// ---------------- Landing Page ----------------
const LandingPage = () => {

  const navigate = useNavigate();

  // SCROLL FUNCTIONS
  const scrollToAbout = () => {

    const aboutSection = document.getElementById("about-section");

    if (aboutSection) {
      aboutSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const scrollToFeatures = () => {

    const featuresSection = document.getElementById("features-section");

    if (featuresSection) {
      featuresSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (

    <div className="landing">

      {/* HERO */}
      <section className="hero">

        {/* LEFT */}
        <div className="hero-text">

          <span className="hero-badge">
            Smart Campus Complaint Platform
          </span>

          <h1 className="main-title">Resolvio</h1>

          <h2 className="sub-title">
            Smart Complaint System <br />
            <span>for College Students</span>
          </h2>

          <p className="hero-desc">
            Raise campus issues easily, track progress in real-time,
            and help your university resolve problems faster and smarter.
          </p>

          <div className="landing-buttons">

            <button
              onClick={() => navigate("/login")}
              className="btn-submit"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              className="btn-secondary"
            >
              Register
            </button>

          </div>

        </div>

        {/* RIGHT */}
        <div className="hero-slider">

          <img
            src="https://assets.api.gamma.app/eon8uhhu3pco7xo/screenshots/akl2525s6amkn29/r4hay7p1qqxnn6t/slide/4xRJhgC9EZ4FAIxX3fr1HZ2wh7Y"
            alt="campus"
          />

          <img
            src="https://rocketflow.in/resources/blog/images/complaint-management-banner.jpeg"
            alt="complaints"
          />

          <img
            src="https://inclusion.syr.edu/wp-content/uploads/2016/12/Complaints-768x513.jpg"
            alt="students"
          />

        </div>

      </section>

           {/* ABOUT */}
      <section
        id="about-section"
        className="about-section"
      >

        <div className="section-heading">

          <h2>What is this platform about?</h2>

          <p>
            Resolvio helps students report campus issues related to
            cleanliness, hostel facilities, infrastructure,
            food quality, administration, and more.
          </p>

        </div>

        {/* FEATURES */}
        <div className="features">

          <div className="feature-card">

            <div className="icon">📢</div>

            <h3>Easy Complaint Submission</h3>

            <p>
              Submit complaints quickly with descriptions
              and supporting images.
            </p>

          </div>

          <div className="feature-card">

            <div className="icon">📊</div>

            <h3>Track Progress</h3>

            <p>
              Monitor complaint status and updates
              in real-time with ease.
            </p>

          </div>

          <div className="feature-card">

            <div className="icon">⚡</div>

            <h3>Faster Resolution</h3>

            <p>
              Helps university administration resolve
              issues more efficiently.
            </p>

          </div>

        </div>

        {/* EXTRA */}
        <div
          id="features-section"
          className="extra-section"
        >

          <h2>Why Choose Resolvio?</h2>

          <div className="extra-grid">

            <div>

              <div className="icon">🎯</div>

              <h4>Student-Centered</h4>

              <p>
                Built specifically for students
                and university environments.
              </p>

            </div>

            <div>

              <div className="icon">🔐</div>

              <h4>Secure & Transparent</h4>

              <p>
                Every complaint is tracked with
                visibility and accountability.
              </p>

            </div>

            <div>

              <div className="icon">📈</div>

              <h4>Data Insights</h4>

              <p>
                Analyze complaint trends and
                improve campus management.
              </p>

            </div>

            <div>

              <div className="icon">⚙️</div>

              <h4>Efficient Workflow</h4>

              <p>
                Prioritize urgent complaints and
                improve resolution efficiency.
              </p>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
};
// ---------------- MAIN HOME ----------------
const Home = () => {
  const { user } = useContext(AuthContext);

  const [complaints, setComplaints] = useState([]);

  const [newComplaint, setNewComplaint] = useState({
    title: "",
    description: "",
    category: "Cleanliness",
  });

  const [imageFile, setImageFile] = useState(null);

  const [urgentComplaint, setUrgentComplaint] = useState(null);

  useEffect(() => {
    if (user) fetchComplaints();
  }, [user]);

  const fetchComplaints = async () => {
    try {
      const response = await API.get("/complaints");
      setComplaints(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", newComplaint.title);
      formData.append("description", newComplaint.description);
      formData.append("category", newComplaint.category);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await API.post("/complaints", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setNewComplaint({
        title: "",
        description: "",
        category: "Cleanliness",
      });

      setImageFile(null);

      document.getElementById("file-upload").value = "";

      fetchComplaints();
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await API.put(`/complaints/${id}`, {
        status: newStatus,
      });

      fetchComplaints();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUrgent = async () => {
    try {
      const response = await API.get("/complaints/urgent");

      if (response.data.complaint) {
        setUrgentComplaint(response.data.complaint);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClear = async (id) => {
    try {
      await API.put(`/complaints/clear/${id}`);

      setComplaints((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, isClearedByUser: true } : c
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return <LandingPage />;
  }

  const visibleComplaints = complaints.filter(
    (c) => !(user.role === "user" && c.isClearedByUser === true)
  );

  return (
    <div className="home-container">

      {/* ADMIN */}
      {user.role === "admin" && (
        <section className="admin-panel card">
          <div className="admin-header">
            <h3>Admin Dashboard</h3>

            <button className="btn-urgent" onClick={fetchUrgent}>
              ⚡ Get Next Urgent Task
            </button>
          </div>

          {urgentComplaint && (
            <div className="urgent-alert">
              <div>
                <h4>🚨 {urgentComplaint.title}</h4>

                <p>{urgentComplaint.description}</p>

                <span className="badge-priority">
                  Priority: {urgentComplaint.priority}
                </span>
              </div>

              <button
                className="btn-submit"
                onClick={() =>
                  handleStatusUpdate(
                    urgentComplaint._id,
                    "In Progress"
                  )
                }
              >
                Start Work
              </button>
            </div>
          )}
        </section>
      )}

      {/* USER FORM */}
      {user.role === "user" && (
        <section className="submission-form card">
          <h3>Submit a New Complaint</h3>

          <form onSubmit={handleComplaintSubmit} className="grid-form">

            <div className="input-group">
              <label>Complaint Title</label>

              <input
                type="text"
                placeholder="What is the issue?"
                value={newComplaint.title}
                onChange={(e) =>
                  setNewComplaint({
                    ...newComplaint,
                    title: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="input-group">
              <label>Category</label>

              <select
                value={newComplaint.category}
                onChange={(e) =>
                  setNewComplaint({
                    ...newComplaint,
                    category: e.target.value,
                  })
                }
              >
                <option value="Cleanliness">Cleanliness</option>
                <option value="Management">Management</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Food/Hostel">Food / Hostel</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="input-group full-width">
              <label>Description</label>

              <textarea
                rows="4"
                placeholder="Provide details about the issue..."
                value={newComplaint.description}
                onChange={(e) =>
                  setNewComplaint({
                    ...newComplaint,
                    description: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="input-group full-width">
              <label>Attach Image (Optional)</label>

              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>

            <button type="submit" className="btn-submit">
              Submit Complaint
            </button>
          </form>
        </section>
      )}

      {/* LIST */}
      <section className="complaints-list">

        <h3>
          {user.role === "admin"
            ? "System Overview"
            : "Your Complaint History"}
        </h3>

        {visibleComplaints.length === 0 ? (
          <p className="empty-msg">No complaints available.</p>
        ) : (
          <div className="complaint-grid">

            {visibleComplaints.map((complaint) => (
              <div key={complaint._id} className="complaint-card">

                {complaint.imageUrl && (
                  <div className="card-image">
                    <img
                      src={`http://localhost:5000${complaint.imageUrl}`}
                      alt="complaint"
                    />
                  </div>
                )}

                <div className="card-content">

                  <div className="card-header">
                    <h4>{complaint.title}</h4>

                    <span className="category-tag">
                      {complaint.category}
                    </span>
                  </div>

                  <p className="description">
                    {complaint.description}
                  </p>
                  {complaint.imageUrl && (
  <img
    src={complaint.imageUrl}
    alt="complaint"
    className="complaint-image"
  />
)}

                  <div className="card-footer">

                    <span
                      className={`status-pill ${complaint.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {complaint.status}
                    </span>

                    {user.role === "admin" && (
                      <select
                        className="status-updater"
                        value={complaint.status}
                        onChange={(e) =>
                          handleStatusUpdate(
                            complaint._id,
                            e.target.value
                          )
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">
                          In Progress
                        </option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    )}

                    {user.role === "user" &&
                      complaint.status === "Resolved" && (
                        <button
                          className="btn-delete"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Mark this complaint as cleared?"
                              )
                            ) {
                              handleClear(complaint._id);
                            }
                          }}
                        >
                          Clear
                        </button>
                      )}
                  </div>
                </div>
              </div>
            ))}

          </div>
        )}
      </section>
    </div>
  );
};

export default Home;