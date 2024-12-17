import React, { useState, useEffect } from 'react';
import { Users, FileText, Shield, ShieldOff, UserX, UserCheck, Eye, EyeOff } from 'lucide-react';
import './AdminDashboard.css';
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'reviews') {
      fetchReviews();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${apiUrl}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${apiUrl}/admin/reviews`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const toggleUserAdminStatus = async (userId, currentAdminStatus) => {
    try {
      const response = await fetch(`${apiUrl}/admin/users/${userId}/admin`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ is_admin: !currentAdminStatus })
      });
      if (response.ok) {
        setUsers(users.map(user =>
          user.user_id === userId ? { ...user, is_admin: !currentAdminStatus } : user
        ));
      } else {
        console.error('Failed to update user admin status');
      }
    } catch (error) {
      console.error('Error updating user admin status:', error);
    }
  };

  const toggleUserStatus = async (userId, currentDisabledStatus) => {
    try {
      const response = await fetch(`${apiUrl}/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ is_disabled: !currentDisabledStatus })
      });
      if (response.ok) {
        setUsers(users.map(user =>
          user.user_id === userId ? { ...user, is_disabled: !currentDisabledStatus } : user
        ));
      } else {
        console.error('Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const toggleReviewVisibility = async (reviewId, currentHiddenStatus) => {
    try {
      const response = await fetch(`${apiUrl}/admin/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ hidden: !currentHiddenStatus })
      });
      if (response.ok) {
        setReviews(reviews.map(review =>
          review.review_id === reviewId ? { ...review, hidden: !currentHiddenStatus } : review
        ));
      } else {
        console.error('Failed to update review visibility');
      }
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <div className="tab-buttons">
        <button
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={18} />
          Users
        </button>
        <button
          className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          <FileText size={18} />
          Reviews
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Email Verified</th>
                <th>Admin</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.user_id}>
                  <td>{user.user_id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.email_verified ? '✓' : '✗'}</td>
                  <td>{user.is_admin ? '✓' : '✗'}</td>
                  <td>{user.is_disabled ? 'Disabled' : 'Active'}</td>
                  <td>
                    <button 
                      className="action-button"
                      onClick={() => toggleUserAdminStatus(user.user_id, user.is_admin)}
                    >
                      {user.is_admin ? <ShieldOff size={18} /> : <Shield size={18} />}
                    </button>
                    <button 
                      className="action-button"
                      onClick={() => toggleUserStatus(user.user_id, user.is_disabled)}
                    >
                      {user.is_disabled ? <UserCheck size={18} /> : <UserX size={18} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Review ID</th>
                <th>List ID</th>
                <th>User ID</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(review => (
                <tr key={review.review_id}>
                  <td>{review.review_id}</td>
                  <td>{review.list_id}</td>
                  <td>{review.user_id}</td>
                  <td>{review.rating}</td>
                  <td>{review.comment}</td>
                  <td>{review.hidden ? 'Hidden' : 'Visible'}</td>
                  <td>
                    <button 
                      className="action-button"
                      onClick={() => toggleReviewVisibility(review.review_id, review.hidden)}
                    >
                      {review.hidden ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

