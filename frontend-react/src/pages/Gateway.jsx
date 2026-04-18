import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Moon, Sun, ArrowRight, Zap, Lock, Globe } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Gateway = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div id="landing">
      <div className="grid-bg"></div>
      
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 50 }}>
        <button 
          className="tb-action-icon theme-toggle" 
          onClick={toggleTheme}
          style={{ fontSize: '1.4rem' }}
        >
          {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="landing-logo">
          <div className="logo-icon">
            <ShieldCheck color="white" size={28} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)' }}>The Sentinel</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>Biometric Orchestration Platform</div>
          </div>
        </div>

        <p className="landing-sub">Select your authorization level to continue to your dashboard</p>

        <div className="role-cards">
          <Link to="/login/tenant" className="role-card super">
            <div className="role-icon">⬡</div>
            <h3>Tenant Admin</h3>
            <p>Global hardware orchestration, multi-tenant governance, and core system telemetry</p>
            <div className="role-enter">Enter Command Center <ArrowRight size={14} style={{ marginLeft: '6px' }} /></div>
          </Link>


          <Link to="/login/org" className="role-card org">
            <div className="role-icon">◈</div>
            <h3>Org Admin</h3>
            <p>Manage organization-wide attendance protocols, local devices, and department biometric logs</p>
            <div className="role-enter">Access Dashboard <ArrowRight size={14} style={{ marginLeft: '6px' }} /></div>
          </Link>


          <Link to="/login/employee" className="role-card employee">
            <div className="role-icon">◉</div>
            <h3>Employee</h3>
            <p>Personal identity verification, attendance history, and mobile biometric credential management</p>
            <div className="role-enter" style={{ color: 'var(--amber)' }}>View Identity Hub <ArrowRight size={14} style={{ marginLeft: '6px' }} /></div>
          </Link>

        </div>

        <div className="status-bar">
          <div className="status-item"><div className="dot"></div>GLOBAL SYNC ACTIVE</div>
          <div className="status-item"><div className="dot" style={{ background: 'var(--blue)' }}></div>AES-256 ENCRYPTED</div>
          <div className="status-item"><div className="dot" style={{ background: '#a855f7' }}></div>FIDO2 COMPLIANT</div>
        </div>
      </div>
    </div>
  );
};

export default Gateway;
