import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { TrendChart } from '../../components/Charts';

const OrgDash = () => {
  return (
    <DashboardLayout 
      title="Dashboard" 
      role="orgadmin" 
      label="Department Admin" 
      abbr="DA" 
      color="#00d4aa" 
      bgColor="rgba(0,212,170,0.15)"
    >
      <div className="stats-grid">
        <div className="stat-card teal"><div className="stat-label">Total Employees</div><div className="stat-value">156</div></div>
        <div className="stat-card green"><div className="stat-label">Present Today</div><div className="stat-value">132</div><div className="stat-sub">84.6%</div></div>
        <div className="stat-card red"><div className="stat-label">Absent Today</div><div className="stat-value">18</div></div>
        <div className="stat-card amber"><div className="stat-label">Late Today</div><div className="stat-value">6</div></div>
        <div className="stat-card blue"><div className="stat-label">On Leave</div><div className="stat-value">8</div></div>
        <div className="stat-card purple"><div className="stat-label">Inactive</div><div className="stat-value">4</div></div>
      </div>

      <div className="card-box">
        <h4>Attendance trend (last 7 days)</h4>
        <TrendChart 
          labels={['Mon','Tue','Wed','Thu','Fri','Sat','Sun']} 
          vals={[88,92,90,85,82,60,0]} 
          color="#00d4aa" 
        />
      </div>

      <div className="two-col">
        <div className="card-box">
          <h4>Employees on leave today</h4>
          <table style={{ width: '100%' }}>
            <thead>
              <tr><th>Name</th><th>Return</th></tr>
            </thead>
            <tbody>
              <tr><td>Priya Mehta</td><td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>17 Apr</td></tr>
              <tr><td>Rahul Sharma</td><td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>18 Apr</td></tr>
            </tbody>
          </table>
        </div>
        <div className="card-box">
          <h4>Upcoming holidays</h4>
          <table style={{ width: '100%' }}>
            <thead>
              <tr><th>Holiday</th><th>Date</th></tr>
            </thead>
            <tbody>
              <tr><td>Ram Navami</td><td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>6 Apr</td></tr>
              <tr><td>Mahavir Jayanti</td><td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>10 Apr</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrgDash;
