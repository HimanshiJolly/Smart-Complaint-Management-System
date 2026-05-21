import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:5000/api";

  const [user, setUser] = useState(null);

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
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!user) return <h2>Loading...</h2>;

  return (
    <div className="profile-page">
      <div className="profile-card">

        {/* LEFT SIDE */}
        <div className="profile-left">

          {/* DEFAULT PROFILE IMAGE */}
          <img
            src="https://static.vecteezy.com/system/resources/previews/022/123/337/original/user-icon-profile-icon-account-icon-login-sign-line-vector.jpg"
            alt="profile"
            className="profile-image"
          />

          <h2>{user?.fullName}</h2>
          <p>{user?.department}</p>
          <p>Semester {user?.semester}</p>

          <span className="role-badge">Student</span>
        </div>

        {/* RIGHT SIDE */}
        <div className="profile-right">

          <div className="profile-top">
            <h1>My Profile</h1>
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
                <p>{user?.[field]}</p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}

export default Profile;