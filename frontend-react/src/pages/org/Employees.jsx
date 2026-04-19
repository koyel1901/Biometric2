import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Plus, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Badge from '../../components/Badge';
import { orgApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// ─── Toast notification ───────────────────────────────────────────────────────
function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const bg = type === 'success' ? 'rgba(0,212,170,0.15)' : 'rgba(239,68,68,0.15)';
  const border = type === 'success' ? 'rgba(0,212,170,0.4)' : 'rgba(239,68,68,0.4)';
  const color  = type === 'success' ? '#00d4aa' : '#f87171';
  const Icon   = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
      display: 'flex', alignItems: 'center', gap: '10px',
      background: bg, border: `1px solid ${border}`, borderRadius: '12px',
      padding: '12px 18px', color, fontSize: '0.9rem', backdropFilter: 'blur(8px)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)', maxWidth: '360px',
      animation: 'slideInRight 0.3s ease',
    }}>
      <Icon size={18} style={{ flexShrink: 0 }} />
      {message}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ height = '1rem', width = '100%', radius = '6px' }) {
  return (
    <div style={{
      height, width, borderRadius: radius,
      background: 'linear-gradient(90deg, var(--bg3) 25%, var(--bg4) 50%, var(--bg3) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
    }} />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const Employees = () => {
  const { logout } = useAuth();
  const [view,      setView]      = useState('list'); // 'list' | 'add'
  const [employees, setEmployees] = useState([]);
  const [slots,     setSlots]     = useState({ available: [] });
  const [loading,   setLoading]   = useState(true);
  const [submitting,setSubmitting]= useState(false);
  const [toast,     setToast]     = useState(null);
  const [apiError,  setApiError]  = useState('');

  // Add-form state
  const [form, setForm] = useState({ name: '', employee_code: '', password: '', finger_id: '' });
  const [formErr, setFormErr] = useState('');

  // ── Fetch employees ──────────────────────────────────────────────────────
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setApiError('');
    try {
      const [empRes, slotRes] = await Promise.all([
        orgApi.getEmployees(),
        orgApi.getAvailableSlots(),
      ]);
      setEmployees(empRes.data ?? []);
      setSlots(slotRes.data ?? { available: [] });
    } catch (err) {
      if (err?.response?.status === 401) { logout(); return; }
      setApiError('Failed to load employees. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  // ── Deactivate employee ──────────────────────────────────────────────────
  const handleDeactivate = async (id, name) => {
    if (!window.confirm(`Deactivate ${name}? This will remove their fingerprint slot.`)) return;
    try {
      await orgApi.deleteEmployee(id);
      setToast({ message: `${name} deactivated successfully.`, type: 'success' });
      fetchEmployees();
    } catch (err) {
      setToast({ message: err?.response?.data?.detail || 'Failed to deactivate.', type: 'error' });
    }
  };

  // ── Add employee ─────────────────────────────────────────────────────────
  const handleAdd = async (e) => {
    e.preventDefault();
    setFormErr('');

    if (!form.name.trim()) { setFormErr('Full name is required.'); return; }

    setSubmitting(true);
    try {
      const payload = {
        name:          form.name.trim(),
        employee_code: form.employee_code.trim() || undefined,
        password:      form.password.trim()       || undefined,
        finger_id:     form.finger_id             ? parseInt(form.finger_id, 10) : undefined,
      };
      const res = await orgApi.createEmployee(payload);
      const creds = res.data?.credentials;

      setToast({
        message: `${creds?.name} added! Code: ${creds?.employee_code}, FP: ${creds?.finger_id}`,
        type: 'success',
      });
      setForm({ name: '', employee_code: '', password: '', finger_id: '' });
      setView('list');
      fetchEmployees();
    } catch (err) {
      setFormErr(err?.response?.data?.detail || 'Failed to add employee.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="All Employees"
      role="orgadmin"
      label="Department Admin"
      abbr="DA"
      color="#00d4aa"
      bgColor="rgba(0,212,170,0.15)"
    >
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes slideInRight { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>

      {/* Toast */}
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* ── LIST VIEW ──────────────────────────────────────────────────────── */}
      {view === 'list' && (
        <div id="emp-list-view">
          {apiError && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '10px', padding: '12px 16px', color: '#f87171',
              marginBottom: '1.5rem', fontSize: '0.88rem', display: 'flex',
              alignItems: 'center', gap: '8px',
            }}>
              <AlertCircle size={16} /> {apiError}
              <button
                onClick={fetchEmployees}
                style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem' }}
              >
                <RefreshCw size={14} /> Retry
              </button>
            </div>
          )}

          <div className="table-wrap">
            <div className="table-header">
              <span className="table-title">
                Employee Registry
                {!loading && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text3)', marginLeft: '8px', fontWeight: 400 }}>
                    ({employees.length} records)
                  </span>
                )}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-ghost"
                  onClick={fetchEmployees}
                  disabled={loading}
                  title="Refresh"
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                  Refresh
                </button>
                <button
                  id="add-employee-btn"
                  className="btn btn-teal"
                  onClick={() => setView('add')}
                >
                  <Plus size={16} style={{ marginRight: '4px' }} /> Add
                </button>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Emp Code</th>
                  <th>Name</th>
                  <th>FP Slot</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 5 }).map((__, j) => (
                        <td key={j}><Skeleton height="1rem" width={j === 4 ? '80px' : undefined} /></td>
                      ))}
                    </tr>
                  ))
                  : employees.length === 0
                    ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text3)', padding: '2rem' }}>
                          No employees found. Add your first employee!
                        </td>
                      </tr>
                    )
                    : employees.map((emp) => (
                      <tr key={emp.id}>
                        <td style={{ fontFamily: 'var(--mono)' }}>{emp.employee_code ?? '—'}</td>
                        <td>{emp.name}</td>
                        <td style={{ fontFamily: 'var(--mono)' }}>
                          {emp.finger_id ? `FP-${String(emp.finger_id).padStart(3, '0')}` : <span style={{ color: 'var(--text3)' }}>Not enrolled</span>}
                        </td>
                        <td>
                          <Badge type={emp.is_active ? 'active' : 'inactive'}>
                            {emp.is_active ? 'active' : 'inactive'}
                          </Badge>
                        </td>
                        <td style={{ display: 'flex', gap: '6px', padding: '0.85rem 0' }}>
                          <button
                            className="btn btn-ghost"
                            style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                            disabled={!emp.is_active}
                            onClick={() => handleDeactivate(emp.id, emp.name)}
                          >
                            Deactivate
                          </button>
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── ADD VIEW ───────────────────────────────────────────────────────── */}
      {view === 'add' && (
        <div id="add-emp-view">
          <div style={{ marginBottom: '1.5rem' }}>
            <button
              className="btn btn-ghost"
              onClick={() => { setView('list'); setFormErr(''); }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft size={18} /> Back to Employees
            </button>
          </div>

          <div className="card-box" style={{ maxWidth: '600px' }}>
            <h4>Add New Employee</h4>
            <p style={{ color: 'var(--text3)', fontSize: '0.82rem', marginBottom: '1rem', lineHeight: 1.5 }}>
              Leave <strong>Employee Code</strong>, <strong>Password</strong>, and <strong>FP Slot</strong> blank to auto-generate them.
              Credentials will be shown after saving.
            </p>

            {formErr && (
              <div style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '10px', padding: '10px 14px', color: '#f87171',
                marginBottom: '1rem', fontSize: '0.85rem', display: 'flex',
                alignItems: 'center', gap: '8px',
              }}>
                <AlertCircle size={15} /> {formErr}
              </div>
            )}

            <form onSubmit={handleAdd}>
              <div className="form-grid" style={{ marginTop: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    id="emp-name-input"
                    className="form-input"
                    placeholder="e.g. Aarav Kumar"
                    value={form.name}
                    onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                    disabled={submitting}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Employee Code <span style={{ color: 'var(--text3)' }}>(auto)</span></label>
                  <input
                    id="emp-code-input"
                    className="form-input"
                    placeholder="e.g. EMP101 (leave blank to auto-generate)"
                    value={form.employee_code}
                    onChange={(e) => setForm(f => ({ ...f, employee_code: e.target.value }))}
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password <span style={{ color: 'var(--text3)' }}>(auto if blank)</span></label>
                  <input
                    id="emp-password-input"
                    type="text"
                    className="form-input"
                    placeholder="Min 8 chars, upper+lower+number"
                    value={form.password}
                    onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Fingerprint Slot <span style={{ color: 'var(--text3)' }}>(auto)</span></label>
                  <select
                    id="emp-finger-select"
                    className="form-select"
                    value={form.finger_id}
                    onChange={(e) => setForm(f => ({ ...f, finger_id: e.target.value }))}
                    disabled={submitting}
                  >
                    <option value="">Auto-assign next free slot</option>
                    {slots.available?.slice(0, 30).map((fp) => (
                      <option key={fp} value={fp}>Slot {fp}</option>
                    ))}
                  </select>
                  {slots.free_count !== undefined && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: '4px' }}>
                      {slots.free_count} of 127 slots available
                    </p>
                  )}
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button
                  id="save-employee-btn"
                  type="submit"
                  className="btn btn-teal"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Register Employee'}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => { setView('list'); setFormErr(''); }}
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Employees;
