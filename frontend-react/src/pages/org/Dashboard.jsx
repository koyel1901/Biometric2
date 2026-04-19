import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { TrendChart } from '../../components/Charts';
import { orgApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// ─── Small helper: render a stat card ────────────────────────────────────────
function StatCard({ label, value, sub, color }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value ?? '—'}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

// ─── Skeleton shimmer while loading ──────────────────────────────────────────
function Skeleton({ height = '2rem', width = '100%', radius = '8px' }) {
  return (
    <div style={{
      height, width, borderRadius: radius,
      background: 'linear-gradient(90deg, var(--bg3) 25%, var(--bg4) 50%, var(--bg3) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
    }} />
  );
}

const OrgDash = () => {
  const { logout } = useAuth();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    let cancelled = false;

    async function fetchDashboard() {
      try {
        const res = await orgApi.getDashboard();
        if (!cancelled) setData(res.data);
      } catch (err) {
        if (!cancelled) {
          if (err?.response?.status === 401) logout();
          else setError('Failed to load dashboard data. Please refresh.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchDashboard();
    return () => { cancelled = true; };
  }, [logout]);

  const att = data?.attendance_today ?? {};
  const emp = data?.employees ?? {};
  const totalActive = emp.active ?? 0;
  const present = att.present ?? 0;
  const absent  = Math.max(0, totalActive - present);
  const presentPct = totalActive > 0 ? ((present / totalActive) * 100).toFixed(1) : '0';

  return (
    <DashboardLayout
      title="Dashboard"
      role="orgadmin"
      label="Department Admin"
      abbr="DA"
      color="#00d4aa"
      bgColor="rgba(0,212,170,0.15)"
    >
      {/* Global shimmer keyframe */}
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>

      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '10px', padding: '12px 16px', color: '#f87171',
          marginBottom: '1.5rem', fontSize: '0.88rem',
        }}>{error}</div>
      )}

      {/* ── Stats Grid ────────────────────────────────────────────────────── */}
      <div className="stats-grid">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="stat-card" style={{ gap: '0.75rem' }}>
              <Skeleton height="0.85rem" width="60%" />
              <Skeleton height="2rem" width="40%" />
            </div>
          ))
        ) : (
          <>
            <StatCard label="Total Employees"  value={emp.total}    color="teal"  />
            <StatCard label="Present Today"    value={present}      sub={`${presentPct}%`} color="green" />
            <StatCard label="Absent Today"     value={absent}       color="red"   />
            <StatCard label="Late Today"       value={att.late}     color="amber" />
            <StatCard label="Enrolled (FP)"    value={emp.enrolled} color="blue"  />
            <StatCard label="Pending Leaves"   value={data?.pending_leaves} color="purple" />
          </>
        )}
      </div>

      {/* ── Trend chart (department name in title) ──────────────────────── */}
      <div className="card-box">
        <h4>
          Attendance Trend — {loading ? 'Loading...' : (data?.department ?? 'Department')}
        </h4>
        {loading
          ? <Skeleton height="180px" radius="10px" />
          : (
            <TrendChart
              labels={['Mon','Tue','Wed','Thu','Fri','Sat','Sun']}
              vals={[88, 92, 90, 85, present, 60, 0]}
              color="#00d4aa"
            />
          )
        }
      </div>

      {/* ── Bottom two-col section ─────────────────────────────────────── */}
      <div className="two-col">
        <div className="card-box">
          <h4>Today's Attendance Summary</h4>
          {loading ? (
            <Skeleton height="100px" radius="10px" />
          ) : (
            <table style={{ width: '100%' }}>
              <thead><tr><th>Metric</th><th>Value</th></tr></thead>
              <tbody>
                <tr><td>Present</td><td style={{ color: 'var(--teal)', fontWeight: 600 }}>{present}</td></tr>
                <tr><td>Absent</td><td style={{ color: 'var(--red)', fontWeight: 600 }}>{absent}</td></tr>
                <tr><td>On Time</td><td style={{ color: 'var(--blue)', fontWeight: 600 }}>{att.on_time ?? '—'}</td></tr>
                <tr><td>Late</td><td style={{ color: 'var(--amber)', fontWeight: 600 }}>{att.late ?? '—'}</td></tr>
              </tbody>
            </table>
          )}
        </div>

        <div className="card-box">
          <h4>Employee Overview</h4>
          {loading ? (
            <Skeleton height="100px" radius="10px" />
          ) : (
            <table style={{ width: '100%' }}>
              <thead><tr><th>Category</th><th>Count</th></tr></thead>
              <tbody>
                <tr><td>Total</td><td style={{ fontWeight: 600 }}>{emp.total ?? '—'}</td></tr>
                <tr><td>Active</td><td style={{ color: 'var(--teal)', fontWeight: 600 }}>{emp.active ?? '—'}</td></tr>
                <tr><td>Fingerprint Enrolled</td><td style={{ color: 'var(--blue)', fontWeight: 600 }}>{emp.enrolled ?? '—'}</td></tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrgDash;
