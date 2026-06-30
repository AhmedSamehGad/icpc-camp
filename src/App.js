import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CppCompiler from './pages/compiler'; // Assumes CppCompiler is in your src root folder

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the Home Page */}
        <Route path="/" element={<HomePage />} />
        
        {/* Route for the Code Compiler Page */}
        <Route path="/compiler" element={<CppCompiler />} />
      </Routes>
    </Router>
  );
}

export default App;