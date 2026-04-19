// src/services/api.js
const API_BASE_URL = 'https://biometric-backend-1-e3lb.onrender.com';

// Helper to get auth token
const getToken = () => localStorage.getItem('access_token');

// Generic API request function
async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `API Error: ${response.status}`);
  }

  return response.json();
}

// Employee APIs - all routes under /api/employee/
export const employeeApi = {
  // Dashboard
  getDashboard: () => apiRequest('/api/employee/dashboard'),
  
  // Attendance
  getTodayAttendance: () => apiRequest('/api/employee/attendance/today'),
  getAttendanceHistory: () => apiRequest('/api/employee/attendance'),
  getAttendanceStats: () => apiRequest('/api/employee/attendance/stats'),
  getMonthlyStats: (month, year) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    return apiRequest(`/api/employee/attendance/stats/monthly?${params.toString()}`);
  },
  getHoursSummary: (month, year) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    return apiRequest(`/api/employee/attendance/hours/summary?${params.toString()}`);
  },
  getCalendar: (month, year) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    return apiRequest(`/api/employee/attendance/calendar?${params.toString()}`);
  },
  getByDate: (date) => apiRequest(`/api/employee/attendance/${date}`),
  exportData: () => apiRequest('/api/employee/attendance/export'),
  
  // Profile
  getProfile: () => apiRequest('/api/employee/profile'),
  updateProfile: (data) => apiRequest('/api/employee/profile', { method: 'PUT', body: JSON.stringify(data) }),
  changePassword: (data) => apiRequest('/api/employee/profile/change-password', { method: 'PUT', body: JSON.stringify(data) }),
  getAttendanceSummary: () => apiRequest('/api/employee/profile/attendance-summary'),
  
  // Leaves
  getLeaves: () => apiRequest('/api/employee/leaves'),
  getLeaveBalance: () => apiRequest('/api/employee/leaves/balance'),
  getLeaveStats: () => apiRequest('/api/employee/leaves/stats'),
  applyLeave: (data) => apiRequest('/api/employee/leaves', { method: 'POST', body: JSON.stringify(data) }),
  getLeaveDetail: (id) => apiRequest(`/api/employee/leaves/${id}`),
  cancelLeave: (id) => apiRequest(`/api/employee/leaves/${id}/cancel`, { method: 'PATCH' }),
  
  // Holidays
  getHolidays: () => apiRequest('/api/employee/holidays'),
  getUpcomingHoliday: () => apiRequest('/api/employee/holidays/upcoming'),
  
  // Notifications
  getNotifications: (limit = 50, unreadOnly = false) => 
    apiRequest(`/api/employee/notifications?limit=${limit}&unread_only=${unreadOnly}`),
  getUnreadCount: () => apiRequest('/api/employee/notifications/unread-count'),
  markNotificationRead: (id) => apiRequest(`/api/employee/notifications/${id}/read`, { method: 'PATCH' }),
  markAllRead: () => apiRequest('/api/employee/notifications/read-all', { method: 'PATCH' }),
};

// Organization Admin APIs - under /api/org/
export const orgApi = {
  getDashboard: () => apiRequest('/api/org/dashboard'),
  getEmployees: () => apiRequest('/api/org/employees'),
  getAttendance: (date) => apiRequest(`/api/org/attendance?date=${date}`),
  getTodayAttendance: () => apiRequest('/api/org/attendance/today'),
  getLeaveRequests: () => apiRequest('/api/org/leaves'),
  approveLeave: (id) => apiRequest(`/api/org/leaves/${id}/approve`, { method: 'PATCH' }),
  rejectLeave: (id) => apiRequest(`/api/org/leaves/${id}/reject`, { method: 'PATCH' }),
  getDevices: () => apiRequest('/api/org/devices'),
  getActivityLog: () => apiRequest('/api/org/activity'),
  getSettings: () => apiRequest('/api/org/settings'),
  updateSettings: (data) => apiRequest('/api/org/settings', { method: 'PUT', body: JSON.stringify(data) }),
};

// Tenant Admin APIs - under /api/tenant/
export const tenantApi = {
  getDashboard: () => apiRequest('/api/tenant/dashboard'),
  getDepartments: () => apiRequest('/api/tenant/departments'),
  getHolidays: () => apiRequest('/api/tenant/holidays'),
  getDevices: () => apiRequest('/api/tenant/devices'),
  getActivityLog: () => apiRequest('/api/tenant/activity'),
  getSettings: () => apiRequest('/api/tenant/settings'),
  updateSettings: (data) => apiRequest('/api/tenant/settings', { method: 'PUT', body: JSON.stringify(data) }),
};

// For backward compatibility
export const attendanceAPI = employeeApi;
export const profileAPI = employeeApi;
export const dashboardAPI = employeeApi;
export const leavesAPI = employeeApi;
export const holidaysAPI = employeeApi;
export const notificationsAPI = employeeApi;