import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Scheduling from "../pages/Scheduling";
import Booking from "../pages/Booking";
import Meetings from "../pages/Meetings";
import Availability from "../pages/Availability";
import Contacts from "../pages/Contacts";
import Workflows from "../pages/Workflows";
import Integrations from "../pages/Integrations";
import Routing from "../pages/Routing";
export default function App() {
  return (
    <Routes>
      {/* Dashboard pages (WITH sidebar) */}
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Navigate to="/scheduling" />} />
        <Route path="/scheduling" element={<Scheduling />} />
        <Route path="/meetings" element={<Meetings />} />
        <Route path="/availability" element={<Availability />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/workflows" element={<Workflows/>} />
        <Route path="/integrations" element={<Integrations/>} />
        <Route path="/routing" element={<Routing/>} />


      </Route>

      {/* Public booking page (NO sidebar) */}
      <Route path="/book/:slug" element={<Booking />} />
    </Routes>
  );
}
