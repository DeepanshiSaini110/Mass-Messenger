import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SendMessage from './pages/SendMessage';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/>}></Route>
      <Route path="/send-message" element={<SendMessage/>}></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;