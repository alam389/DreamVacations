import { useState } from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Start from './components/startmessage/start';
import Login from './components/login/login'; // Add this import
import Auth from './components/auth/auth'; // Import the Auth component

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/start" />} />
        <Route path="/start" element={<Start />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth" element={<Auth />} /> {/* Added Auth route */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
