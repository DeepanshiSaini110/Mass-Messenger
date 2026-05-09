import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Campaigns from "./pages/Campaigns";
import Audience from "./pages/Audience";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import SettingsPage from "./pages/SettingsPage";
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import SendMessage from './pages/SendMessage';



function App() {
  return (
    <BrowserRouter>
    <Routes>

  <Route path="/" element={<Landing />} />

  <Route path="/login" element={<Auth />} />

  <Route path="/sendmessage" element={<SendMessage />} />

  <Route path="/dashboard" element={<Dashboard />} />

  <Route path="/campaigns" element={<Campaigns />} />

  <Route path="/audience" element={<Audience />} />

  <Route path="/analytics" element={<Analytics />} />

  <Route path="/reports" element={<Reports />} />

  <Route path="/settings" element={<SettingsPage />} />

</Routes>
    </BrowserRouter>
  );
}

export default App;