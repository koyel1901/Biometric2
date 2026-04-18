import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Gateway from './pages/Gateway';

// Tenant Imports
import TenantDash from './pages/tenant/Dashboard';
import TenantDepts from './pages/tenant/Departments';
import TenantHolidays from './pages/tenant/Holidays';
import TenantDevices from './pages/tenant/Devices';
import TenantActivity from './pages/tenant/Activity';
import TenantSettings from './pages/tenant/Settings';

// Org Imports
import OrgDash from './pages/org/Dashboard';
import OrgEmployees from './pages/org/Employees';
import OrgAttendance from './pages/org/Attendance';
import OrgToday from './pages/org/Today';
import OrgLeaves from './pages/org/Leaves';
import OrgReportAtt from './pages/org/ReportAtt';
import OrgReportLeave from './pages/org/ReportLeave';
import OrgDevices from './pages/org/Devices';
import OrgSettings from './pages/org/Settings';
import OrgActivity from './pages/org/Activity';

// Employee Imports
import EmpDash from './pages/employee/Dashboard';
import EmpAttendance from './pages/employee/Attendance';
import EmpLeaves from './pages/employee/Leaves';
import EmpHolidays from './pages/employee/Holidays';
import EmpProfile from './pages/employee/Profile';
import Login from './pages/Login';



function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Landing / Gateway */}
          <Route path="/" element={<Gateway />} />
          <Route path="/login/:role" element={<Login />} />


          {/* Tenant Admin (Super Admin) Routes */}
          <Route path="/super/dashboard" element={<TenantDash />} />
          <Route path="/super/departments" element={<TenantDepts />} />
          <Route path="/super/holidays" element={<TenantHolidays />} />
          <Route path="/super/devices" element={<TenantDevices />} />
          <Route path="/super/activity" element={<TenantActivity />} />
          <Route path="/super/settings" element={<TenantSettings />} />

          {/* Dept Admin (Org Admin) Routes */}
          <Route path="/org/dashboard" element={<OrgDash />} />
          <Route path="/org/employees" element={<OrgEmployees />} />
          <Route path="/org/attendance" element={<OrgAttendance />} />
          <Route path="/org/today" element={<OrgToday />} />
          <Route path="/org/leaves" element={<OrgLeaves />} />
          <Route path="/org/report-att" element={<OrgReportAtt />} />
          <Route path="/org/report-leave" element={<OrgReportLeave />} />
          <Route path="/org/devices" element={<OrgDevices />} />
          <Route path="/org/settings" element={<OrgSettings />} />
          <Route path="/org/activity" element={<OrgActivity />} />

          {/* Employee Routes */}
          <Route path="/emp/dashboard" element={<EmpDash />} />
          <Route path="/emp/attendance" element={<EmpAttendance />} />
          <Route path="/emp/leaves" element={<EmpLeaves />} />
          <Route path="/emp/holidays" element={<EmpHolidays />} />
          <Route path="/emp/profile" element={<EmpProfile />} />


          {/* Redirect / Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
