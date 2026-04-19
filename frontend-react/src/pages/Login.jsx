// src/pages/Login.jsx
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, User, Lock, ArrowRight, ChevronLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false,
  });

  // Configuration based on role
  const roleConfigs = {
    tenant: {
      title: 'Tenant Admin',
      subtitle: 'Global Command Center',
      color: 'var(--purple)',
      bgColor: 'rgba(168,85,247,0.1)',
      btnText: 'Login as Tenant Admin',
      dashPath: '/super/dashboard',
      apiRole: 'tenant_admin',
      icon: '⬡'
    },
    org: {
      title: 'Org Admin',
      subtitle: 'Enterprise Dashboard',
      color: 'var(--teal)',
      bgColor: 'rgba(0,212,170,0.1)',
      btnText: 'Login as Org Admin',
      dashPath: '/org/dashboard',
      apiRole: 'org_admin',
      icon: '◈'
    },
    employee: {
      title: 'Employee',
      subtitle: 'Personal Identity Hub',
      color: 'var(--amber)',
      bgColor: 'rgba(245,158,11,0.1)',
      btnText: 'Login as Employee',
      dashPath: '/emp/dashboard',
      apiRole: 'employee',
      icon: '◉'
    }
  };

  const config = roleConfigs[role] || roleConfigs.employee;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Create FormData instead of JSON for better compatibility
    const formDataObj = new FormData();
    formDataObj.append('username', formData.username);
    formDataObj.append('password', formData.password);
    
    console.log('Sending username:', formData.username);
    console.log('Sending password:', formData.password);
    
    try {
      const endpoint = '/api/auth/login';
      
      const response = await fetch(`https://biometric-backend-1-e3lb.onrender.com${endpoint}`, {
        method: 'POST',
        headers: {
          // Don't set Content-Type when using FormData - browser will set it with boundary
        },
        body: formDataObj, // Use FormData instead of JSON
      });
      
      const data = await response.json();
      console.log('Server response:', data);
      
      if (!response.ok) {
        let errorMessage = 'Login failed. Please check your credentials.';
        
        if (data.detail) {
          if (Array.isArray(data.detail)) {
            errorMessage = data.detail.map(err => err.msg || err).join(', ');
          } else if (typeof data.detail === 'string') {
            errorMessage = data.detail;
          }
        } else if (data.message) {
          errorMessage = data.message;
        }
        
        throw new Error(errorMessage);
      }

      // Store the token
      if (data.access_token) {
        login(data.access_token, {
          id: data.user_id || data.id,
          role: config.apiRole,
          name: data.name || formData.username,
          username: formData.username,
          email: data.email || `${formData.username}@example.com`,
        });
        
        navigate(config.dashPath);
      } else {
        throw new Error('Invalid response from server - no access token');
      }
      
    } catch (err) {
      console.error('Login error details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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

          {/* Error Message */}
          {error && (
            <div style={{ 
              background: 'rgba(239,68,68,0.1)', 
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '8px',
              padding: '0.75rem',
              marginBottom: '1rem',
              color: '#f87171',
              fontSize: '0.85rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Username / Employee ID</label>
              <div className="input-wrap">
                <User className="input-icon" size={18} />
                <input 
                  type="text" 
                  name="username"
                  className="form-input" 
                  placeholder="Enter your username or employee ID" 
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrap">
                <Lock className="input-icon" size={18} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password"
                  className="form-input" 
                  placeholder="Enter your password" 
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  autoComplete="current-password"
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
                <input 
                  type="checkbox" 
                  name="remember"
                  checked={formData.remember}
                  onChange={handleInputChange}
                  style={{ cursor: 'pointer' }} 
                />
                <span>Remember Device</span>
              </label>
              <a href="#" className="forgot-link" style={{ color: config.color }}>Forgot Password?</a>
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