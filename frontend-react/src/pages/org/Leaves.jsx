// src/pages/org/Leaves.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Badge from '../../components/Badge';
import ConfirmationModal from '../../components/ConfirmationModal';
import { orgApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, XCircle, RefreshCw, AlertCircle, Filter, Calendar, User, FileText } from 'lucide-react';

const Leaves = () => {
  const { logout } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const data = await orgApi.getLeaveRequests();
      setRequests(data || []);
    } catch (err) {
      if (err?.response?.status === 401) logout();
      setErrorMsg("Failed to load leave requests");
      setTimeout(() => setErrorMsg(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeaves(); }, []);

  const approveLeave = async (id, employeeName) => {
    try {
      await orgApi.approveLeave(id);
      setSuccessMsg(`Leave request for ${employeeName} approved!`);
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchLeaves();
    } catch (err) {
      setErrorMsg(err.message || "Failed to approve leave");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  const rejectLeave = async () => {
    if (!showRejectModal) return;
    setRejecting(true);
    try {
      await orgApi.rejectLeave(showRejectModal.leave_id, rejectReason);
      setSuccessMsg(`Leave request for ${showRejectModal.employee_name} rejected.`);
      setShowRejectModal(null);
      setRejectReason("");
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchLeaves();
    } catch (err) {
      setErrorMsg(err.message || "Failed to reject leave");
      setTimeout(() => setErrorMsg(""), 3000);
    } finally {
      setRejecting(false);
    }
  };

  const filteredRequests = requests.filter(r => filter === "all" || r.status === filter);
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    approved: requests.filter(r => r.status === "approved" || r.status === "approved_by_dept").length,
    rejected: requests.filter(r => r.status === "rejected").length,
  };

  if (loading) {
    return (
      <DashboardLayout title="Leave Requests" role="orgadmin" label="Department Admin" abbr="DA" color="#00d4aa" bgColor="rgba(0,212,170,0.15)">
        <div className="skeleton-loader">{/* Loading skeleton */}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Leave Requests" role="orgadmin" label="Department Admin" abbr="DA" color="#00d4aa" bgColor="rgba(0,212,170,0.15)">
      <style>{`
        .stat-card { transition: all 0.2s; }
        .stat-card:hover { transform: translateY(-2px); }
        .toast-success { position: fixed; bottom: 24px; right: 24px; background: rgba(34,197,94,0.95); color: white; padding: 12px 20px; border-radius: 12px; z-index: 1000; animation: slideIn 0.3s ease; display: flex; align-items: center; gap: 8px; }
        .toast-error { position: fixed; bottom: 24px; right: 24px; background: rgba(239,68,68,0.95); color: white; padding: 12px 20px; border-radius: 12px; z-index: 1000; animation: slideIn 0.3s ease; display: flex; align-items: center; gap: 8px; }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>

      {successMsg && <div className="toast-success"><CheckCircle size={18} /> {successMsg}</div>}
      {errorMsg && <div className="toast-error"><AlertCircle size={18} /> {errorMsg}</div>}

      <ConfirmationModal
        isOpen={!!showRejectModal}
        onClose={() => { setShowRejectModal(null); setRejectReason(""); }}
        onConfirm={rejectLeave}
        title="Reject Leave Request"
        message={`Are you sure you want to reject ${showRejectModal?.employee_name}'s leave request?${rejectReason ? ` Reason: "${rejectReason}"` : ''}`}
        confirmText="Reject"
        cancelText="Cancel"
        type="danger"
        confirmVariant="danger"
        loading={rejecting}
      />

      <div className="stats-grid">
        <div className="stat-card purple"><div className="stat-label">Total Requests</div><div className="stat-value">{stats.total}</div><div className="stat-sub">All time</div></div>
        <div className="stat-card amber"><div className="stat-label">Pending</div><div className="stat-value">{stats.pending}</div><div className="stat-sub">Awaiting action</div></div>
        <div className="stat-card green"><div className="stat-label">Approved</div><div className="stat-value">{stats.approved}</div><div className="stat-sub">+ {stats.approved - stats.pending} processed</div></div>
        <div className="stat-card red"><div className="stat-label">Rejected</div><div className="stat-value">{stats.rejected}</div><div className="stat-sub">Declined requests</div></div>
      </div>

      <div className="table-wrap">
        <div className="table-header">
          <span className="table-title">Leave Requests</span>
          <select className="form-select" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: '140px' }}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="approved_by_dept">Dept Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <table style={{ width: '100%' }}>
          <thead>
            <tr><th>Employee</th><th>Type</th><th>Duration</th><th>Reason</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text3)' }}>No leave requests found</td></tr>
            ) : (
              filteredRequests.map((r) => (
                <tr key={r.leave_id}>
                  <td><div style={{ fontWeight: 500 }}>{r.employee_name}</div><div style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>{r.employee_code}</div></td>
                  <td style={{ textTransform: 'capitalize' }}>{r.leave_type}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>{new Date(r.start_date).toLocaleDateString()} → {new Date(r.end_date).toLocaleDateString()}</td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.reason || '-'}</td>
                  <td><Badge type={r.status === 'approved' || r.status === 'approved_by_dept' ? 'approved' : r.status}>{r.status === 'approved_by_dept' ? 'Dept Approved' : r.status}</Badge></td>
                  <td>
                    {(r.status === 'pending' || r.status === 'approved_by_dept') && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-teal" onClick={() => approveLeave(r.leave_id, r.employee_name)} style={{ padding: '6px 12px', fontSize: '0.75rem' }}><CheckCircle size={14} /> Approve</button>
                        <button className="btn btn-red" onClick={() => setShowRejectModal(r)} style={{ padding: '6px 12px', fontSize: '0.75rem' }}><XCircle size={14} /> Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default Leaves;