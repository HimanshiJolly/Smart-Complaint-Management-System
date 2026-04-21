import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import './Home.css'; // Ensure this is imported

const Home = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [newComplaint, setNewComplaint] = useState({ title: '', description: '', category: 'Cleanliness' });
  const [imageFile, setImageFile] = useState(null);
  const [urgentComplaint, setUrgentComplaint] = useState(null);

  useEffect(() => {
    if (user) fetchComplaints();
  }, [user]);

  const fetchComplaints = async () => {
    try {
      const response = await API.get('/complaints');
      setComplaints(response.data);
    } catch (error) {
      console.error("Error fetching complaints", error);
    }
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', newComplaint.title);
      formData.append('description', newComplaint.description);
      formData.append('category', newComplaint.category);
      if (imageFile) formData.append('image', imageFile);

      await API.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setNewComplaint({ title: '', description: '', category: 'Cleanliness' });
      setImageFile(null);
      document.getElementById('file-upload').value = ""; 
      fetchComplaints();
    } catch (error) {
      console.error("Error submitting complaint", error);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await API.put(`/complaints/${id}`, { status: newStatus });
      fetchComplaints();
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const fetchUrgent = async () => {
    try {
      const response = await API.get('/complaints/urgent');
      if (response.data.complaint) {
        setUrgentComplaint(response.data.complaint);
      } else {
        alert(response.data.message);
        setUrgentComplaint(null);
      }
    } catch (error) {
      console.error("Error fetching urgent complaint", error);
    }
  };

  if (!user) {
    return (
      <div className="auth-prompt">
        <h2>Welcome to Resolvio</h2>
        <p>Please <Link to="/login">Login</Link> or <Link to="/register">Register</Link> to continue.</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      
      {/* Admin Section */}
      {user.role === 'admin' && (
        <section className="admin-panel card">
          <div className="admin-header">
            <h3>Admin Dashboard</h3>
            <button className="btn-urgent" onClick={fetchUrgent}>
              ⚡ Get Next Urgent Task
            </button>
          </div>
          
          {urgentComplaint && (
            <div className="urgent-alert">
              <div className="urgent-info">
                <h4>🚨 {urgentComplaint.title}</h4>
                <span className="badge-priority">Priority: {urgentComplaint.priority}</span>
                <p>{urgentComplaint.description}</p>
              </div>
              <button className="btn-action" onClick={() => handleStatusUpdate(urgentComplaint._id, 'In Progress')}>
                Start Work
              </button>
            </div>
          )}
        </section>
      )}

      {/* User Submission Section */}
      {user.role === 'user' && (
        <section className="submission-form card">
          <h3>Submit a New Complaint</h3>
          <form onSubmit={handleComplaintSubmit} className="grid-form">
            <div className="input-group">
              <label>Complaint Title</label>
              <input 
                type="text" 
                placeholder="What is the issue?" 
                value={newComplaint.title} 
                onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })} 
                required 
              />
            </div>
            
            <div className="input-group">
              <label>Category</label>
              <select value={newComplaint.category} onChange={(e) => setNewComplaint({ ...newComplaint, category: e.target.value })}>
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
                placeholder="Provide details about the problem..." 
                rows="4" 
                value={newComplaint.description} 
                onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })} 
                required 
              />
            </div>
            
            <div className="input-group full-width file-input-wrapper">
              <label>Attach Image (Optional)</label>
              <input id="file-upload" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
            </div>

            <button type="submit" className="btn-submit">Submit Complaint</button>
          </form>
        </section>
      )}

      {/* List Section */}
      <section className="complaints-list">
        <h3>{user.role === 'admin' ? 'System Overview' : 'Your History'}</h3>
        {complaints.length === 0 ? <p className="empty-msg">No complaints recorded yet.</p> : (
          <div className="complaint-grid">
            {complaints.map(complaint => (
              <div key={complaint._id} className="complaint-card card">
                {complaint.imageUrl && (
                  <div className="card-image">
                    <img src={`http://localhost:5000${complaint.imageUrl}`} alt="Report" />
                  </div>
                )}
                <div className="card-content">
                  <div className="card-header">
                    <h4>{complaint.title}</h4>
                    <span className="category-tag">{complaint.category}</span>
                  </div>
                  <p className="description">{complaint.description}</p>
                  <div className="card-footer">
                    <span className={`status-pill ${complaint.status.toLowerCase().replace(' ', '-')}`}>
                      {complaint.status}
                    </span>
                    
                    {user.role === 'admin' && (
                      <select 
                        className="status-updater"
                        value={complaint.status} 
                        onChange={(e) => handleStatusUpdate(complaint._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
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