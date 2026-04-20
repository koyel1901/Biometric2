// src/pages/org/Today.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Plus, UserCheck, UserX, Clock, Calendar as CalendarIcon, AlertCircle, RefreshCw } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Badge from '../../components/Badge';
import { orgApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// Function to fetch public settings (no authentication required)
const fetchPublicSettings = async () => {
  try {
    const response = await fetch('https://api.attendance.gridsphere.in/api/tenants/settings/public');
    if (!response.ok) {
      throw new Error('Failed to fetch public settings');
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error fetching public settings:', err);
    return null;
  }
};

const Today = () => {
  const { logout } = useAuth();
  const [view, setView] = useState('main');
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({ employee_id: '', date: new Date().toISOString().split('T')[0], time: '09:00', record_type: 'IN', reason: '' });
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch public settings from API and manage localStorage
  const fetchSettings = useCallback(async () => {
    try {
      // Hit the public route
      const data = await fetchPublicSettings();
      
      if (!data) {
        throw new Error('No data received');
      }
      
      console.log("Public settings fetched:", data);
      
      // Get stored settings from localStorage
      const storedSettings = localStorage.getItem('org_attendance_settings');
      const parsedStored = storedSettings ? JSON.parse(storedSettings) : null;
      
      // Compare current settings with stored ones
      if (parsedStored && 
          parsedStored.office_start_time === data.office_start_time &&
          parsedStored.office_end_time === data.office_end_time &&
          parsedStored.late_threshold_minutes === data.late_threshold_minutes &&
          parsedStored.working_days === data.working_days) {
        // Settings haven't changed, use stored
        console.log("Settings unchanged, using cached version");
        setSettings(parsedStored);
      } else {
        // Settings have changed or first time, update localStorage
        console.log("Settings changed or first time, updating cache");
        localStorage.setItem('org_attendance_settings', JSON.stringify(data));
        setSettings(data);
      }
      
      return data;
    } catch (err) {
      console.error("Failed to fetch public settings:", err);
      // If API fails, try to use stored settings
      const storedSettings = localStorage.getItem('org_attendance_settings');
      if (storedSettings) {
        console.log("API failed, using cached settings");
        setSettings(JSON.parse(storedSettings));
        return JSON.parse(storedSettings);
      }
      // Default settings if nothing works
      const defaultSettings = {
        office_start_time: "09:00:00",
        office_end_time: "18:00:00",
        late_threshold_minutes: 15,
        working_days: "1,2,3,4,5"
      };
      setSettings(defaultSettings);
      return defaultSettings;
    }
  }, []);

  // Revalidate settings periodically (every 5 minutes)
  useEffect(() => {
    // Initial fetch
    fetchSettings();
    
    // Set up interval to revalidate settings every 5 minutes
    const interval = setInterval(() => {
      console.log("Revalidating public settings...");
      fetchSettings();
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [fetchSettings]);

  // Function to check if a check-in time is late based on settings
  const isCheckInLate = useCallback((checkInTime) => {
    if (!checkInTime || !settings) return false;
    
    const checkIn = new Date(checkInTime);
    const hours = checkIn.getUTCHours();
    const minutes = checkIn.getUTCMinutes();
    
    // Parse office start time from settings (format: "09:00:00")
    const officeStart = settings.office_start_time.split(':');
    const officeHour = parseInt(officeStart[0]);
    const officeMinute = parseInt(officeStart[1]);
    
    const lateThreshold = settings.late_threshold_minutes || 15;
    
    // Calculate allowed time (office start + late threshold)
    let allowedHour = officeHour;
    let allowedMinute = officeMinute + lateThreshold;
    
    if (allowedMinute >= 60) {
      allowedHour += Math.floor(allowedMinute / 60);
      allowedMinute = allowedMinute % 60;
    }
    
    // Compare times
    if (hours > allowedHour) return true;
    if (hours === allowedHour && minutes > allowedMinute) return true;
    
    return false;
  }, [settings]);

  // Calculate punctuality for each attendance record
  const calculatePunctuality = useCallback((record) => {
    if (!settings) return 'unknown';
    
    // Only calculate punctuality for IN records
    if (record.record_type === 'IN' || record.check_in) {
      return isCheckInLate(record.check_in) ? 'late' : 'on_time';
    }
    return 'on_time';
  }, [settings, isCheckInLate]);

  const fetchTodayAttendance = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await orgApi.getTodayAttendance();
      console.log("Raw attendance data:", data);
      
      // Ensure settings are loaded before processing
      let currentSettings = settings;
      if (!currentSettings) {
        currentSettings = await fetchSettings();
      }
      
      // Process attendance with punctuality calculation
      const processedData = data.map(record => ({
        ...record,
        punctuality: calculatePunctuality(record)
      }));
      
      console.log("Processed attendance with punctuality:", processedData);
      setAttendance(processedData || []);
    } catch (err) {
      if (err?.response?.status === 401) logout();
      setError("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const data = await orgApi.getEmployees();
      setEmployees(data || []);
    } catch (err) {
      console.error("Employees fetch error:", err);
    }
  };

  useEffect(() => {
    if (settings) {
      fetchTodayAttendance();
    }
    fetchEmployees();
  }, [settings]);

  // Filter employees based on status and calculated punctuality
  const onTimeEmployees = attendance.filter(a => a.status === "present" && a.punctuality !== "late");
  const lateEmployees = attendance.filter(a => a.status === "present" && a.punctuality === "late");
  const absentEmployees = attendance.filter(a => a.status !== "present");

  const handleManualSubmit = () => {
    setSuccessMsg(`Manual entry recorded for ${formData.employee_id}`);
    setTimeout(() => setSuccessMsg(""), 3000);
    setView('main');
  };

  // Format time for display
  const formatCheckInTime = (checkIn) => {
    if (!checkIn) return "--";
    return new Date(checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <DashboardLayout title="Today Attendance" role="orgadmin" label="Department Admin" abbr="DA" color="#00d4aa" bgColor="rgba(0,212,170,0.15)">
        <div className="skeleton-loader" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {[1,2,3].map(i => <div key={i} style={{ background: 'var(--bg2)', borderRadius: '16px', height: '180px', animation: 'pulse 1.5s ease-in-out infinite' }}></div>)}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Today Attendance" role="orgadmin" label="Department Admin" abbr="DA" color="#00d4aa" bgColor="rgba(0,212,170,0.15)">
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .settings-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px;
          background: var(--bg3);
          border-radius: 20px;
          font-size: 0.7rem;
          color: var(--text2);
        }
      `}</style>
      
      {successMsg && <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'rgba(34,197,94,0.95)', color: 'white', padding: '12px 20px', borderRadius: '12px', zIndex: 1000, animation: 'slideIn 0.3s ease' }}>{successMsg}</div>}
      {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '12px 16px', marginBottom: '1rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertCircle size={16} /> {error}<button onClick={fetchTodayAttendance} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}><RefreshCw size={14} /></button></div>}

      {view === 'main' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Daily Overview - {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {settings && (
                <div className="settings-badge">
                  <Clock size={12} />
                  Late after: {settings.office_start_time?.slice(0,5)} + {settings.late_threshold_minutes} min
                </div>
              )}
              <button className="btn btn-teal" onClick={() => setView('manual')}>
                <Plus size={16} /> Manual Entry
              </button>
            </div>
          </div>
          
          <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
            <div className="stat-card green">
              <div className="stat-label"><UserCheck size={14} /> Present</div>
              <div className="stat-value">{onTimeEmployees.length + lateEmployees.length}</div>
              <div className="stat-sub">{attendance.length > 0 ? Math.round(((onTimeEmployees.length + lateEmployees.length) / attendance.length) * 100) : 0}% of department</div>
            </div>
            <div className="stat-card red">
              <div className="stat-label"><UserX size={14} /> Absent</div>
              <div className="stat-value">{absentEmployees.length}</div>
            </div>
            <div className="stat-card amber">
              <div className="stat-label"><Clock size={14} /> Late</div>
              <div className="stat-value">{lateEmployees.length}</div>
            </div>
          </div>
          
          <div className="two-col">
            {/* On Time Employees Section */}
            <div className="card-box">
              <h4 style={{ marginBottom: '1rem' }}>✅ On Time Employees</h4>
              {onTimeEmployees.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text3)', padding: '2rem' }}>No on-time check-ins yet today</p>
              ) : (
                <table style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Check-in</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {onTimeEmployees.map(emp => (
                      <tr key={emp.id}>
                        <td style={{ fontWeight: 500 }}>{emp.name}</td>
                        <td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>
                          {formatCheckInTime(emp.check_in)}
                        </td>
                        <td><Badge type="present">On Time</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Late Arrivals Section */}
            <div className="card-box">
              <h4 style={{ marginBottom: '1rem' }}>⚠️ Late Arrivals</h4>
              {lateEmployees.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text3)', padding: '2rem' }}>No late arrivals today</p>
              ) : (
                <table style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Check-in</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lateEmployees.map(emp => (
                      <tr key={emp.id}>
                        <td style={{ fontWeight: 500 }}>{emp.name}</td>
                        <td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>
                          {formatCheckInTime(emp.check_in)}
                        </td>
                        <td><Badge type="late">Late</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {view === 'manual' && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <button className="btn btn-ghost" onClick={() => setView('main')}>
              <ArrowLeft size={18} /> Back to Overview
            </button>
          </div>
          <div className="card-box" style={{ maxWidth: '500px' }}>
            <h4 style={{ marginBottom: '1rem' }}>Manual Attendance Entry</h4>
            <p style={{ color: 'var(--text3)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Use this form to manually record attendance for employees who couldn't scan their fingerprint.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Employee</label>
                <select className="form-select" value={formData.employee_id} onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}>
                  <option value="">Select Employee</option>
                  {employees.map(emp => (<option key={emp.id} value={emp.id}>{emp.name} ({emp.employee_code})</option>))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label"><CalendarIcon size={14} /> Date</label>
                <input className="form-input" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label"><Clock size={14} /> Time</label>
                <input className="form-input" type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Record Type</label>
                <select className="form-select" value={formData.record_type} onChange={(e) => setFormData({ ...formData, record_type: e.target.value })}>
                  <option>IN</option>
                  <option>OUT</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Reason</label>
                <input className="form-input" placeholder="e.g., Fingerprint reader issue" value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button className="btn btn-teal" onClick={handleManualSubmit}>Submit Entry</button>
                <button className="btn btn-ghost" onClick={() => setView('main')}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Today;