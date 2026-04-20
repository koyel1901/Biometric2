// src/pages/tenant/Devices.jsx
import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  AlertCircle, 
  Clock, 
  Search, 
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Key,
  Hash
} from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Badge from '../../components/Badge';
import { tenantApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Devices = () => {
  const { logout } = useAuth();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ total: 0, online: 0, offline: 0 });
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Form states
  const [addForm, setAddForm] = useState({ device_id: '', secret_key: '' });
  const [editForm, setEditForm] = useState({ device_id: '', secret_key: '' });

  useEffect(() => {
    fetchDevices();
    fetchDeviceStatus();
    
    const interval = setInterval(() => {
      fetchDevices();
      fetchDeviceStatus();
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchDevices = async () => {
    try {
      const data = await tenantApi.getDevices();
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
      const data = await tenantApi.getDeviceStatus();
      setStats(data || { total: 0, online: 0, offline: 0 });
    } catch (err) {
      console.error('Device status fetch error:', err);
    }
  };

  const handleAddDevice = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    if (!addForm.device_id.trim()) {
      setError('Device ID is required');
      setSubmitting(false);
      return;
    }
    if (!addForm.secret_key.trim() || addForm.secret_key.length < 8) {
      setError('Secret key must be at least 8 characters');
      setSubmitting(false);
      return;
    }
    
    try {
      await tenantApi.createDevice(addForm);
      setSuccess('Device added successfully!');
      setAddForm({ device_id: '', secret_key: '' });
      setShowAddModal(false);
      await fetchDevices();
      await fetchDeviceStatus();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to add device');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditDevice = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      await tenantApi.updateDevice(selectedDevice.device_id, editForm);
      setSuccess('Device updated successfully!');
      setShowEditModal(false);
      await fetchDevices();
      await fetchDeviceStatus();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update device');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDevice = async () => {
    setSubmitting(true);
    setError('');
    
    try {
      await tenantApi.deleteDevice(selectedDevice.device_id);
      setSuccess('Device deleted successfully!');
      setShowDeleteModal(false);
      await fetchDevices();
      await fetchDeviceStatus();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete device');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (device) => {
    setSelectedDevice(device);
    setEditForm({
      device_id: device.device_id,
      secret_key: ''
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (device) => {
    setSelectedDevice(device);
    setShowDeleteModal(true);
  };

  const formatLastSeen = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const filteredDevices = devices.filter(device =>
    device.device_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout 
        title="Devices" 
        role="superadmin" 
        label="Tenant Admin" 
        abbr="TA" 
        color="#a855f7" 
        bgColor="rgba(168,85,247,0.15)"
      >
        <div className="skeleton-loader" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {[1, 2, 3].map(i => <div key={i} style={{ background: 'var(--bg2)', borderRadius: '12px', height: '160px', animation: 'pulse 1.5s ease-in-out infinite' }}></div>)}
        </div>
      </DashboardLayout>
    );
  }

  const onlinePercent = stats.total > 0 ? ((stats.online / stats.total) * 100).toFixed(1) : 0;

  return (
    <DashboardLayout 
      title="Devices" 
      role="superadmin" 
      label="Tenant Admin" 
      abbr="TA" 
      color="#a855f7" 
      bgColor="rgba(168,85,247,0.15)"
    >
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          backdrop-filter: blur(4px);
        }
        .modal-content {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 16px;
          max-width: 450px;
          width: 90%;
          padding: 1.5rem;
        }
        .success-toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: rgba(34,197,94,0.95);
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          z-index: 1000;
          animation: slideIn 0.3s ease;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      {/* Success Toast */}
      {success && <div className="success-toast">{success}</div>}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card purple">
          <div className="stat-label">Total Devices</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-sub">Registered in system</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Online</div>
          <div className="stat-value">{stats.online}</div>
          <div className="stat-sub">{onlinePercent}% of total</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">Offline</div>
          <div className="stat-value">{stats.offline}</div>
          <div className="stat-sub">Needs attention</div>
        </div>
      </div>

      {/* Search, Refresh and Add Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: '300px' }}>
          <div className="input-wrap" style={{ flex: 1, position: 'relative' }}>
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
          <button className="btn btn-ghost" onClick={fetchDevices} title="Refresh">
            <RefreshCw size={16} />
          </button>
        </div>
        <button className="btn btn-teal" onClick={() => setShowAddModal(true)}>
          <Plus size={16} style={{ marginRight: '6px' }} />
          Add Device
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '12px', marginBottom: '1rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={16} /> {error}
          <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}>Dismiss</button>
        </div>
      )}

      {/* Devices Grid */}
      {filteredDevices.length === 0 ? (
        <div className="card-box" style={{ textAlign: 'center', padding: '3rem' }}>
          <Cpu size={48} style={{ color: 'var(--text3)', marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text3)' }}>No devices found</p>
          <button className="btn btn-teal" onClick={() => setShowAddModal(true)} style={{ marginTop: '1rem' }}>
            Add your first device
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {filteredDevices.map(device => (
            <div key={device.device_id} style={{
              background: 'var(--bg2)',
              border: `1px solid ${device.status === 'online' ? 'rgba(34,197,94,0.3)' : 'var(--border)'}`,
              borderRadius: '12px',
              padding: '1.25rem',
              transition: 'all 0.2s'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: device.status === 'online' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {device.status === 'online' ? <Wifi size={20} style={{ color: '#22c55e' }} /> : <WifiOff size={20} style={{ color: '#ef4444' }} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{device.device_id}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>ID: {device.id}</div>
                  </div>
                </div>
                <Badge type={device.status === 'online' ? 'online' : 'offline'}>
                  {device.status === 'online' ? 'Online' : 'Offline'}
                </Badge>
              </div>
              
              <div style={{ marginBottom: '1rem', padding: '0.5rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text3)' }}>
                  <Clock size={12} />
                  Last seen: {formatLastSeen(device.last_seen)}
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className="btn btn-ghost" 
                  style={{ flex: 1, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  onClick={() => window.location.href = `/super/devices/${device.device_id}`}
                >
                  <ChevronRight size={14} /> View Details
                </button>
                <button 
                  className="btn btn-ghost" 
                  style={{ padding: '4px 10px' }}
                  onClick={() => openEditModal(device)}
                  title="Edit Device"
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  className="btn btn-red" 
                  style={{ padding: '4px 10px' }}
                  onClick={() => openDeleteModal(device)}
                  title="Delete Device"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Device Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Add New Device</h3>
              <button className="btn btn-ghost" onClick={() => setShowAddModal(false)} style={{ padding: '4px' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddDevice}>
              <div className="form-group">
                <label className="form-label">Device ID *</label>
                <div className="input-wrap" style={{ position: 'relative' }}>
                  <Hash size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ paddingLeft: '32px' }}
                    placeholder="e.g., FP-001, DEVICE-01"
                    value={addForm.device_id}
                    onChange={(e) => setAddForm({ ...addForm, device_id: e.target.value })}
                    required
                  />
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: '4px' }}>
                  Unique identifier for this device
                </p>
              </div>
              
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label className="form-label">Secret Key *</label>
                <div className="input-wrap" style={{ position: 'relative' }}>
                  <Key size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ paddingLeft: '32px' }}
                    placeholder="Minimum 8 characters"
                    value={addForm.secret_key}
                    onChange={(e) => setAddForm({ ...addForm, secret_key: e.target.value })}
                    required
                    minLength={8}
                  />
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: '4px' }}>
                  Secret key for device authentication (min 8 chars)
                </p>
              </div>
              
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-teal" disabled={submitting}>
                  {submitting ? 'Adding...' : 'Add Device'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Device Modal */}
      {showEditModal && selectedDevice && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Edit Device</h3>
              <button className="btn btn-ghost" onClick={() => setShowEditModal(false)} style={{ padding: '4px' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleEditDevice}>
              <div className="form-group">
                <label className="form-label">Device ID</label>
                <div className="input-wrap" style={{ position: 'relative' }}>
                  <Hash size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ paddingLeft: '32px' }}
                    value={editForm.device_id}
                    onChange={(e) => setEditForm({ ...editForm, device_id: e.target.value })}
                    placeholder="New Device ID (optional)"
                  />
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: '4px' }}>
                  Leave empty to keep current: <strong>{selectedDevice.device_id}</strong>
                </p>
              </div>
              
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label className="form-label">Secret Key</label>
                <div className="input-wrap" style={{ position: 'relative' }}>
                  <Key size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ paddingLeft: '32px' }}
                    placeholder="New secret key (optional, min 8 chars)"
                    value={editForm.secret_key}
                    onChange={(e) => setEditForm({ ...editForm, secret_key: e.target.value })}
                    minLength={8}
                  />
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: '4px' }}>
                  Leave empty to keep current secret key
                </p>
              </div>
              
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-teal" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Device Modal */}
      {showDeleteModal && selectedDevice && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Delete Device</h3>
              <button className="btn btn-ghost" onClick={() => setShowDeleteModal(false)} style={{ padding: '4px' }}>
                <X size={20} />
              </button>
            </div>
            
            <p style={{ marginBottom: '1rem', color: 'var(--text2)' }}>
              Are you sure you want to delete device <strong>{selectedDevice.device_id}</strong>?
            </p>
            <p style={{ marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--text3)' }}>
              This action cannot be undone. All command history for this device will be lost.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn btn-red" onClick={handleDeleteDevice} disabled={submitting}>
                {submitting ? 'Deleting...' : 'Delete Device'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Devices;