import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const DashboardLayout = ({ children, title, role, label, abbr, color, bgColor }) => {
  return (
    <div id="app">
      <div className="sb-backdrop" id="sb-backdrop"></div>
      
      <Sidebar 
        role={role} 
        label={label} 
        iconColor={color} 
      />

      <div className="main">
        <Topbar 
          title={title} 
          userAbbr={abbr} 
          bgColor={bgColor} 
          iconColor={color}
          role={role}
        />
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
