import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from '../views/SignIn';
import LetsPlay from '../views/LetsPlay';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<SignIn/>} />
        <Route path="/letsplay" element={<LetsPlay/>} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
