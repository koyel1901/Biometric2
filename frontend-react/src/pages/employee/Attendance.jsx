// src/pages/employee/Attendance.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Badge from '../../components/Badge';
import { employeeApi } from '../../services/api';

const Attendance = () => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [stats, setStats] = useState({
    total_present_days: 0,
    total_late_days: 0,
    total_hours_worked: 0,
    average_hours_per_day: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchAttendanceData();
  }, [selectedMonth, selectedYear]);

  const fetchAttendanceData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch both attendance history and stats
      const [history, statsData] = await Promise.all([
        employeeApi.getAttendanceHistory(),
        employeeApi.getAttendanceStats(),
      ]);

      console.log('Attendance history:', history); // Debug log
      console.log('Attendance stats:', statsData); // Debug log

      setAttendanceList(history || []);
      setStats(statsData || {
        total_present_days: 0,
        total_late_days: 0,
        total_hours_worked: 0,
        average_hours_per_day: 0,
      });
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '--';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    } catch (e) {
      return dateStr;
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '--';
    try {
      const date = new Date(timeStr);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return timeStr;
    }
  };

  const getStatusBadge = (status, punctuality) => {
    if (status === 'present') {
      return punctuality === 'late' ? 'late' : 'present';
    }
    return 'absent';
  };

  const getStatusText = (status, punctuality) => {
    if (status === 'present') {
      return punctuality === 'late' ? 'Late' : 'Present';
    }
    return 'Absent';
  };

  if (loading) {
    return (
      <DashboardLayout 
        title="Attendance List" 
        role="user" 
        label="Employee" 
        abbr="EM" 
        color="#f59e0b" 
        bgColor="rgba(245,158,11,0.15)"
      >
        <div className="card-box" style={{ textAlign: 'center', padding: '4rem' }}>
          <p>Loading attendance data...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout 
        title="Attendance List" 
        role="user" 
        label="Employee" 
        abbr="EM" 
        color="#f59e0b" 
        bgColor="rgba(245,158,11,0.15)"
      >
        <div className="card-box" style={{ textAlign: 'center', padding: '4rem' }}>
          <p style={{ color: 'var(--red)' }}>Error: {error}</p>
          <button className="btn btn-teal" onClick={fetchAttendanceData} style={{ marginTop: '1rem' }}>
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Attendance List" 
      role="user" 
      label="Employee" 
      abbr="EM" 
      color="#f59e0b" 
      bgColor="rgba(245,158,11,0.15)"
    >
      {/* Stats Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card green">
          <div className="stat-label">Total Present</div>
          <div className="stat-value">{stats.total_present_days || 0}</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-label">Late Days</div>
          <div className="stat-value">{stats.total_late_days || 0}</div>
        </div>
        <div className="stat-card teal">
          <div className="stat-label">Total Hours</div>
          <div className="stat-value">{stats.total_hours_worked || 0}h</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-label">Avg Hours/Day</div>
          <div className="stat-value">{stats.average_hours_per_day || 0}h</div>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-header">
          <span className="table-title">My Attendance</span>
          <select 
            className="form-select" 
            style={{ width: '130px', padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>
        
        {attendanceList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text3)' }}>
            No attendance records found for this period
          </div>
        ) : (
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Working Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceList.map((a, idx) => (
                <tr key={idx}>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>
                    {formatDate(a.date)}
                  </td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>
                    {formatTime(a.check_in)}
                  </td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>
                    {formatTime(a.check_out)}
                  </td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>
                    {a.hours_worked > 0 ? `${a.hours_worked}h` : '--'}
                  </td>
                  <td>
                    <Badge type={getStatusBadge(a.status, a.punctuality)}>
                      {getStatusText(a.status, a.punctuality)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Attendance;