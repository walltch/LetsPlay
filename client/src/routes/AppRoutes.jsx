import useSocket from '../hooks/UseSocket';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from '../views/SignIn';
import LetsPlay from '../views/LetsPlay';
import { useEffect } from 'react';

function AppRoutes() {
  const { socket, isConnected } = useSocket();
  if(!isConnected){
    return <div>Connexion en cours...</div>
  }
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<SignIn socket={socket}/>} />
        <Route path="/letsplay" element={<LetsPlay socket={socket}/>} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
