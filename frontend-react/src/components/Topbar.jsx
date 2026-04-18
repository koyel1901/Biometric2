import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun, Bell, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useTheme } from '../context/ThemeContext';

const Topbar = ({ title, userAbbr, bgColor, iconColor, role }) => {

  const { theme, toggleTheme } = useTheme();
  const [showNotifs, setShowNotifs] = useState(false);


  // Close notifs on click outside
  useEffect(() => {
    const close = () => setShowNotifs(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const handleToggleSidebar = () => {
    // This will target the existing global toggle logic if we keep it, 
    // but in React we'll handle it via root state or global CSS classes.
    const sb = document.getElementById('sidebar');
    const bd = document.getElementById('sb-backdrop');
    if (window.innerWidth <= 768) {
      if (sb) sb.classList.toggle('open');
      if (bd) bd.classList.toggle('visible');
    } else {
      if (sb) sb.classList.toggle('collapsed');
    }
  };

  return (
    <div className="topbar">
      <button 
        className="tb-action-icon tb-hamburger" 
        onClick={(e) => { e.stopPropagation(); handleToggleSidebar(); }}
        style={{ marginRight: '10px', fontSize: '1.4rem' }}
      >
        <Menu size={22} />
      </button>
      <span className="tb-title">{title}</span>

      <div className="tb-search-wrap">
        <input className="tb-search" type="text" placeholder="Search..." />
      </div>
      <div style={{ flex: 1 }}></div>

      <button 
        className="tb-action-icon theme-toggle" 
        onClick={toggleTheme}
        title="Toggle Light/Dark Mode"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div 
        className="tb-notif tb-action-icon" 
        onClick={(e) => { e.stopPropagation(); setShowNotifs(!showNotifs); }}
      >
        <Bell size={20} />
        <div className="tb-notif-badge"></div>
        {showNotifs && (
          <div className="notif-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="table-header" style={{ justifyContent: 'space-between' }}>
              <span className="table-title">Notifications</span>
              <button className="btn btn-ghost">Mark all read</button>
            </div>
            {/* Sample notifications matching the HTML version */}
            <div className="notif-item">
              <div className="notif-dot" style={{ background: '#ef4444' }}></div>
              <div>
                <div className="notif-text">Device FP-003 went offline at 09:30</div>
                <div className="notif-time">5 min ago</div>
              </div>
            </div>
            <div className="notif-item">
              <div className="notif-dot" style={{ background: '#00d4aa' }}></div>
              <div>
                <div className="notif-text">Attendance report for March ready</div>
                <div className="notif-time">1 hr ago</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Link 
        to={role === 'superadmin' ? '/super/profile' : role === 'orgadmin' ? '/org/profile' : '/emp/profile'} 
        className="avatar" 
        style={{ background: bgColor, color: iconColor, textDecoration: 'none' }}
      >
        {userAbbr}
      </Link>

    </div>
  );
};

export default Topbar;
