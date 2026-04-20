// src/pages/org/Attendance.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Badge from '../../components/Badge';
import { orgApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Search, RefreshCw, AlertCircle, Calendar, User, Clock, Filter, Download } from 'lucide-react';

const Attendance = () => {
  const { logout } = useAuth();
  const todayDate = new Date().toISOString().split('T')[0];
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0 });

  const fetchAttendance = async (date) => {
    setLoading(true);
    setError("");
    try {
      const data = await orgApi.getAttendanceByDate(date);
      setAttendance(data || []);
      const present = (data || []).filter(a => a.status === "present").length;
      const late = (data || []).filter(a => a.punctuality === "late").length;
      setStats({ present, absent: (data?.length || 0) - present, late });
    } catch (err) {
      if (err?.response?.status === 401) logout();
      setError("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAttendance(selectedDate); }, [selectedDate]);

  const filteredData = attendance.filter(a => {
    const matchesSearch = a.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout title="Attendance List" role="orgadmin" label="Department Admin" abbr="DA" color="#00d4aa" bgColor="rgba(0,212,170,0.15)">
      <style>{`
        .stat-card { transition: all 0.2s; }
        .stat-card:hover { transform: translateY(-2px); }
      `}</style>

      <div className="stats-grid">
        <div className="stat-card green"><div className="stat-label"><User size={14} /> Present</div><div className="stat-value">{stats.present}</div><div className="stat-sub">Marked attendance</div></div>
        <div className="stat-card red"><div className="stat-label"><User size={14} /> Absent</div><div className="stat-value">{stats.absent}</div><div className="stat-sub">No check-in</div></div>
        <div className="stat-card amber"><div className="stat-label"><Clock size={14} /> Late</div><div className="stat-value">{stats.late}</div><div className="stat-sub">Arrived after 9:15 AM</div></div>
      </div>

      <div className="table-wrap">
        <div className="table-header">
          <span className="table-title">Attendance for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="input-wrap" style={{ position: 'relative' }}><Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} /><input className="form-input" placeholder="Search employee..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: '32px', width: '180px' }} /></div>
            <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: '120px' }}><option value="all">All Status</option><option value="present">Present</option><option value="absent">Absent</option><option value="late">Late</option></select>
            <div className="input-wrap" style={{ position: 'relative' }}><Calendar size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} /><input type="date" className="form-input" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={{ paddingLeft: '32px', width: '150px' }} /></div>
            <button className="btn btn-ghost" onClick={() => fetchAttendance(selectedDate)}><RefreshCw size={14} /> Refresh</button>
          </div>
        </div>
        {error && <div style={{ color: '#f87171', padding: '1rem', textAlign: 'center' }}><AlertCircle size={16} /> {error}</div>}
        {loading ? (<div style={{ textAlign: 'center', padding: '3rem' }}>Loading attendance data...</div>) : (
          <table style={{ width: '100%' }}>
            <thead>
              <tr><th>Employee</th><th>Department</th><th>Check In</th><th>Check Out</th><th>Hours</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text3)' }}>No attendance records found</td></tr>
              ) : (
                filteredData.map(a => (
                  <tr key={a.id}>
                    <td><div style={{ fontWeight: 500 }}>{a.name}</div><div style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>{a.employee_code}</div></td>
                    <td>{a.department_name || '—'}</td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>{a.check_in ? new Date(a.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--"}</td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>{a.check_out ? new Date(a.check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--"}</td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>{a.hours_worked ? `${a.hours_worked}h` : "--"}</td>
                    <td><Badge type={a.status === "present" && a.punctuality === "late" ? "late" : a.status}>{a.status === "present" && a.punctuality === "late" ? "Late" : a.status === "present" ? "Present" : "Absent"}</Badge></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Attendance;