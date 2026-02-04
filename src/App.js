import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import SendMessage from './pages/SendMessage';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing/>}></Route>
      <Route path="/login" element={<Auth/>}></Route>
      <Route path="/send-message" element={<SendMessage/>}></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;