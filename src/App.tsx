import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import About from './pages/About';
import News from './pages/News';
import Signup from './pages/Signup';
import { Login } from './pages/Auth';
import { Home } from './pages/Home';
import { Me } from './pages/Me';
import { Bookmarks } from './pages/me/Bookmarks';
import React from "react";

function PublicRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('accessToken');
  return token ? <Navigate to="/" /> : <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/news" element={<News />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/me" element={<Me />} />
        <Route path="/me/bookmark" element={<Bookmarks />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;