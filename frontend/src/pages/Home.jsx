import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [newComplaint, setNewComplaint] = useState({ title: '', description: '', priority: 1 });
  const [urgentComplaint, setUrgentComplaint] = useState(null);

  // Fetch complaints whenever the page loads (if the user is logged in)
  useEffect(() => {
    if (user) {
      fetchComplaints();
    }
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
      await API.post('/complaints', newComplaint);
      setNewComplaint({ title: '', description: '', priority: 1 }); // Clear form
      fetchComplaints(); // Refresh the list
    } catch (error) {
      console.error("Error submitting complaint", error);
    }
  };

  // ADMIN FEATURE: Update Status
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await API.put(`/complaints/${id}`, { status: newStatus });
      fetchComplaints(); // Refresh the list
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

  // If not logged in, show a welcome message
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
            ⚡ Get Next Urgent Task (O(log N) Max Heap)
          </button>
          
          {urgentComplaint && (
            <div style={{ marginTop: '15px', padding: '15px', background: 'white', borderLeft: '5px solid #d32f2f' }}>
              <h4>🚨 {urgentComplaint.title} (Priority: {urgentComplaint.priority})</h4>
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
            <textarea placeholder="Describe your issue..." rows="4" value={newComplaint.description} onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })} required style={{ padding: '8px' }}/>
            <select value={newComplaint.priority} onChange={(e) => setNewComplaint({ ...newComplaint, priority: Number(e.target.value) })} style={{ padding: '8px' }}>
              <option value={1}>Low Priority</option>
              <option value={2}>Medium Priority</option>
              <option value={3}>High Priority</option>
            </select>
            <button type="submit" style={{ padding: '10px', background: '#4caf50', color: 'white', border: 'none', cursor: 'pointer' }}>Submit Complaint</button>
          </form>
        </div>
      )}

      {/* Complaints List */}
      <h3>{user.role === 'admin' ? 'All System Complaints' : 'Your Complaints'}</h3>
      {complaints.length === 0 ? <p>No complaints found.</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {complaints.map(complaint => (
            <li key={complaint._id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: '#fff' }}>
              <div>
                <h4 style={{ margin: '0 0 10px 0' }}>{complaint.title} <small style={{ color: 'gray', fontWeight: 'normal' }}>(Priority: {complaint.priority})</small></h4>
                <p style={{ margin: '0 0 10px 0' }}>{complaint.description}</p>
                <p style={{ margin: 0 }}><strong>Status:</strong> <span style={{ fontWeight: 'bold', color: complaint.status === 'Pending' ? 'orange' : complaint.status === 'In Progress' ? '#1976d2' : 'green' }}>{complaint.status}</span></p>
              </div>
              
              {/* Admin Dropdown to Change Status */}
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