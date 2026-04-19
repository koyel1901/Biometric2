// src/pages/tenant/Devices.jsx
import React, { useState, useEffect } from 'react';
import { Cpu, Wifi, WifiOff, RefreshCw, AlertCircle, Clock, Search, ChevronRight } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Badge from '../../components/Badge';
import { tenantApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Devices = () => {
  const { logout } = useAuth();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ total: 0, online: 0, offline: 0 });

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

      {/* Search and Refresh */}
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
        <div style={{ fontSize: '0.7rem', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '12px', marginBottom: '1rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={16} /> {error}
          <button onClick={fetchDevices} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}>Retry</button>
        </div>
      )}

      {/* Devices Grid */}
      {filteredDevices.length === 0 ? (
        <div className="card-box" style={{ textAlign: 'center', padding: '3rem' }}>
          <Cpu size={48} style={{ color: 'var(--text3)', marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text3)' }}>No devices found</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text3)', marginTop: '0.5rem' }}>
            Devices will appear here once they register with the system
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
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
              
              <button 
                className="btn btn-ghost" 
                style={{ width: '100%', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                onClick={() => window.location.href = `/super/devices/${device.device_id}`}
              >
                View Details <ChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Devices;