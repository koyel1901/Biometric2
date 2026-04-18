import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, User, Lock, ArrowRight, ChevronLeft, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Configuration based on role
  const roleConfigs = {
    tenant: {
      title: 'Tenant Admin',
      subtitle: 'Global Command Center',
      color: 'var(--purple)',
      bgColor: 'rgba(168,85,247,0.1)',
      btnText: 'Login as Tenant Admin',
      dashPath: '/super/dashboard',
      icon: '⬡'
    },
    org: {
      title: 'Org Admin',
      subtitle: 'Enterprise Dashboard',
      color: 'var(--teal)',
      bgColor: 'rgba(0,212,170,0.1)',
      btnText: 'Login as Org Admin',
      dashPath: '/org/dashboard',
      icon: '◈'
    },
    employee: {
      title: 'Employee',
      subtitle: 'Personal Identity Hub',
      color: 'var(--amber)',
      bgColor: 'rgba(245,158,11,0.1)',
      btnText: 'Login as Employee',
      dashPath: '/emp/dashboard',
      icon: '◉'
    }
  };

  const config = roleConfigs[role] || roleConfigs.employee;

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulation of network delay
    setTimeout(() => {
      navigate(config.dashPath);
    }, 1200);
  };

  return (
    <div className="login-page">
      <div className="grid-bg"></div>
      
      <div className="login-container">
        <Link to="/" className="login-back">
          <ChevronLeft size={18} /> Back to Gateway
        </Link>

        <div className="login-card">
          <div className="login-header">
            <div className="login-logo-circle" style={{ background: config.bgColor, color: config.color }}>
              <ShieldCheck size={32} />
            </div>
            <h2 className="login-title">{config.title} Login</h2>
            <p className="login-subtitle">{config.subtitle}</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Identifier</label>
              <div className="input-wrap">
                <User className="input-icon" size={18} />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Username or Staff ID" 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Security Key</label>
              <div className="input-wrap">
                <Lock className="input-icon" size={18} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="form-input" 
                  placeholder="Password" 
                />

                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="checkbox-wrap" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" style={{ cursor: 'pointer' }} />
                <span>Remember Device</span>
              </label>
              <a href="#" className="forgot-link" style={{ color: config.color }}>Forgot Key?</a>
            </div>


            <button 
              type="submit" 
              className={`login-btn ${loading ? 'loading' : ''}`}
              style={{ background: config.color }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : (
                <>{config.btnText} <ArrowRight size={18} /></>
              )}
            </button>
          </form>


          <div className="login-footer">
            <p>Authorized access only. All actions are logged under the AES-256 security protocol.</p>
          </div>
        </div>

        <div className="login-status-badges">
          <div className="status-badge"><div className="dot"></div> System Online</div>
          <div className="status-badge"><div className="dot" style={{ background: config.color }}></div> {config.title} Node</div>
        </div>
      </div>
    </div>
  );
};

export default Login;
