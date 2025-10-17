// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AgeGate from "./pages/AgeGate";
import Customer from "./pages/Customer";
import WineDetail from "./pages/WineDetail";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<AgeGate />} />
        <Route path="/boutique" element={<Customer />} />
        <Route path="/vin/:id" element={<WineDetail />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}
