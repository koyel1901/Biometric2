// src/pages/org/ReportAtt.jsx
import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { orgApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Download, Calendar, RefreshCw, AlertCircle, FileText, TrendingUp } from 'lucide-react';

const ReportAtt = () => {
  const { logout } = useAuth();
  const today = new Date().toISOString().split("T")[0];
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generated, setGenerated] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    setError("");
    setGenerated(false);
    try {
      const employees = await orgApi.getEmployees();
      const dates = [];
      let current = new Date(fromDate);
      const last = new Date(toDate);
      while (current <= last) {
        dates.push(new Date(current).toISOString().split("T")[0]);
        current.setDate(current.getDate() + 1);
      }

      const reportMap = {};
      employees.forEach(emp => { reportMap[emp.id] = { name: emp.name, present: 0, late: 0, absent: 0, employee_code: emp.employee_code }; });

      for (const d of dates) {
        const records = await orgApi.getAttendanceByDate(d);
        const presentMap = {};
        records.forEach(r => { presentMap[r.employee_id] = r.status; });
        employees.forEach(emp => {
          const status = presentMap[emp.id];
          if (status === "present" || status === "on_time") reportMap[emp.id].present++;
          else if (status === "late") reportMap[emp.id].late++;
          else reportMap[emp.id].absent++;
        });
      }

      const result = Object.values(reportMap).map(r => {
        const totalDays = r.present + r.late + r.absent;
        const percent = totalDays > 0 ? ((r.present + r.late) / totalDays * 100).toFixed(1) : 0;
        return { ...r, percent: percent + "%" };
      });
      setSummary(result);
      setGenerated(true);
    } catch (err) {
      if (err?.response?.status === 401) logout();
      setError("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    let csv = "Employee Code,Employee Name,Present,Late,Absent,Attendance%\n";
    summary.forEach(s => { csv += `${s.employee_code || ''},${s.name},${s.present},${s.late},${s.absent},${s.percent}\n`; });
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `attendance_report_${fromDate}_to_${toDate}.csv`;
    link.click();
  };

  const totalPresent = summary.reduce((sum, s) => sum + s.present, 0);
  const totalLate = summary.reduce((sum, s) => sum + s.late, 0);
  const avgAttendance = summary.length > 0 ? (totalPresent / (summary.length * (summary[0]?.present + summary[0]?.late + summary[0]?.absent || 1)) * 100).toFixed(1) : 0;

  return (
    <DashboardLayout title="Attendance Report" role="orgadmin" label="Department Admin" abbr="DA" color="#00d4aa" bgColor="rgba(0,212,170,0.15)">
      <style>{`
        .stat-card { transition: all 0.2s; }
        .stat-card:hover { transform: translateY(-2px); }
      `}</style>

      <div className="stats-grid">
        <div className="stat-card teal"><div className="stat-label"><TrendingUp size={14} /> Total Present Days</div><div className="stat-value">{totalPresent}</div><div className="stat-sub">Across all employees</div></div>
        <div className="stat-card amber"><div className="stat-label">Late Arrivals</div><div className="stat-value">{totalLate}</div><div className="stat-sub">Total late marks</div></div>
        <div className="stat-card green"><div className="stat-label">Avg Attendance</div><div className="stat-value">{avgAttendance}%</div><div className="stat-sub">Department average</div></div>
      </div>

      <div className="card-box" style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ marginBottom: '0.5rem' }}>Generate Attendance Report</h4>
        <p style={{ color: 'var(--text3)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Select a date range to generate attendance summary</p>
        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px', marginBottom: '1rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertCircle size={16} /> {error}</div>}
        <div className="form-grid" style={{ marginBottom: '1rem' }}>
          <div className="form-group"><label className="form-label"><Calendar size={14} /> From Date</label><input className="form-input" type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} /></div>
          <div className="form-group"><label className="form-label"><Calendar size={14} /> To Date</label><input className="form-input" type="date" value={toDate} onChange={e => setToDate(e.target.value)} /></div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-teal" onClick={generateReport} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RefreshCw size={16} /> {loading ? 'Generating...' : 'Generate Report'}</button>
          <button className="btn btn-ghost" onClick={downloadCSV} disabled={!generated || summary.length === 0} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Download size={16} /> Download CSV</button>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-header"><span className="table-title"><FileText size={16} /> Attendance Summary {generated && `(${fromDate} to ${toDate})`}</span></div>
        {loading ? (<div style={{ textAlign: 'center', padding: '3rem' }}>Loading report data...</div>) : !generated ? (<div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text3)' }}>Click "Generate Report" to view attendance summary</div>) : summary.length === 0 ? (<div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text3)' }}>No data found for selected date range</div>) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '500px' }}>
              <thead>
                <tr><th>Employee</th><th>Code</th><th>Present</th><th>Late</th><th>Absent</th><th>%</th></tr>
              </thead>
              <tbody>
                {summary.map((s, i) => (
                  <tr key={i}>
                    <td>{s.name}</td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>{s.employee_code || '—'}</td>
                    <td style={{ fontWeight: 600, color: '#22c55e' }}>{s.present}</td>
                    <td style={{ fontWeight: 600, color: '#f59e0b' }}>{s.late}</td>
                    <td style={{ fontWeight: 600, color: '#ef4444' }}>{s.absent}</td>
                    <td style={{ fontFamily: 'var(--mono)', fontWeight: 600 }}>{s.percent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ReportAtt;