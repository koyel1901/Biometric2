// src/pages/org/Today.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Plus, UserCheck, UserX, Clock, Calendar as CalendarIcon, AlertCircle, RefreshCw } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Badge from '../../components/Badge';
import { orgApi, tenantApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Today = () => {
  const { logout } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState(null);
  const [stats, setStats] = useState({ present: 0, late: 0, met_min_hours: 0 });

  const fetchSettings = async () => {
    try {
      const data = await tenantApi.getSettings();
      setSettings(data);
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    }
  };

  const fetchTodayAttendance = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await orgApi.getTodayAttendance();
      console.log("Today attendance:", data);
      
      if (Array.isArray(data)) {
        setAttendance(data);
        const present = data.filter(a => a.status === "present").length;
        const late = data.filter(a => a.is_late).length;
        const metMin = data.filter(a => a.met_min_hours).length;
        setStats({ present, late, met_min_hours: metMin });
      }
    } catch (err) {
      if (err?.response?.status === 401) logout();
      setError("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchTodayAttendance();
  }, []);

  const formatTime = (timestamp) => {
    if (!timestamp) return "--";
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <DashboardLayout title="Today's Attendance" role="orgadmin" label="Department Admin" abbr="DA" color="#00d4aa" bgColor="rgba(0,212,170,0.15)">
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Today's Attendance" role="orgadmin" label="Department Admin" abbr="DA" color="#00d4aa" bgColor="rgba(0,212,170,0.15)">
      <div className="stats-grid">
        <div className="stat-card green">
          <div className="stat-label"><UserCheck size={14} /> Present</div>
          <div className="stat-value">{stats.present}</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-label"><Clock size={14} /> Late</div>
          <div className="stat-value">{stats.late}</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-label">Met Min Hours</div>
          <div className="stat-value">{stats.met_min_hours}</div>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-header">
          <span className="table-title">Today's Attendance - {new Date().toLocaleDateString()}</span>
          <button className="btn btn-ghost" onClick={fetchTodayAttendance}><RefreshCw size={14} /> Refresh</button>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: '600px' }}>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Hours</th>
                <th>Met Min Hours?</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>No attendance records today</td></tr>
              ) : (
                attendance.map((a, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 500 }}>{a.name}</td>
                    <td>
                      {formatTime(a.check_in)}
                      {a.is_late && <span style={{ color: '#f59e0b', marginLeft: '6px', fontSize: '0.7rem' }}>(late)</span>}
                    </td>
                    <td>{formatTime(a.check_out)}</td>
                    <td style={{ fontWeight: a.met_min_hours ? 600 : 400 }}>
                      {a.hours_worked || 0}h
                    </td>
                    <td>
                      {a.met_min_hours ? (
                        <Badge type="present">✓ Yes</Badge>
                      ) : a.check_in ? (
                        <Badge type="late">✗ No</Badge>
                      ) : (
                        <span style={{ fontSize: '0.7rem', color: '#6b7585' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {settings && (
        <div style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'rgba(0,212,170,0.05)', borderRadius: '8px', fontSize: '0.7rem', textAlign: 'center' }}>
          ⏱️ Min working hours required: {settings.min_working_hours}h (within {settings.office_start_time?.slice(0,5)} - {settings.office_end_time?.slice(0,5)})
        </div>
      )}
    </DashboardLayout>
  );
};

export default Today;