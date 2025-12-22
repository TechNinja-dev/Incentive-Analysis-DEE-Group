import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Admin from "./Admin";
import Creator from "./Creator";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/creator" element={<Creator />} />
    </Routes>
  );
}

