// src/pages/org/Settings.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { orgApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Save, AlertCircle, CheckCircle, Clock, Calendar, AlertTriangle } from 'lucide-react';

const Settings = () => {
  const { logout } = useAuth();
  const [settings, setSettings] = useState({
    office_start_time: "09:00:00",
    office_end_time: "18:00:00",
    late_threshold_minutes: 15,
    working_days: "1,2,3,4,5"
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => { 
    fetchSettings(); 
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await orgApi.getSettings();
      setSettings(data || {});
    } catch (err) {
      if (err?.response?.status === 401) logout();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await orgApi.updateSettings(settings);
      setMessage({ type: "success", text: "Settings saved successfully!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to save settings" });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Settings" role="orgadmin" label="Department Admin" abbr="DA" color="#00d4aa" bgColor="rgba(0,212,170,0.15)">
        <div className="skeleton-loader" style={{ maxWidth: '500px' }}>
          <div style={{ background: 'var(--bg2)', borderRadius: '16px', height: '400px', animation: 'pulse 1.5s ease-in-out infinite' }}></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Settings" role="orgadmin" label="Department Admin" abbr="DA" color="#00d4aa" bgColor="rgba(0,212,170,0.15)">
      <style>{`
        .settings-card { max-width: 560px; margin: 0 auto; }
        .form-group { margin-bottom: 1.25rem; }
        .info-badge { background: var(--bg3); padding: 0.25rem 0.5rem; border-radius: 6px; font-size: 0.7rem; color: var(--text3); font-family: var(--mono); }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      {message && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000, animation: 'slideIn 0.3s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: message.type === 'success' ? 'rgba(34,197,94,0.95)' : 'rgba(239,68,68,0.95)', padding: '12px 20px', borderRadius: '12px', color: 'white' }}>
            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {message.text}
          </div>
        </div>
      )}

      <div className="card-box settings-card">
        <h4 style={{ marginBottom: '0.5rem' }}>Department Settings</h4>
        <p style={{ color: 'var(--text3)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Configure attendance rules and working hours for your department</p>

        <div className="form-group">
          <label className="form-label"><Clock size={14} /> Office Start Time</label>
          <input 
            className="form-input" 
            type="time" 
            value={settings.office_start_time?.slice(0, 5)} 
            onChange={(e) => setSettings({ ...settings, office_start_time: e.target.value + ":00" })} 
          />
          <p style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: '4px' }}>Employees are expected to check-in by this time</p>
        </div>

        <div className="form-group">
          <label className="form-label"><Clock size={14} /> Office End Time</label>
          <input 
            className="form-input" 
            type="time" 
            value={settings.office_end_time?.slice(0, 5)} 
            onChange={(e) => setSettings({ ...settings, office_end_time: e.target.value + ":00" })} 
          />
        </div>

        <div className="form-group">
          <label className="form-label"><AlertTriangle size={14} /> Late Threshold (minutes)</label>
          <input 
            className="form-input" 
            type="number" 
            value={settings.late_threshold_minutes} 
            onChange={(e) => setSettings({ ...settings, late_threshold_minutes: parseInt(e.target.value) || 0 })} 
          />
          <p style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: '4px' }}>Employees arriving after this many minutes are marked as late</p>
        </div>

        <div className="form-group">
          <label className="form-label"><Calendar size={14} /> Working Days</label>
          <input 
            className="form-input" 
            placeholder="e.g., 1,2,3,4,5" 
            value={settings.working_days} 
            onChange={(e) => setSettings({ ...settings, working_days: e.target.value })} 
          />
          <p style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: '4px' }}>1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 7=Sun</p>
        </div>

        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          <button 
            className="btn btn-teal" 
            onClick={handleSave} 
            disabled={saving} 
            style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;