import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const token = localStorage.getItem("token");

  const API_URL = "http://localhost:5000/api";

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [photo, setPhoto] = useState(null);

  // =========================
  // FETCH PROFILE
  // =========================
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data);
      setFormData(res.data || {});
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // SAVE PROFILE
  // =========================
  const saveProfile = async () => {
    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (photo) {
        data.append("passportPhoto", photo);
      }

      await axios.put(`${API_URL}/users/profile`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile Updated");

      setEditMode(false);
      setPhoto(null);
      fetchProfile();
    } catch (err) {
      console.log(err);
    }
  };

  if (!user) return <h2>Loading...</h2>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        
        {/* LEFT SIDE */}
        <div className="profile-left">
          <img
            src={user?.passportPhoto}
            alt="profile"
            className="profile-image"
          />

          {editMode && (
            <input
              type="file"
              onChange={(e) => setPhoto(e.target.files[0])}
            />
          )}

          <h2>{user.fullName}</h2>
          <p>{user.department}</p>
          <p>Semester {user.semester}</p>

          <span className="role-badge">Student</span>
        </div>

        {/* RIGHT SIDE */}
        <div className="profile-right">
          <div className="profile-top">
            <h1>My Profile</h1>

            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="edit-btn"
              >
                Edit Profile
              </button>
            ) : (
              <div className="btn-group">
                <button onClick={saveProfile} className="save-btn">
                  Save Changes
                </button>

                <button
                  onClick={() => {
                    setEditMode(false);
                    setFormData(user || {});
                  }}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="profile-grid">
            {[
              "fullName",
              "collegeEmail",
              "rollNumber",
              "phone",
              "semester",
              "department",
              "course",
              "branch",
              "hostelStatus",
              "roomNumber",
              "address",
              "fatherName",
              "motherName",
              "mentorName",
              "dob",
              "gender",
            ].map((field) => (
              <div className="info-card" key={field}>
                <label>{field}</label>

                {editMode ? (
                  <input
                    type="text"
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{user[field]}</p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;