import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import SendMessage from './pages/SendMessage';
import Dashboard from './pages/Dashboard';
import Logs from './pages/Logs';
import Recipients from './pages/Recepients';
import ControlCenter from './pages/ControlCenter';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing/>}></Route>
      <Route path="/login" element={<Auth/>}></Route>
      <Route path='/controlcenter' element={<ControlCenter/>}></Route>
      <Route path="/sendmessage" element={<SendMessage/>}></Route>
      <Route path="/dashboard" element={<Dashboard/>}></Route>
      <Route path="/logs" element={<Logs/>}></Route>
      <Route path="/recepients" element={<Recipients/>}></Route>
      

    </Routes>
    </BrowserRouter>
  );
}

export default App;