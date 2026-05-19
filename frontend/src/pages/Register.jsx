import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import './Register.css';

const Register = () => {

  const navigate = useNavigate();

  const [error, setError] = useState('');

  const [passportPhoto, setPassportPhoto] = useState(null);
  const [idProof, setIdProof] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    collegeEmail: '',
    rollNumber: '',
    phone: '',
    course: '',
    branch: '',
    department: '',
    semester: '',
    address: '',
    fatherName: '',
    motherName: '',
    mentorName: '',
    dob: '',
    gender: '',
    accommodation: 'Day Scholar',
    hostelName: '',
    roomNumber: '',
    password: '',
    role: 'user'
  });

  const branchOptions = {
    BTech: ['CSE', 'ECE', 'ME', 'Civil', 'AI & DS'],
    BCA: ['General', 'Cloud Computing', 'AI'],
    BBA: ['Finance', 'Marketing', 'HR'],
    Law: ['Corporate Law', 'Criminal Law'],
    Pharmacy: ['Pharmacology', 'Pharmaceutics'],
    Literature: ['English', 'Hindi', 'Punjabi'],
    Psychology: ['Clinical', 'Counselling'],
    Hospitality: ['Hotel Management', 'Tourism']
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const submitData = new FormData();

      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key]);
      });

      if (passportPhoto) {
        submitData.append('passportPhoto', passportPhoto);
      }

      if (idProof) {
        submitData.append('idProof', idProof);
      }

      await API.post('/auth/register/user', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Registration Successful');
      navigate('/login');

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="register-container">

      <div className="register-card">

        <div className="register-header">
          <h2>Student Registration Form</h2>
          <p>Create your university complaint portal account</p>
        </div>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit} className="register-form-grid">

          {/* PERSONAL INFO */}
          <div className="section-title full-width">
            <h3>Personal Information</h3>
          </div>

          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter full name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>College Email</label>
            <input
              type="email"
              name="collegeEmail"
              placeholder="college@example.com"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="9876543210"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Gender</label>
            <select name="gender" onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="input-group full-width">
            <label>Home Address</label>
            <textarea
              name="address"
              rows="3"
              placeholder="Enter home address"
              onChange={handleChange}
              required
            />
          </div>

          {/* ACADEMIC INFO */}
          <div className="section-title full-width">
            <h3>Academic Information</h3>
          </div>

          <div className="input-group">
            <label>Roll Number</label>
            <input
              type="text"
              name="rollNumber"
              placeholder="22BCS123"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Department</label>
            <select name="department" onChange={handleChange} required>
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Management">Management</option>
              <option value="Law">Law</option>
              <option value="Pharmacy">Pharmacy</option>
              <option value="Literature">Literature</option>
              <option value="Psychology">Psychology</option>
              <option value="Hospitality">Hospitality</option>
            </select>
          </div>

          <div className="input-group">
            <label>Course</label>
            <select name="course" onChange={handleChange} required>
              <option value="">Select Course</option>
              <option value="BTech">BTech</option>
              <option value="BCA">BCA</option>
              <option value="BBA">BBA</option>
              <option value="Law">Law</option>
              <option value="Pharmacy">Pharmacy</option>
              <option value="Literature">Literature</option>
              <option value="Psychology">Psychology</option>
              <option value="Hospitality">Hospitality</option>
            </select>
          </div>

          <div className="input-group">
            <label>Branch / Specialization</label>
            <select name="branch" onChange={handleChange} required>
              <option value="">Select Branch</option>

              {formData.course &&
                branchOptions[formData.course]?.map((branch, index) => (
                  <option key={index} value={branch}>
                    {branch}
                  </option>
                ))}
            </select>
          </div>

          <div className="input-group">
            <label>Semester / Year</label>
            <input
              type="text"
              name="semester"
              placeholder="6th Semester"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Mentor Name (Optional)</label>
            <input
              type="text"
              name="mentorName"
              placeholder="Mentor Name"
              onChange={handleChange}
            />
          </div>

          {/* FAMILY DETAILS */}
          <div className="section-title full-width">
            <h3>Family Details</h3>
          </div>

          <div className="input-group">
            <label>Father Name</label>
            <input
              type="text"
              name="fatherName"
              placeholder="Father Name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Mother Name</label>
            <input
              type="text"
              name="motherName"
              placeholder="Mother Name"
              onChange={handleChange}
              required
            />
          </div>

          {/* HOSTEL INFO */}
          <div className="section-title full-width">
            <h3>Accommodation Details</h3>
          </div>

          <div className="input-group">
            <label>Accommodation Type</label>
            <select name="accommodation" onChange={handleChange}>
              <option value="Day Scholar">Day Scholar</option>
              <option value="Hosteller">Hosteller</option>
            </select>
          </div>

          {formData.accommodation === 'Hosteller' && (
            <>
              <div className="input-group">
                <label>Hostel Name</label>
                <input
                  type="text"
                  name="hostelName"
                  placeholder="Hostel Name"
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>Room Number</label>
                <input
                  type="text"
                  name="roomNumber"
                  placeholder="Room Number"
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {/* UPLOADS */}
          <div className="section-title full-width">
            <h3>Verification Documents</h3>
          </div>

          <div className="input-group">
            <label>Passport Size Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPassportPhoto(e.target.files[0])}
              required
            />
          </div>

          <div className="input-group">
            <label>ID Proof Upload</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setIdProof(e.target.files[0])}
              required
            />
          </div>

          <div className="input-group full-width">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create Password"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="register-button full-width">
            Create Account
          </button>

        </form>

        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>

      </div>

    </div>
  );
};

export default Register;


