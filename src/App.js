import React from 'react';
// Changed BrowserRouter to HashRouter
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CppCompiler from './pages/compiler'; 

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