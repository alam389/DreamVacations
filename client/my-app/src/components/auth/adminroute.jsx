// adminroute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('is_admin') === 'true';

  if (!token || !isAdmin) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AdminRoute;