// src/pages/employee/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { TrendChart } from '../../components/Charts';
import { employeeApi } from '../../services/api';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    check_in: null,
    check_out: null,
    present_days: 0,
  });
  const [todayAttendance, setTodayAttendance] = useState({
    check_in: null,
    check_out: null,
    status: 'absent',
    hours_worked: 0,
  });
  const [monthlyStats, setMonthlyStats] = useState({
    present_days: 0,
    total_hours: 0,
    attendance_percentage: 0,
  });
  const [upcomingHoliday, setUpcomingHoliday] = useState(null);
  const [pendingLeaves, setPendingLeaves] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashboard, today, monthly, upcoming, leaves] = await Promise.all([
        employeeApi.getDashboard(),
        employeeApi.getTodayAttendance(),
        employeeApi.getMonthlyStats(),
        employeeApi.getUpcomingHoliday(),
        employeeApi.getLeaveStats(),
      ]);

      setDashboardData(dashboard);
      setTodayAttendance(today);
      setMonthlyStats(monthly);
      setUpcomingHoliday(upcoming);
      setPendingLeaves(leaves.pending || 0);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '--';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <DashboardLayout 
        title="Dashboard" 
        role="user" 
        label="Employee" 
        abbr="EM" 
        color="#f59e0b" 
        bgColor="rgba(245,158,11,0.15)"
      >
        <div className="card-box" style={{ textAlign: 'center', padding: '4rem' }}>
          <p>Loading dashboard data...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout 
        title="Dashboard" 
        role="user" 
        label="Employee" 
        abbr="EM" 
        color="#f59e0b" 
        bgColor="rgba(245,158,11,0.15)"
      >
        <div className="card-box" style={{ textAlign: 'center', padding: '4rem' }}>
          <p style={{ color: 'var(--red)' }}>Error: {error}</p>
          <button className="btn btn-teal" onClick={fetchAllData} style={{ marginTop: '1rem' }}>
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

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
          <div className="today-val">{todayAttendance.status === 'present' ? 'Present' : 'Absent'}</div>
          <div className="today-lbl">Today Status</div>
        </div>
        <div className="today-item">
          <div className="today-val">{formatTime(todayAttendance.check_in)}</div>
          <div className="today-lbl">Check-in</div>
        </div>
        <div className="today-item">
          <div className="today-val">{formatTime(todayAttendance.check_out)}</div>
          <div className="today-lbl">Check-out</div>
        </div>
        <div className="today-item">
          <div className="today-val">{todayAttendance.hours_worked > 0 ? `${todayAttendance.hours_worked}h` : '--'}</div>
          <div className="today-lbl">Working Hours</div>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-label">Monthly Attendance</div>
          <div className="stat-value" style={{ color: 'var(--teal)', fontSize: '1.4rem' }}>
            {monthlyStats.attendance_percentage || 0}%
          </div>
          <div className="stat-sub">This Month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Present Days</div>
          <div className="stat-value" style={{ color: 'var(--green)', fontSize: '1.4rem' }}>
            {dashboardData.present_days || 0}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Hours</div>
          <div className="stat-value" style={{ color: 'var(--amber)', fontSize: '1.4rem' }}>
            {monthlyStats.total_hours || 0}h
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Leaves</div>
          <div className="stat-value" style={{ color: 'var(--purple)', fontSize: '1.4rem' }}>
            {pendingLeaves}
          </div>
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
              <span style={{ fontSize: '0.85rem', fontFamily: 'var(--mono)' }}>
                {upcomingHoliday ? `${upcomingHoliday.holiday_name} - ${new Date(upcomingHoliday.holiday_date).toLocaleDateString()}` : 'None'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="stat-label" style={{ margin: 0 }}>Pending leaves</span>
              <span className="badge pending">{pendingLeaves} pending</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="stat-label" style={{ margin: 0 }}>Last check-in</span>
              <span style={{ fontSize: '0.85rem', fontFamily: 'var(--mono)' }}>
                {formatTime(todayAttendance.check_in)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;