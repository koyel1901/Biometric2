import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { TrendChart, BarChart } from '../../components/Charts';

const SuperDash = () => {
  return (
    <DashboardLayout 
      title="Dashboard" 
      role="superadmin" 
      label="Tenant Admin" 
      abbr="TA" 
      color="#a855f7" 
      bgColor="rgba(168,85,247,0.15)"
    >
      <div className="stats-grid">
        <div className="stat-card purple"><div className="stat-label">Total Departments</div><div className="stat-value">24</div><div className="stat-sub">3 onboarded this month</div></div>
        <div className="stat-card green"><div className="stat-label">Active Devices</div><div className="stat-value">312</div><div className="stat-sub">6 offline</div></div>
        <div className="stat-card teal"><div className="stat-label">Total Employees</div><div className="stat-value">8,241</div><div className="stat-sub">across all depts</div></div>
        <div className="stat-card amber"><div className="stat-label">Sync Events (24h)</div><div className="stat-value">1,847</div><div className="stat-sub">99.2% success</div></div>
        <div className="stat-card red"><div className="stat-label">Device Alerts</div><div className="stat-value">6</div><div className="stat-sub">needs attention</div></div>
      </div>

      <div className="two-col">
        <div className="card-box">
          <h4>Attendance throughput (last 7 days)</h4>
          <TrendChart 
            labels={['Mon','Tue','Wed','Thu','Fri','Sat','Sun']} 
            vals={[72,85,90,88,76,40,20]} 
            color="#a855f7" 
          />
        </div>
        <div class="card-box">
          <h4>Dept-wise device distribution</h4>
          <BarChart 
            labels={['Engineering','HR','Finance','Ops','Design']} 
            colors={['#a855f7','#a855f7','#a855f7','#a855f7','#a855f7']} 
            vals={[48,38,31,24,19]} 
          />
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-header"><span className="table-title">Recent department activity</span></div>
        <table>
          <thead>
            <tr><th>Department</th><th>Event</th><th>Time</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr><td>Engineering</td><td>Device sync completed</td><td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>09:42 AM</td><td><span className="badge active">success</span></td></tr>
            <tr><td>HR</td><td>New employee registered</td><td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>09:15 AM</td><td><span className="badge active">success</span></td></tr>
            <tr><td>Ops</td><td>Device FP-007 went offline</td><td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>08:58 AM</td><td><span className="badge absent">alert</span></td></tr>
            <tr><td>Finance</td><td>Attendance report exported</td><td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>08:30 AM</td><td><span className="badge active">success</span></td></tr>
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default SuperDash;
