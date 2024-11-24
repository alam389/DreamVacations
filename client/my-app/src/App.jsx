import { useState } from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Start from './components/startmessage/start';
import Login from './components/login/login'; 
import Auth from './components/auth/auth'; 
import Guest from './components/guest_access/guestaccess'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/start" />} />
        <Route path="/start" element={<Start />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth" element={<Auth />} /> {/* Added Auth route */}
        <Route path="/" element={<Navigate to="/start" />} />
        <Route path="/guest_access" element={<Guest />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
