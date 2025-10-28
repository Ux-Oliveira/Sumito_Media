import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Countdown from "./pages/Countdown";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      {/*the Routes wrapper with padding-top for navbar spacing*/}
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/countdown" element={<Countdown />} />
        </Routes>
      </div>
    </div>
  );
}
