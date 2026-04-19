// src/pages/tenant/Attendance.jsx
import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, AlertCircle, Calendar as CalendarIcon, Download, Filter, FileText } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Badge from '../../components/Badge';
import { tenantApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Attendance = () => {
  const { logout } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDept, setSelectedDept] = useState('');
  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0 });
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchAttendance();
    fetchDepartments();
  }, [selectedDate, selectedDept]);

  const fetchAttendance = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await tenantApi.getAttendanceByDate(selectedDate, selectedDept || undefined);
      setAttendance(data || []);
      
      const present = data?.filter(a => a.status === 'present').length || 0;
      const late = data?.filter(a => a.punctuality === 'late').length || 0;
      setStats({ present, absent: (data?.length || 0) - present, late });
    } catch (err) {
      console.error('Fetch attendance error:', err);
      if (err?.response?.status === 401) logout();
      setError('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await tenantApi.getDepartments();
      setDepartments(data || []);
    } catch (err) {
      console.error('Fetch departments error:', err);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '--';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateForPDF = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const generatePDF = async () => {
    setExporting(true);
    
    // Dynamically import html2pdf
    const html2pdf = await import('html2pdf.js');
    
    // Create a temporary div for PDF content
    const pdfContent = document.createElement('div');
    pdfContent.style.padding = '20px';
    pdfContent.style.fontFamily = 'Arial, sans-serif';
    pdfContent.style.backgroundColor = 'white';
    pdfContent.style.color = '#333';
    
    // Add header
    pdfContent.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #a855f7; padding-bottom: 20px;">
        <h1 style="color: #a855f7; margin: 0;">Sentinel Attendance Report</h1>
        <p style="color: #666; margin: 10px 0 0 0;">Generated on ${new Date().toLocaleString()}</p>
        <h2 style="margin: 15px 0 0 0; color: #333;">${formatDateForPDF(selectedDate)}</h2>
        ${selectedDept ? `<p style="margin: 5px 0 0 0; color: #666;">Department: ${departments.find(d => d.department_id === parseInt(selectedDept))?.department_name || 'Selected Department'}</p>` : '<p style="margin: 5px 0 0 0; color: #666;">All Departments</p>'}
      </div>
      
      <div style="display: flex; justify-content: space-around; margin-bottom: 30px; gap: 15px;">
        <div style="flex: 1; text-align: center; padding: 15px; background: #f0fdf4; border-radius: 10px;">
          <div style="font-size: 24px; font-weight: bold; color: #22c55e;">${stats.present}</div>
          <div style="color: #666; font-size: 12px;">Present</div>
        </div>
        <div style="flex: 1; text-align: center; padding: 15px; background: #fef2f2; border-radius: 10px;">
          <div style="font-size: 24px; font-weight: bold; color: #ef4444;">${stats.absent}</div>
          <div style="color: #666; font-size: 12px;">Absent</div>
        </div>
        <div style="flex: 1; text-align: center; padding: 15px; background: #fffbeb; border-radius: 10px;">
          <div style="font-size: 24px; font-weight: bold; color: #f59e0b;">${stats.late}</div>
          <div style="color: #666; font-size: 12px;">Late</div>
        </div>
      </div>
      
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f3f4f6; border-bottom: 2px solid #a855f7;">
            <th style="padding: 12px; text-align: left; font-weight: 600;">Employee</th>
            <th style="padding: 12px; text-align: left; font-weight: 600;">Code</th>
            <th style="padding: 12px; text-align: left; font-weight: 600;">Department</th>
            <th style="padding: 12px; text-align: left; font-weight: 600;">Check In</th>
            <th style="padding: 12px; text-align: left; font-weight: 600;">Check Out</th>
            <th style="padding: 12px; text-align: left; font-weight: 600;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${attendance.map(record => `
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px;">${record.name}</td>
              <td style="padding: 10px;">${record.employee_code || '—'}</td>
              <td style="padding: 10px;">${record.department_name || '—'}</td>
              <td style="padding: 10px;">${formatTime(record.check_in)}</td>
              <td style="padding: 10px;">${formatTime(record.check_out)}</td>
              <td style="padding: 10px;">
                <span style="padding: 4px 8px; border-radius: 12px; font-size: 11px; ${
                  record.status === 'present' 
                    ? record.punctuality === 'late' 
                      ? 'background: #fffbeb; color: #f59e0b;' 
                      : 'background: #f0fdf4; color: #22c55e;'
                    : 'background: #fef2f2; color: #ef4444;'
                }">
                  ${record.status === 'present' ? (record.punctuality === 'late' ? 'Late' : 'Present') : 'Absent'}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #999; font-size: 10px;">
        This is a system-generated report from Sentinel Biometric Attendance System.
      </div>
    `;
    
    document.body.appendChild(pdfContent);
    
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `attendance_report_${selectedDate}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    
    await html2pdf.default().set(opt).from(pdfContent).save();
    document.body.removeChild(pdfContent);
    setExporting(false);
  };

  if (loading) {
    return (
      <DashboardLayout 
        title="Attendance" 
        role="superadmin" 
        label="Tenant Admin" 
        abbr="TA" 
        color="#a855f7" 
        bgColor="rgba(168,85,247,0.15)"
      >
        <div className="skeleton-loader">
          {[1, 2, 3].map(i => <div key={i} style={{ background: 'var(--bg2)', borderRadius: '12px', height: '120px', animation: 'pulse 1.5s ease-in-out infinite' }}></div>)}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Attendance Management" 
      role="superadmin" 
      label="Tenant Admin" 
      abbr="TA" 
      color="#a855f7" 
      bgColor="rgba(168,85,247,0.15)"
    >
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card green">
          <div className="stat-label">Present</div>
          <div className="stat-value">{stats.present}</div>
          <div className="stat-sub">Marked attendance</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">Absent</div>
          <div className="stat-value">{stats.absent}</div>
          <div className="stat-sub">No check-in</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-label">Late</div>
          <div className="stat-value">{stats.late}</div>
          <div className="stat-sub">Arrived after 9:15 AM</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div className="input-wrap" style={{ position: 'relative' }}>
            <CalendarIcon size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
            <input 
              type="date" 
              className="form-input" 
              style={{ paddingLeft: '32px', width: '180px' }}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <select 
            className="form-select" 
            style={{ width: '160px' }}
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.filter(d => d.is_active).map(dept => (
              <option key={dept.department_id} value={dept.department_id}>
                {dept.department_name}
              </option>
            ))}
          </select>
          <button className="btn btn-ghost" onClick={fetchAttendance}>
            <RefreshCw size={16} style={{ marginRight: '4px' }} /> Refresh
          </button>
        </div>
        <button 
          className="btn btn-teal" 
          onClick={generatePDF}
          disabled={exporting || attendance.length === 0}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FileText size={16} />
          {exporting ? 'Generating PDF...' : 'Export PDF'}
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '12px', marginBottom: '1rem', color: '#f87171' }}>
          <AlertCircle size={16} style={{ display: 'inline', marginRight: '8px' }} /> {error}
        </div>
      )}

      {/* Attendance Table */}
      <div className="table-wrap">
        <div className="table-header">
          <span className="table-title">Attendance for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Code</th>
              <th>Department</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text3)' }}>
                  No attendance records found
                </td>
              </tr>
            ) : (
              attendance.map((record, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 500 }}>{record.name}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>{record.employee_code || '—'}</td>
                  <td>{record.department_name || '—'}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>{formatTime(record.check_in)}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>{formatTime(record.check_out)}</td>
                  <td>
                    <Badge type={record.status === 'present' ? (record.punctuality === 'late' ? 'late' : 'present') : 'absent'}>
                      {record.status === 'present' ? (record.punctuality === 'late' ? 'Late' : 'Present') : 'Absent'}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;