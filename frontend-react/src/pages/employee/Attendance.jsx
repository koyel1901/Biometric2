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
  }, [selectedMonth, selectedYear]); // Re-fetch when month or year changes

  const fetchAttendanceData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch attendance history for selected month/year
      // Note: The API might need to be updated to accept month/year parameters
      // For now, we'll filter on the frontend
      const history = await employeeApi.getAttendanceHistory();
      
      console.log('All attendance history:', history);
      
      // Filter attendance records by selected month and year
      const filteredHistory = history.filter(record => {
        if (!record.date) return false;
        const recordDate = new Date(record.date);
        return recordDate.getMonth() + 1 === selectedMonth && 
               recordDate.getFullYear() === selectedYear;
      });
      
      console.log(`Filtered for ${selectedMonth}/${selectedYear}:`, filteredHistory);
      
      // Calculate stats for filtered records
      const calculatedStats = {
        total_present_days: filteredHistory.filter(r => r.status === 'present').length,
        total_late_days: filteredHistory.filter(r => r.punctuality === 'late').length,
        total_hours_worked: filteredHistory.reduce((sum, r) => sum + (r.hours_worked || 0), 0),
        average_hours_per_day: 0,
      };
      
      calculatedStats.average_hours_per_day = calculatedStats.total_present_days > 0 
        ? calculatedStats.total_hours_worked / calculatedStats.total_present_days 
        : 0;
      
      setAttendanceList(filteredHistory);
      setStats(calculatedStats);
      
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

  // Generate month options with year
  const getMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    
    // Generate last 12 months
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      options.push({
        value: `${month}-${year}`,
        month: month,
        year: year,
        label: monthName
      });
    }
    
    return options;
  };

  const handleMonthChange = (e) => {
    const [month, year] = e.target.value.split('-');
    setSelectedMonth(parseInt(month));
    setSelectedYear(parseInt(year));
  };

  const monthOptions = getMonthOptions();
  const currentSelection = `${selectedMonth}-${selectedYear}`;

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
          <div className="stat-sub">For selected month</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-label">Late Days</div>
          <div className="stat-value">{stats.total_late_days || 0}</div>
          <div className="stat-sub">For selected month</div>
        </div>
        <div className="stat-card teal">
          <div className="stat-label">Total Hours</div>
          <div className="stat-value">{stats.total_hours_worked || 0}h</div>
          <div className="stat-sub">For selected month</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-label">Avg Hours/Day</div>
          <div className="stat-value">{stats.average_hours_per_day || 0}h</div>
          <div className="stat-sub">When present</div>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-header">
          <span className="table-title">My Attendance</span>
          <select 
            className="form-select" 
            style={{ width: '180px', padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
            value={currentSelection}
            onChange={handleMonthChange}
          >
            {monthOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {attendanceList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text3)' }}>
            No attendance records found for {monthOptions.find(o => o.value === currentSelection)?.label || 'this period'}
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