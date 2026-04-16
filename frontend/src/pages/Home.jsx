import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [newComplaint, setNewComplaint] = useState({ title: '', description: '', category: 'Cleanliness' });
  const [imageFile, setImageFile] = useState(null); // State for the photo
  const [urgentComplaint, setUrgentComplaint] = useState(null); // State for Admin DSA feature

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
      // When uploading files, we MUST use FormData instead of standard JSON
      const formData = new FormData();
      formData.append('title', newComplaint.title);
      formData.append('description', newComplaint.description);
      formData.append('category', newComplaint.category);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await API.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Clear form
      setNewComplaint({ title: '', description: '', category: 'Cleanliness' });
      setImageFile(null);
      document.getElementById('file-upload').value = ""; // Clear file input UI
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

  // ADMIN FEATURE (DSA): Fetch Most Urgent Complaint
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
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Welcome to the Smart Complaint System</h2>
        <p>Please <Link to="/login">Login</Link> or <Link to="/register">Register</Link> to continue.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>

      {/* Admin Dashboard Controls */}
      {user.role === 'admin' && (
        <div style={{ marginBottom: '20px', padding: '15px', background: '#ffebee', borderRadius: '8px' }}>
          <h3>Admin Dashboard</h3>
          <button onClick={fetchUrgent} style={{ padding: '10px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            ⚡ Get Next Urgent Task (Priority Queue)
          </button>
          
          {urgentComplaint && (
            <div style={{ marginTop: '15px', padding: '15px', background: 'white', borderLeft: '5px solid #d32f2f' }}>
              <h4>🚨 {urgentComplaint.title} <small>(Priority Level: {urgentComplaint.priority})</small></h4>
              <p>{urgentComplaint.description}</p>
              <button onClick={() => handleStatusUpdate(urgentComplaint._id, 'In Progress')} style={{ padding: '5px 10px', cursor: 'pointer', background: '#1976d2', color: 'white', border: 'none' }}>
                Start Working on This
              </button>
            </div>
          )}
        </div>
      )}

      {/* User Submission Form */}
      {user.role === 'user' && (
        <div style={{ marginBottom: '30px', padding: '20px', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h3>Submit a New Complaint</h3>
          <form onSubmit={handleComplaintSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="Complaint Title" value={newComplaint.title} onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })} required style={{ padding: '8px' }}/>
            
            <select value={newComplaint.category} onChange={(e) => setNewComplaint({ ...newComplaint, category: e.target.value })} style={{ padding: '8px' }}>
              <option value="Cleanliness">Cleanliness</option>
              <option value="Management">Management</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Food/Hostel">Food / Hostel</option>
              <option value="Other">Other</option>
            </select>

            <textarea placeholder="Describe your issue..." rows="4" value={newComplaint.description} onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })} required style={{ padding: '8px' }}/>
            
            {/* FILE UPLOAD INPUT */}
            <input id="file-upload" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} style={{ padding: '8px' }} />

            <button type="submit" style={{ padding: '10px', background: '#4caf50', color: 'white', border: 'none', cursor: 'pointer' }}>Submit Complaint</button>
          </form>
        </div>
      )}

      {/* Complaints List */}
      <h3>{user.role === 'admin' ? 'All System Complaints' : 'Your Complaints'}</h3>
      {complaints.length === 0 ? <p>No complaints found.</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {complaints.map(complaint => (
            <li key={complaint._id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '5px', display: 'flex', gap: '15px', alignItems: 'flex-start', background: '#fff' }}>
              
              {/* DISPLAY IMAGE IF IT EXISTS */}
              {complaint.imageUrl && (
                <img src={`http://localhost:5000${complaint.imageUrl}`} alt="Complaint" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
              )}

              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 10px 0' }}>{complaint.title} <span style={{ background: '#eee', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', color: '#555', marginLeft: '10px' }}>{complaint.category}</span></h4>
                <p style={{ margin: '0 0 10px 0' }}>{complaint.description}</p>
                <p style={{ margin: 0 }}><strong>Status:</strong> <span style={{ fontWeight: 'bold', color: complaint.status === 'Pending' ? 'orange' : complaint.status === 'In Progress' ? '#1976d2' : 'green' }}>{complaint.status}</span></p>
              </div>
              
              {user.role === 'admin' && (
                <select 
                  value={complaint.status} 
                  onChange={(e) => handleStatusUpdate(complaint._id, e.target.value)}
                  style={{ padding: '5px', borderRadius: '4px' }}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;