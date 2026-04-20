// src/pages/employee/Attendance.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Badge from '../../components/Badge';
import { employeeApi } from '../../services/api';

const Attendance = () => {
  const [attendanceList, setAttendanceList] = useState([]);
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
      
      setAttendanceList(filteredHistory);
      
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
      <style>{`
        .table-wrap {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
        }
        .table-header {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .table-title {
          font-size: 0.95rem;
          font-weight: 500;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th {
          padding: 0.75rem 1rem;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: var(--text3);
          border-bottom: 1px solid var(--border);
          text-align: left;
          font-family: var(--mono);
          font-weight: 400;
        }
        td {
          padding: 0.85rem 1rem;
          font-size: 0.85rem;
          border-bottom: 1px solid var(--border);
          color: var(--text2);
        }
        tr:last-child td {
          border-bottom: none;
        }
        tr:hover td {
          background: var(--bg3);
        }
        .badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 0.72rem;
          font-weight: 500;
          font-family: var(--mono);
        }
        .badge.present {
          background: rgba(34,197,94,0.1);
          color: #4ade80;
          border: 1px solid rgba(34,197,94,0.2);
        }
        .badge.late {
          background: rgba(245,158,11,0.1);
          color: #fbbf24;
          border: 1px solid rgba(245,158,11,0.2);
        }
        .badge.absent {
          background: rgba(239,68,68,0.1);
          color: #f87171;
          border: 1px solid rgba(239,68,68,0.2);
        }
        .form-select {
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 0.4rem 0.8rem;
          font-size: 0.82rem;
          color: var(--text);
          font-family: var(--font);
        }
      `}</style>

      <div className="table-wrap">
        <div className="table-header">
          <span className="table-title">My Attendance</span>
          <select 
            className="form-select" 
            style={{ width: '180px' }}
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