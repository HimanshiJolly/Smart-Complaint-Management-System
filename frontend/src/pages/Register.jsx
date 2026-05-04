import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import './Register.css';

const Register = () => {

  const courseBranches = {
    "B.Tech": ["CSE", "ECE", "ME", "CE", "EEE"],
    "MBA": ["Finance", "Marketing", "HR"],
    "BCA": ["General", "AI", "Data Science"]
  };

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    enrollmentNo: '',
    course: '',
    branch: '',
    year: '',
    section: '',
    phone: '',
    password: '',
    confirmPassword: '',
    hostel: 'day',
    roomNumber: '',
    photo: null
  });

  const [idCard, setIdCard] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
const validateStep1 = () => {
  const { name, email, phone, enrollmentNo, course, branch, year } = formData;

  if (!name.trim()) return "Name is required";

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return "Enter valid email";
  }

  if (!/^\d{10}$/.test(phone)) {
    return "Phone must be exactly 10 digits";
  }

  if (!/^\d{10}$/.test(enrollmentNo)) {
    return "Enrollment must be exactly 10 digits (numbers only)";
  }

  if (!course) return "Select course";
  if (!branch) return "Select branch";
  if (!year) return "Select year";

  return "";
};

const validateStep2 = () => {
  const { password, confirmPassword } = formData;

  if (!password) return "Password required";

  if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/.test(password)) {
    return "Password must contain uppercase, number & special character";
  }

  if (!confirmPassword) return "Confirm password required";

  if (password !== confirmPassword) {
    return "Passwords do not match";
  }

  return "";
};

/* ❌ REMOVED validateFields (duplicate & unnecessary) */

const getPasswordStrength = (password) => {
  if (!password) return 0;

  let score = 0;

  // 1. Length (very smooth scaling)
  if (password.length >= 6) score += 20;
  if (password.length >= 8) score += 10;

  // 2. Uppercase
  if (/[A-Z]/.test(password)) score += 20;

  // 3. Numbers
  if (/[0-9]/.test(password)) score += 20;

  // 4. Special characters
  if (/[@$!%*?&]/.test(password)) score += 20;

  // 5. Extra bonus (not harsh)
  if (password.length >= 12) score += 10;

  return Math.min(score, 100);
};
const getStrengthClass = (score) => {
  if (score === 0) return "";
  if (score <= 30) return "strength-1";
  if (score <= 60) return "strength-2";
  if (score <= 80) return "strength-3";
  return "strength-4";
};
// ================= PROGRESS LOGIC (VALID DATA BASED) =================
const getProgress = () => {
  let progress = 0;

  if (formData.name.trim()) progress += 10;

  if (/^\S+@\S+\.\S+$/.test(formData.email)) progress += 10;

  if (/^\d{10}$/.test(formData.phone)) progress += 10;

  if (/^\d{10}$/.test(formData.enrollmentNo)) progress += 10;

  if (formData.course) progress += 10;

  if (formData.branch) progress += 10;

  if (formData.year) progress += 10;

  if (
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/.test(formData.password)
  ) {
    progress += 10;
  }

  if (
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword
  ) {
    progress += 20;
  }

  return progress;
};

const progress = getProgress();
  // ================= HANDLERS =================
  const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
  setError(""); // 👈 clear error when typing
};

  const handleFileChange = (e) => {
    setIdCard(e.target.files[0]);
  };

  const handlePhotoChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errMsgStep1 = validateStep1();
const errMsgStep2 = validateStep2();

if (errMsgStep1 || errMsgStep2) {
  return setError(errMsgStep1 || errMsgStep2);
}

    if (progress < 100) {
      return setError("Please complete all required fields");
    }

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });

      if (idCard) data.append("idCard", idCard);

      await API.post('/auth/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Registration successful!');
      navigate('/login');

    } catch (err) {
  console.log("FULL ERROR:", err);  // 👈 ADD THIS
  console.log("RESPONSE:", err.response); // 👈 ADD THIS

  setError(
    err.response?.data?.message ||
    err.message ||
    "Registration failed"
  );
}
  };

  return (
    <div className="register-container">
      <div className="register-card">

        <h2>Student Registration</h2>

        {/* ===== Progress Bar ===== */}
        <div className="progress-wrapper">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="progress-text">{progress}% Completed</p>
        </div>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>

          {/* ================= STEP 1 ================= */}
          {step === 1 && (
            <>
              <div className="input-group full-width">
                <input name="name" placeholder="Full Name" onChange={handleChange} value={formData.name} required />
              </div>

              <div className="input-group full-width">
                <input name="email" placeholder="Email" onChange={handleChange} value={formData.email} required />
              </div>

              <div className="input-group full-width">
                <input name="enrollmentNo" placeholder="Enrollment Number" onChange={handleChange} value={formData.enrollmentNo}required />
              </div>

              <div className="input-group full-width">
                <input name="phone" placeholder="Phone Number" onChange={handleChange} value={formData.phone} required />
              </div>

              <div className="input-group">
                <select name="course" onChange={handleChange} value={formData.course} required>
                  <option value="">Course</option>
                  {Object.keys(courseBranches).map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <select name="branch" onChange={handleChange} value={formData.branch} required>
                  <option value="">Branch</option>
                  {courseBranches[formData.course]?.map((b, i) => (
                    <option key={i} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <select name="year" onChange={handleChange} value={formData.year} required>
                  <option value="">Year</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                </select>
              </div>

              <div className="input-group">
                <select name="hostel" onChange={handleChange} value={formData.hostel} required>
                  <option value="day">Day Scholar</option>
                  <option value="hostel">Hostel</option>
                </select>
              </div>

              {formData.hostel === "hostel" && (
                <div className="input-group">
                  <input name="roomNumber" placeholder="Room Number" onChange={handleChange} value={formData.roomNumber} required />
                </div>
              )}
            </>
          )}

          {/* ================= STEP 2 ================= */}
          {step === 2 && (
            <>
              <div className="input-group full-width">
                <label>ID Proof</label>
                <input type="file" onChange={handleFileChange} />
              </div>

              <div className="input-group full-width">
                <label>Passport Photo</label>
                <input type="file" onChange={handlePhotoChange} />
              </div>

              <div className="input-group full-width" style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  required
                />
                <div className="strength-meter">
  <div
  className={`strength-bar ${getStrengthClass(getPasswordStrength(formData.password))}`}
/>
</div>
<p className="strength-text">
  {(() => {
    const score = getPasswordStrength(formData.password);

    if (score === 0) return "";
    if (score <= 30) return "Weak";
    if (score <= 60) return "Medium";
    if (score <= 80) return "Good";
    return "Strong";
  })()}
</p>
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '10px',
                    cursor: 'pointer'
                  }}
                >
                  👁️
                </span>
              </div>

              <div className="input-group full-width">
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          {/* ================= BUTTONS ================= */}
          <div className="full-width" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            {step > 1 && (
              <button type="button" onClick={() => setStep(step - 1)}>
                Back
              </button>
            )}

            {step < 2 ? (
              <button
  type="button"
  onClick={() => {
    const err = validateStep1();
    if (err) {
      setError(err);
    } else {
      setError("");
      setStep(2);
    }
  }}
>
  Next
</button>
            ) : (
              <button
                type="submit"
                className="register-button"
                disabled={progress < 100}
              >
                Register
              </button>
            )}
          </div>

          <p className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Register;