// src/components/Sidebar.jsx
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  BarChart3, 
  Grid2X2, 
  Calendar, 
  Cpu, 
  LogOut, 
  Activity, 
  Settings,
  ShieldCheck,
  Package,
  Clock,
  LayoutDashboard,
  UserCircle,
  FileText,
  Shield,
  Users,
  Send,
  Briefcase
} from 'lucide-react';

const Sidebar = ({ role, label, iconColor }) => {
  const getNavItems = () => {
    switch (role) {
      case 'superadmin':
        return [
          { icon: <BarChart3 size={18} />, label: 'Dashboard', path: '/super/dashboard' },
          { icon: <Users size={18} />, label: 'Employees', path: '/super/employees' },
          { icon: <Package size={18} />, label: 'Departments', path: '/super/departments' },
          { icon: <Shield size={18} />, label: 'Org Admins', path: '/super/org-admins' },
          { icon: <Clock size={18} />, label: 'Attendance', path: '/super/attendance' },
          { icon: <Briefcase size={18} />, label: 'Leaves', path: '/super/leaves' },
          { icon: <Calendar size={18} />, label: 'Holidays', path: '/super/holidays' },
          { icon: <Cpu size={18} />, label: 'Devices', path: '/super/devices' },
          { icon: <Send size={18} />, label: 'Device Commands', path: '/super/device-commands' },
          { icon: <Settings size={18} />, label: 'Settings', path: '/super/settings' },
        ];
      case 'orgadmin':
        return [
          { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/org/dashboard' },
          { icon: <Users size={18} />, label: 'All Employees', path: '/org/employees' },
          { icon: <Clock size={18} />, label: 'Attendance List', path: '/org/attendance' },
          { icon: <Activity size={18} />, label: 'Today Attendance', path: '/org/today' },
          { icon: <Briefcase size={18} />, label: 'Leave Requests', path: '/org/leaves' },
          { icon: <BarChart3 size={18} />, label: 'Attendance Report', path: '/org/report-att' },
          { icon: <FileText size={18} />, label: 'Leave Report', path: '/org/report-leave' },
          { icon: <Cpu size={18} />, label: 'Devices', path: '/org/devices' },
          { icon: <Settings size={18} />, label: 'Settings', path: '/org/settings' },
        ];
      case 'user':
        return [
          { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/emp/dashboard' },
          { icon: <Clock size={18} />, label: 'Attendance List', path: '/emp/attendance' },
          { icon: <Briefcase size={18} />, label: 'Leave List', path: '/emp/leaves' },
          { icon: <Calendar size={18} />, label: 'Holidays', path: '/emp/holidays' },
          { icon: <UserCircle size={18} />, label: 'Profile', path: '/emp/profile' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sb-header">
        <div className="sb-logo" style={{ background: iconColor }}>
          <ShieldCheck color="white" size={20} />
        </div>
        <div>
          <div className="sb-title">Sentinel</div>
          <div className="sb-role">{label}</div>
        </div>
      </div>
      
      <div style={{ flex: 1, padding: '0.5rem 0' }}>
        {navItems.map((item, idx) => (
          <NavLink 
            key={idx} 
            to={item.path} 
            className={({ isActive }) => `sb-item ${isActive ? `active ${role === 'superadmin' ? 'super' : role === 'user' ? 'emp' : ''}` : ''}`}
          >
            <span className="sb-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="sb-signout-wrapper">
        <Link to="/" className="sb-signout">
          <LogOut size={16} style={{ marginRight: '8px' }} />
          Sign Out
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;