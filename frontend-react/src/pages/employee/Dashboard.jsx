import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { TrendChart } from '../../components/Charts';

const Dashboard = () => {
  return (
    <DashboardLayout 
      title="Dashboard" 
      role="user" 
      label="Employee" 
      abbr="EM" 
      color="#f59e0b" 
      bgColor="rgba(245,158,11,0.15)"
    >
      {/* Top Presence Card */}
      <div className="today-card">
        <div className="today-item">
          <div className="today-val">Present</div>
          <div className="today-lbl">Today Status</div>
        </div>
        <div className="today-item">
          <div className="today-val">09:05</div>
          <div className="today-lbl">Check-in</div>
        </div>
        <div className="today-item">
          <div className="today-val">--</div>
          <div className="today-lbl">Check-out</div>
        </div>
        <div className="today-item">
          <div className="today-val">6h 12m</div>
          <div className="today-lbl">Working Hours</div>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-label">Monthly Attendance</div>
          <div className="stat-value" style={{ color: 'var(--teal)', fontSize: '1.4rem' }}>87%</div>
          <div className="stat-sub">Apr 2026</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Present Days</div>
          <div className="stat-value" style={{ color: 'var(--green)', fontSize: '1.4rem' }}>14</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Absent Days</div>
          <div className="stat-value" style={{ color: 'var(--red)', fontSize: '1.4rem' }}>2</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Late Count</div>
          <div className="stat-value" style={{ color: 'var(--amber)', fontSize: '1.4rem' }}>1</div>
        </div>
      </div>

      {/* Charts and Info Row */}
      <div className="two-col" style={{ marginTop: '1.5rem' }}>
        <div className="card-box">
          <h4>Attendance trend (this month)</h4>
          <TrendChart 
            labels={['W1', 'W2', 'W3', 'W4']} 
            vals={[80, 95, 88, 70]} 
            color="var(--amber)" 
          />
        </div>
        <div className="card-box">
          <h4>Quick info</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="stat-label" style={{ margin: 0 }}>Upcoming holiday</span>
              <span style={{ fontSize: '0.85rem', fontFamily: 'var(--mono)' }}>Mahavir Jayanti - 10 Apr</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="stat-label" style={{ margin: 0 }}>Pending leaves</span>
              <span className="badge pending">1 pending</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="stat-label" style={{ margin: 0 }}>Last check-in</span>
              <span style={{ fontSize: '0.85rem', fontFamily: 'var(--mono)' }}>Today 09:05</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sign Out Button (matches mobile screenshot height) */}
      <div className="tb-hamburger" style={{ display: 'none', marginTop: '2rem' }}>
         {/* Mobile specific signout if needed */}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
