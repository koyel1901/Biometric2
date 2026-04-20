// src/pages/org/Today.jsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, UserCheck, UserX, Clock, Calendar as CalendarIcon, Timer, AlertCircle, RefreshCw } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Badge from '../../components/Badge';
import { orgApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Today = () => {
  const { logout } = useAuth();
  const [view, setView] = useState('main');
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ employee_id: '', date: new Date().toISOString().split('T')[0], time: '09:00', record_type: 'IN', reason: '' });
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchTodayAttendance();
    fetchEmployees();
  }, []);

  const fetchTodayAttendance = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await orgApi.getTodayAttendance();
      setAttendance(data || []);
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

  const presentEmployees = attendance.filter(a => a.status === "present");
  const lateEmployees = attendance.filter(a => a.punctuality === "late");
  const absentEmployees = attendance.filter(a => a.status === "absent");

  const handleManualSubmit = () => {
    setSuccessMsg(`Manual entry recorded for ${formData.employee_id}`);
    setTimeout(() => setSuccessMsg(""), 3000);
    setView('main');
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
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
      {successMsg && <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'rgba(34,197,94,0.95)', color: 'white', padding: '12px 20px', borderRadius: '12px', zIndex: 1000, animation: 'slideIn 0.3s ease' }}>{successMsg}</div>}
      {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '12px 16px', marginBottom: '1rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertCircle size={16} /> {error}<button onClick={fetchTodayAttendance} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}><RefreshCw size={14} /></button></div>}

      {view === 'main' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Daily Overview - {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
            <button className="btn btn-teal" onClick={() => setView('manual')}><Plus size={16} /> Manual Entry</button>
          </div>
          <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
            <div className="stat-card green"><div className="stat-label"><UserCheck size={14} /> Present</div><div className="stat-value">{presentEmployees.length}</div><div className="stat-sub">{attendance.length > 0 ? Math.round((presentEmployees.length / attendance.length) * 100) : 0}% of department</div></div>
            <div className="stat-card red"><div className="stat-label"><UserX size={14} /> Absent</div><div className="stat-value">{absentEmployees.length}</div></div>
            <div className="stat-card amber"><div className="stat-label"><Clock size={14} /> Late</div><div className="stat-value">{lateEmployees.length}</div></div>
          </div>
          <div className="two-col">
            <div className="card-box"><h4 style={{ marginBottom: '1rem' }}>✅ Present Employees</h4>{presentEmployees.length === 0 ? (<p style={{ textAlign: 'center', color: 'var(--text3)', padding: '2rem' }}>No check-ins yet today</p>) : (<table style={{ width: '100%' }}><thead><tr><th>Name</th><th>Check-in</th><th>Status</th></tr></thead><tbody>{presentEmployees.map(emp => (<tr key={emp.id}><td style={{ fontWeight: 500 }}>{emp.name}</td><td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>{emp.check_in ? new Date(emp.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--"}</td><td><Badge type={emp.punctuality === 'late' ? 'late' : 'present'}>{emp.punctuality === 'late' ? 'Late' : 'On Time'}</Badge></td></tr>))}</tbody></table>)}</div>
            <div className="card-box"><h4 style={{ marginBottom: '1rem' }}>⚠️ Late Arrivals</h4>{lateEmployees.length === 0 ? (<p style={{ textAlign: 'center', color: 'var(--text3)', padding: '2rem' }}>No late arrivals today</p>) : (<table style={{ width: '100%' }}><thead><tr><th>Name</th><th>Check-in</th><th>Delay</th></tr></thead><tbody>{lateEmployees.map(emp => (<tr key={emp.id}><td style={{ fontWeight: 500 }}>{emp.name}</td><td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>{emp.check_in ? new Date(emp.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--"}</td><td><Badge type="late">Late</Badge></td></tr>))}</tbody></table>)}</div>
          </div>
        </div>
      )}

      {view === 'manual' && (
        <div>
          <div style={{ marginBottom: '1.5rem' }}><button className="btn btn-ghost" onClick={() => setView('main')}><ArrowLeft size={18} /> Back to Overview</button></div>
          <div className="card-box" style={{ maxWidth: '500px' }}><h4 style={{ marginBottom: '1rem' }}>Manual Attendance Entry</h4><p style={{ color: 'var(--text3)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Use this form to manually record attendance for employees who couldn't scan their fingerprint.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group"><label className="form-label">Employee</label><select className="form-select" value={formData.employee_id} onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}><option value="">Select Employee</option>{employees.map(emp => (<option key={emp.id} value={emp.id}>{emp.name} ({emp.employee_code})</option>))}</select></div>
              <div className="form-group"><label className="form-label"><CalendarIcon size={14} /> Date</label><input className="form-input" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} /></div>
              <div className="form-group"><label className="form-label"><Clock size={14} /> Time</label><input className="form-input" type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Record Type</label><select className="form-select" value={formData.record_type} onChange={(e) => setFormData({ ...formData, record_type: e.target.value })}><option>IN</option><option>OUT</option></select></div>
              <div className="form-group"><label className="form-label">Reason</label><input className="form-input" placeholder="e.g., Fingerprint reader issue" value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} /></div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}><button className="btn btn-teal" onClick={handleManualSubmit}>Submit Entry</button><button className="btn btn-ghost" onClick={() => setView('main')}>Cancel</button></div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Today;