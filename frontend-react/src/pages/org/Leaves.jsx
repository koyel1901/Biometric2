import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Badge from '../../components/Badge';

const Leaves = () => {
  const requests = [
    { name: 'Priya Mehta', type: 'Sick', from: '16 Apr', to: '17 Apr', reason: 'Fever', status: 'pending' },
    { name: 'Rahul Sharma', type: 'Casual', from: '14 Apr', to: '14 Apr', reason: 'Personal work', status: 'approved' },
  ];

  return (
    <DashboardLayout 
      title="Leave Requests" 
      role="orgadmin" 
      label="Department Admin" 
      abbr="DA" 
      color="#00d4aa" 
      bgColor="rgba(0,212,170,0.15)"
    >
      <div className="table-wrap">
        <div className="table-header">
          <span className="table-title">Leave Requests</span>
          <select className="form-select" style={{ width: '120px', padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}>
            <option>All</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
        </div>
        <table>
          <thead>
            <tr><th>Employee</th><th>Type</th><th>From</th><th>To</th><th>Reason</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {requests.map((r, idx) => (
              <tr key={idx}>
                <td>{r.name}</td>
                <td>{r.type}</td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>{r.from}</td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>{r.to}</td>
                <td>{r.reason}</td>
                <td><Badge type={r.status}>{r.status}</Badge></td>
                <td style={{ display: 'flex', gap: '6px', padding: '0.85rem 0' }}>
                  {r.status === 'pending' ? (
                    <>
                      <button className="btn btn-teal" style={{ padding: '3px 10px', fontSize: '0.75rem' }}>Approve</button>
                      <button className="btn btn-red" style={{ padding: '3px 10px', fontSize: '0.75rem' }}>Reject</button>
                    </>
                  ) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default Leaves;
