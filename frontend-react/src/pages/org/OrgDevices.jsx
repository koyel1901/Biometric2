// src/pages/org-admin/OrgDevices.jsx
import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  AlertCircle, 
  Clock, 
  Search, 
  Activity,
  Server,
  CheckCircle,
  Power,
  PowerOff,
  Send,
  Fingerprint,
  Trash2,
  X,
  User,
  Plus
} from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Badge from '../../components/Badge';
import { orgApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// Add Device Modal
const AddDeviceModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ device_id: '', secret_key: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { logout } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    if (!formData.device_id.trim()) {
      setError('Device ID is required');
      setSubmitting(false);
      return;
    }
    if (!formData.secret_key.trim() || formData.secret_key.length < 8) {
      setError('Secret key must be at least 8 characters');
      setSubmitting(false);
      return;
    }
    
    try {
      await orgApi.createDevice(formData);
      setFormData({ device_id: '', secret_key: '' });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add device');
      if (err?.response?.status === 401) logout();
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className="add-modal-header">
          <div className="add-modal-icon">
            <Cpu size={28} />
          </div>
          <h3>Add New Device</h3>
          <p>Register a biometric device to your organization</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="add-modal-body">
            {error && (
              <div className="error-message">
                <AlertCircle size={16} /> {error}
              </div>
            )}
            
            <div className="form-group">
              <label className="form-label">Device ID *</label>
              <input 
                className="form-input" 
                placeholder="e.g., FP-001, DEVICE-01"
                value={formData.device_id}
                onChange={(e) => setFormData({ ...formData, device_id: e.target.value })}
                required
              />
              <p className="form-hint">Unique identifier for this device</p>
            </div>
            
            <div className="form-group">
              <label className="form-label">Secret Key *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Minimum 8 characters"
                value={formData.secret_key}
                onChange={(e) => setFormData({ ...formData, secret_key: e.target.value })}
                required
                minLength={8}
              />
              <p className="form-hint">Secret key for device authentication (min 8 chars)</p>
            </div>
          </div>
          
          <div className="add-modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-teal" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Device'}
            </button>
          </div>
        </form>
      </div>
      
      <style>{`
        .add-modal {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 24px;
          max-width: 450px;
          width: 90%;
          position: relative;
          animation: modalSlideIn 0.3s ease;
        }
        .add-modal-header {
          text-align: center;
          padding: 24px 24px 16px 24px;
          border-bottom: 1px solid var(--border);
        }
        .add-modal-icon {
          width: 56px;
          height: 56px;
          background: rgba(20,184,166,0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
          color: #14b8a6;
        }
        .add-modal-header h3 {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .add-modal-header p {
          font-size: 0.8rem;
          color: var(--text3);
        }
        .add-modal-body {
          padding: 20px 24px;
        }
        .error-message {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          border-radius: 10px;
          padding: 10px 12px;
          margin-bottom: 16px;
          color: #f87171;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .form-hint {
          font-size: 0.7rem;
          color: var(--text3);
          margin-top: 4px;
        }
        .add-modal-footer {
          padding: 16px 24px 24px 24px;
          border-top: 1px solid var(--border);
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        @keyframes modalSlideIn {
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

// Fire Command Modal
const FireCommandModal = ({ isOpen, onClose, device, onSuccess }) => {
  const [commandType, setCommandType] = useState('enroll');
  const [targetId, setTargetId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    if (isOpen && device) {
      fetchEmployees();
    }
  }, [isOpen, device]);

  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const data = await orgApi.getEmployees();
      setEmployees(data || []);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (!targetId) {
      setError('Please enter a Finger ID');
      setSubmitting(false);
      return;
    }

    const targetIdNum = parseInt(targetId);
    if (targetIdNum < 1 || targetIdNum > 127) {
      setError('Finger ID must be between 1 and 127');
      setSubmitting(false);
      return;
    }

    try {
      await orgApi.fireCommand({
        device_id: device.device_id,
        command: commandType,
        target_id: targetIdNum
      });
      onSuccess();
      onClose();
      setTargetId('');
      setCommandType('enroll');
    } catch (err) {
      setError(err.message || 'Failed to send command');
      if (err?.response?.status === 401) logout();
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !device) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="fire-command-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className="modal-header">
          <div className="modal-icon">
            <Send size={28} />
          </div>
          <div className="modal-title-section">
            <h3>Send Command to Device</h3>
            <p>{device.device_id}</p>
          </div>
          <Badge type={device.status === 'online' ? 'online' : 'offline'}>
            {device.status === 'online' ? 'Online' : 'Offline'}
          </Badge>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="error-message">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Command Type</label>
              <div className="command-type-buttons">
                <button
                  type="button"
                  className={`command-btn ${commandType === 'enroll' ? 'active' : ''}`}
                  onClick={() => setCommandType('enroll')}
                >
                  <Fingerprint size={18} />
                  Enroll Fingerprint
                </button>
                <button
                  type="button"
                  className={`command-btn ${commandType === 'delete' ? 'active' : ''}`}
                  onClick={() => setCommandType('delete')}
                >
                  <Trash2 size={18} />
                  Delete Fingerprint
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                {commandType === 'enroll' ? 'Finger ID to Enroll' : 'Finger ID to Delete'}
              </label>
              
              {commandType === 'enroll' && employees.length > 0 && (
                <select 
                  className="form-input"
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                >
                  <option value="">Select an employee...</option>
                  {employees.filter(emp => emp.finger_id).map(emp => (
                    <option key={emp.id} value={emp.finger_id}>
                      {emp.full_name} (ID: {emp.finger_id})
                    </option>
                  ))}
                </select>
              )}

              <input 
                type="number"
                className="form-input"
                placeholder="Enter Finger ID (1-127)"
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                min="1"
                max="127"
                required
              />
              <p className="form-hint">
                {commandType === 'enroll' 
                  ? 'This fingerprint will be enrolled on the device' 
                  : 'This fingerprint will be deleted from the device'}
              </p>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={submitting || device.status !== 'online'}
              style={{ background: '#14b8a6' }}
            >
              {submitting ? 'Sending...' : 'Send Command'}
            </button>
          </div>
        </form>
      </div>
      
      <style>{`
        .fire-command-modal {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 24px;
          max-width: 500px;
          width: 90%;
          position: relative;
          animation: modalSlideIn 0.3s ease;
        }
        .modal-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: var(--bg3);
          border: none;
          color: var(--text2);
          cursor: pointer;
          padding: 6px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          z-index: 10;
        }
        .modal-header {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 24px 24px 20px 24px;
          border-bottom: 1px solid var(--border);
          background: linear-gradient(135deg, var(--bg2), var(--bg3));
        }
        .modal-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(20,184,166,0.1);
          color: #14b8a6;
        }
        .modal-title-section h3 {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .modal-title-section p {
          font-size: 0.75rem;
          color: var(--text3);
        }
        .modal-body {
          padding: 20px 24px;
        }
        .command-type-buttons {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }
        .command-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          color: var(--text2);
        }
        .command-btn.active {
          background: #14b8a6;
          border-color: #14b8a6;
          color: white;
        }
        .modal-footer {
          padding: 16px 24px 24px 24px;
          border-top: 1px solid var(--border);
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        .btn-primary {
          background: #14b8a6;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
        }
        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .btn-ghost {
          background: transparent;
          border: 1px solid var(--border);
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          color: var(--text2);
        }
      `}</style>
    </div>
  );
};

// Main Org Devices Component
const OrgDevices = () => {
  const { logout } = useAuth();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ total: 0, online: 0, offline: 0 });
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCommandModal, setShowCommandModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    fetchDevices();
    fetchDeviceStatus();
    
    const interval = setInterval(() => {
      fetchDevices();
      fetchDeviceStatus();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchDevices = async () => {
    try {
      const data = await orgApi.getDevices();
      setDevices(data || []);
      setError('');
    } catch (err) {
      console.error('Fetch devices error:', err);
      if (err?.response?.status === 401) logout();
      setError('Failed to load devices');
    } finally {
      setLoading(false);
    }
  };

  const fetchDeviceStatus = async () => {
    try {
      const data = await orgApi.getDeviceStatus();
      setStats(data || { total: 0, online: 0, offline: 0 });
    } catch (err) {
      console.error('Device status fetch error:', err);
    }
  };

  const handleCommandSuccess = () => {
    setSuccess('Command sent successfully!');
    setTimeout(() => setSuccess(''), 3000);
    fetchDevices();
    fetchDeviceStatus();
  };

  const handleAddSuccess = () => {
    setSuccess('Device added successfully!');
    setTimeout(() => setSuccess(''), 3000);
    fetchDevices();
    fetchDeviceStatus();
  };

  const formatLastSeen = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMins = Math.floor((now - date) / 60000);
    const diffHours = Math.floor((now - date) / 3600000);
    const diffDays = Math.floor((now - date) / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const isDeviceActuallyOnline = (device) => {
    if (device.status !== 'online') return false;
    if (!device.last_seen) return false;
    const lastSeen = new Date(device.last_seen);
    const now = new Date();
    const diffMinutes = (now - lastSeen) / 60000;
    return diffMinutes < 2;
  };

  const filteredDevices = devices.filter(device =>
    device.device_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onlinePercent = stats.total > 0 ? ((stats.online / stats.total) * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <DashboardLayout title="Devices" role="orgadmin" label="Org Admin" abbr="OA" color="#14b8a6" bgColor="rgba(20,184,166,0.15)">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          Loading devices...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Devices" role="orgadmin" label="Org Admin" abbr="OA" color="#14b8a6" bgColor="rgba(20,184,166,0.15)">
      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .stat-card {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 1.25rem;
          transition: all 0.2s;
        }
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }
        .stat-card.purple .stat-value { color: #a855f7; }
        .stat-card.green .stat-value { color: #22c55e; }
        .stat-card.red .stat-value { color: #ef4444; }
        .stat-label {
          font-size: 0.75rem;
          color: var(--text3);
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .stat-value {
          font-size: 2rem;
          font-weight: 700;
        }
        .stat-sub {
          font-size: 0.7rem;
          color: var(--text3);
          margin-top: 4px;
        }
        .device-card {
          transition: all 0.2s;
          background: var(--bg2);
          border-radius: 16px;
          padding: 1.25rem;
        }
        .device-card:hover {
          transform: translateY(-2px);
          border-color: #14b8a6 !important;
        }
        .success-toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: rgba(34,197,94,0.95);
          color: white;
          padding: 12px 20px;
          border-radius: 12px;
          z-index: 1000;
          animation: slideIn 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .btn-teal {
          background: #14b8a6;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .btn-ghost {
          background: transparent;
          border: 1px solid var(--border);
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          color: var(--text2);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .form-input {
          width: 100%;
          padding: 10px 12px;
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: 10px;
          color: var(--text);
        }
      `}</style>

      {success && <div className="success-toast"><CheckCircle size={18} /> {success}</div>}

      <div className="stats-grid">
        <div className="stat-card purple">
          <div className="stat-label"><Server size={14} /> Total Devices</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label"><Power size={14} /> Online</div>
          <div className="stat-value">{stats.online}</div>
          <div className="stat-sub">{onlinePercent}% of total</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label"><PowerOff size={14} /> Offline</div>
          <div className="stat-value">{stats.offline}</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: '300px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search by Device ID..." 
              style={{ paddingLeft: '32px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-ghost" onClick={() => { fetchDevices(); fetchDeviceStatus(); }}>
            <RefreshCw size={16} />
          </button>
        </div>
        <button className="btn-teal" onClick={() => setShowAddModal(true)}>
          <Plus size={16} />
          Add Device
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '12px 16px', marginBottom: '1rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {filteredDevices.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg2)', borderRadius: '20px' }}>
          <Cpu size={48} style={{ color: 'var(--text3)', marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text3)' }}>No devices found</p>
          <button className="btn-teal" onClick={() => setShowAddModal(true)} style={{ marginTop: '1rem' }}>
            Add your first device
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
          {filteredDevices.map(device => {
            const actuallyOnline = isDeviceActuallyOnline(device);
            const displayStatus = actuallyOnline ? 'online' : 'offline';
            
            return (
              <div key={device.device_id} className="device-card" style={{
                border: `1px solid ${displayStatus === 'online' ? 'rgba(34,197,94,0.3)' : 'var(--border)'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      background: displayStatus === 'online' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {displayStatus === 'online' ? <Wifi size={24} style={{ color: '#22c55e' }} /> : <WifiOff size={24} style={{ color: '#ef4444' }} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '1rem' }}>{device.device_id}</div>
                    </div>
                  </div>
                  <Badge type={displayStatus === 'online' ? 'online' : 'offline'}>
                    {displayStatus === 'online' ? 'Online' : 'Offline'}
                  </Badge>
                </div>
                
                <div style={{ marginBottom: '1rem', padding: '0.75rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text3)' }}>
                    <Clock size={14} />
                    Last seen: {formatLastSeen(device.last_seen)}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn-ghost" 
                    style={{ flex: 1, fontSize: '0.75rem', justifyContent: 'center' }}
                    onClick={() => {
                      setSelectedDevice(device);
                      setShowCommandModal(true);
                    }}
                    disabled={displayStatus !== 'online'}
                  >
                    <Send size={14} /> Send Command
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AddDeviceModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
      />

      <FireCommandModal 
        isOpen={showCommandModal}
        onClose={() => { setShowCommandModal(false); setSelectedDevice(null); }}
        device={selectedDevice}
        onSuccess={handleCommandSuccess}
      />
    </DashboardLayout>
  );
};

export default OrgDevices;