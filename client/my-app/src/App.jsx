import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Start from './components/startmessage/start';
import Login from './components/login/login'; 
import Auth from './components/auth/auth'; 
import Guest from './components/guest_access/guestaccess'; 
import UserAccess from './components/user_access/useraccess'; 
import AdminDashboard from './components/admin/AdminDashboard';
import ProtectedRoute from './components/auth/protectedroute'; 
import AdminRoute from './components/auth/adminroute'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/start" />} />
        <Route path="/start" element={<Start />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/guest_access" element={<Guest />} />
        <Route
          path="/useraccess"
          element={
            <ProtectedRoute>
              <UserAccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admindashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
