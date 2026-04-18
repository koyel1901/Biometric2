import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';

const Profile = () => {
  return (
    <DashboardLayout 
      title="My Profile" 
      role="user" 
      label="Employee" 
      abbr="EM" 
      color="#f59e0b" 
      bgColor="rgba(245,158,11,0.15)"
    >
      <div className="card-box" style={{ maxWidth: '560px' }}>
        <div className="profile-header" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="profile-av" style={{ 
            background: 'rgba(245,158,11,0.15)', 
            color: 'var(--amber)',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            fontWeight: 700
          }}>AK</div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 600 }}>Aarav Kumar</div>
            <div style={{ color: 'var(--text3)', fontSize: '0.9rem', marginTop: '3px' }}>EMP-001 · Engineering</div>
            <span className="badge active" style={{ marginTop: '8px', display: 'inline-flex' }}>active</span>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div><div style={{ fontSize: '0.75rem', color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: '4px', textTransform: 'uppercase' }}>Employee ID</div><div style={{ fontFamily: 'var(--mono)', fontSize: '0.9rem' }}>EMP-001</div></div>
            <div><div style={{ fontSize: '0.75rem', color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: '4px', textTransform: 'uppercase' }}>Fingerprint ID</div><div style={{ fontFamily: 'var(--mono)', fontSize: '0.9rem' }}>FP-045 (not editable)</div></div>
            <div><div style={{ fontSize: '0.75rem', color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: '4px', textTransform: 'uppercase' }}>Department</div><div style={{ fontSize: '0.9rem' }}>Engineering</div></div>
          </div>
          <h4 style={{ marginBottom: '1rem' }}>Edit Info</h4>
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Phone</label><input className="form-input" defaultValue="+91 9876543210" /></div>
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" defaultValue="aarav@org.com" /></div>
          </div>
          <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Change Password</h4>
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Current Password</label><input className="form-input" type="password" placeholder="••••••••" /></div>
            <div className="form-group"><label className="form-label">New Password</label><input className="form-input" type="password" placeholder="••••••••" /></div>
          </div>
          <button className="btn btn-teal" style={{ marginTop: '1.5rem', width: '100%', padding: '0.8rem' }}>Save Changes</button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
