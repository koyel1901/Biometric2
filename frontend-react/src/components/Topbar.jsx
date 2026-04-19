// src/components/Topbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Search, Moon, Sun, Bell, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { employeeApi, notificationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Topbar = ({ title, userAbbr, bgColor, iconColor, role }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch notifications when dropdown opens or periodically
  useEffect(() => {
    if (showNotifs) {
      fetchNotifications();
    }
  }, [showNotifs]);

  // Fetch unread count periodically
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationsAPI.getNotifications(20);
      console.log('Notifications:', data);
      setNotifications(data || []);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const data = await notificationsAPI.getUnreadCount();
      setUnreadCount(data.count || 0);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationsAPI.markNotificationRead(notificationId);
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.notification_id === notificationId 
            ? { ...notif, is_read: true } 
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllRead();
      // Update local state
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleToggleSidebar = () => {
    const sb = document.getElementById('sidebar');
    const bd = document.getElementById('sb-backdrop');
    if (window.innerWidth <= 768) {
      if (sb) sb.classList.toggle('open');
      if (bd) bd.classList.toggle('visible');
    } else {
      if (sb) sb.classList.toggle('collapsed');
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
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

  const getNotificationIcon = (eventType) => {
    switch (eventType) {
      case 'leave_requested':
      case 'leave_submitted':
        return '📋';
      case 'leave_approved':
      case 'leave_rejected':
        return '✅';
      case 'attendance_marked':
        return '⏰';
      default:
        return '🔔';
    }
  };

  return (
    <div className="topbar">
      <button 
        className="tb-action-icon tb-hamburger" 
        onClick={(e) => { e.stopPropagation(); handleToggleSidebar(); }}
        style={{ marginRight: '10px', fontSize: '1.4rem' }}
      >
        <Menu size={22} />
      </button>
      <span className="tb-title">{title}</span>

      <div className="tb-search-wrap">
        <input className="tb-search" type="text" placeholder="Search..." />
      </div>
      <div style={{ flex: 1 }}></div>

      <button 
        className="tb-action-icon theme-toggle" 
        onClick={toggleTheme}
        title="Toggle Light/Dark Mode"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div 
        className="tb-notif tb-action-icon" 
        onClick={(e) => { e.stopPropagation(); setShowNotifs(!showNotifs); }}
        ref={dropdownRef}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <div className="tb-notif-badge" style={{ 
            position: 'absolute', 
            top: '0px', 
            right: '0px',
            width: '16px',
            height: '16px',
            background: '#ef4444',
            borderRadius: '50%',
            fontSize: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
        
        {showNotifs && (
          <div className="notif-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="table-header" style={{ justifyContent: 'space-between', paddingBottom: '0.5rem' }}>
              <span className="table-title">Notifications</span>
              {unreadCount > 0 && (
                <button 
                  className="btn btn-ghost" 
                  onClick={handleMarkAllRead}
                  style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                >
                  Mark all read
                </button>
              )}
            </div>
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text3)' }}>
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text3)' }}>
                No notifications
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.notification_id} 
                  className="notif-item"
                  style={{ 
                    background: notif.is_read ? 'transparent' : 'rgba(0,212,170,0.05)',
                    cursor: 'pointer'
                  }}
                  onClick={() => !notif.is_read && handleMarkAsRead(notif.notification_id)}
                >
                  <div className="notif-dot" style={{ 
                    background: notif.is_read ? 'var(--text3)' : '#00d4aa',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    marginTop: '5px',
                    flexShrink: 0
                  }}></div>
                  <div style={{ flex: 1 }}>
                    <div className="notif-text" style={{ fontWeight: notif.is_read ? 'normal' : '500' }}>
                      <span style={{ marginRight: '6px' }}>{getNotificationIcon(notif.event_type)}</span>
                      {notif.title || notif.message || notif.entity_name}
                    </div>
                    <div className="notif-time" style={{ marginTop: '4px' }}>
                      {formatTime(notif.created_at)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <Link 
        to={role === 'superadmin' ? '/super/profile' : role === 'orgadmin' ? '/org/profile' : '/emp/profile'} 
        className="avatar" 
        style={{ background: bgColor, color: iconColor, textDecoration: 'none' }}
      >
        {userAbbr || (user?.name ? user.name.charAt(0).toUpperCase() : 'U')}
      </Link>
    </div>
  );
};

export default Topbar;