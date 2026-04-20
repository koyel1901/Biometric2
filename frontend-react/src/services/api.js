
// src/services/api.js
const API_BASE_URL = 'https://api.attendance.gridsphere.in';

// Helper to get auth token
const getToken = () => localStorage.getItem('access_token');

// Helper to get API key (for tenant)
const getApiKey = () => localStorage.getItem('api_key');

// Helper to get auth type
const getAuthType = () => localStorage.getItem('auth_type');

// Generic API request function
async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const apiKey = getApiKey();
  const authType = getAuthType();
  
  const headers = {};
  
  if (authType === 'api_key' && apiKey) {
    headers['X-API-Key'] = apiKey;
  } else if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  const finalHeaders = { ...headers, ...options.headers };
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: finalHeaders,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `API Error: ${response.status}`);
  }

  return response.json();
}

// ==================== EMPLOYEE APIs ====================
export const employeeApi = {
  getDashboard: () => apiRequest('/api/employee/dashboard'),
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
  getProfile: () => apiRequest('/api/employee/profile'),
  updateProfile: (data) => apiRequest('/api/employee/profile', { method: 'PUT', body: JSON.stringify(data) }),
  changePassword: (data) => apiRequest('/api/employee/profile/change-password', { method: 'PUT', body: JSON.stringify(data) }),
  getAttendanceSummary: () => apiRequest('/api/employee/profile/attendance-summary'),
  getLeaves: () => apiRequest('/api/employee/leaves'),
  getLeaveBalance: () => apiRequest('/api/employee/leaves/balance'),
  getLeaveStats: () => apiRequest('/api/employee/leaves/stats'),
  applyLeave: (data) => apiRequest('/api/employee/leaves', { method: 'POST', body: JSON.stringify(data) }),
  getLeaveDetail: (id) => apiRequest(`/api/employee/leaves/${id}`),
  cancelLeave: (id) => apiRequest(`/api/employee/leaves/${id}/cancel`, { method: 'PATCH' }),
  getHolidays: () => apiRequest('/api/employee/holidays'),
  getUpcomingHoliday: () => apiRequest('/api/employee/holidays/upcoming'),
  getNotifications: (limit = 50, unreadOnly = false) => 
    apiRequest(`/api/employee/notifications?limit=${limit}&unread_only=${unreadOnly}`),
  getUnreadCount: () => apiRequest('/api/employee/notifications/unread-count'),
  markNotificationRead: (id) => apiRequest(`/api/employee/notifications/${id}/read`, { method: 'PATCH' }),
  markAllRead: () => apiRequest('/api/employee/notifications/read-all', { method: 'PATCH' }),
};

// ==================== ORGANIZATION ADMIN APIs ====================
export const orgApi = {
  getDashboard: () => apiRequest('/api/org-admin/dashboard'),
  getEmployees: () => apiRequest('/api/org-admin/employees'),
  getAvailableSlots: () => apiRequest('/api/org-admin/employees/available-finger-slots'),
  createEmployee: (data) => apiRequest('/api/org-admin/employees', { method: 'POST', body: JSON.stringify(data) }),
  updateEmployee: (id, data) => apiRequest(`/api/org-admin/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEmployee: (id) => apiRequest(`/api/org-admin/employees/${id}`, { method: 'DELETE' }),
  assignFingerprint: (id, data) => apiRequest(`/api/org-admin/employees/${id}/assign-fingerprint`, { method: 'PATCH', body: JSON.stringify(data) }),
  getAttendance: (date) => apiRequest(`/api/org-admin/attendance?date=${date}`),
  getTodayAttendance: () => apiRequest('/api/org-admin/attendance/today'),
  getAttendanceByDate: (date) => apiRequest(`/api/org-admin/attendance/date/${date}`),
  getLeaveRequests: () => apiRequest('/api/org-admin/leaves'),
  approveLeave: (id) => apiRequest(`/api/org-admin/leaves/${id}/approve`, { method: 'PATCH' }),
  rejectLeave: (id, reason) => apiRequest(`/api/org-admin/leaves/${id}/reject`, { method: 'PATCH', body: JSON.stringify({ reason }) }),
  getHolidays: () => apiRequest('/api/org-admin/holidays'),
  getUpcomingHolidays: (limit = 5) => apiRequest(`/api/org-admin/holidays/upcoming?limit=${limit}`),
  // Device management
  getDevices: () => apiRequest('/api/org-admin/devices'),
  getDeviceStatus: () => apiRequest('/api/org-admin/devices/status'),
  createDevice: (data) => apiRequest('/api/org-admin/devices', { method: 'POST', body: JSON.stringify(data) }),
  fireCommand: (data) => apiRequest('/api/org-admin/devices/fire-command', { method: 'POST', body: JSON.stringify(data) }),
  getActivityLog: () => apiRequest('/api/org-admin/activity'),
  getSettings: () => apiRequest('/api/org-admin/settings'),
  updateSettings: (data) => apiRequest('/api/org-admin/settings', { method: 'PUT', body: JSON.stringify(data) }),
};

// ==================== TENANT ADMIN APIs ====================
export const tenantApi = {
  getDashboard: () => apiRequest('/api/tenant/dashboard'),
  getRecentAttendance: () => apiRequest('/api/tenant/attendance/recent'),
  getAttendanceStats: () => apiRequest('/api/tenant/attendance/stats'),
  getAttendanceByDate: (date, deptId) => {
    const params = deptId ? `?dept_id=${deptId}` : '';
    return apiRequest(`/api/tenant/attendance/date/${date}${params}`);
  },
  getAttendanceReport: (startDate, endDate, deptId) => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    if (deptId) params.append('dept_id', deptId);
    return apiRequest(`/api/tenant/reports/attendance?${params.toString()}`);
  },
  getDepartmentSummary: (month, year) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    return apiRequest(`/api/tenant/reports/department-summary?${params.toString()}`);
  },
  getDepartments: () => apiRequest('/api/tenant/departments'),
  createDepartment: (data) => apiRequest('/api/tenant/departments', { method: 'POST', body: JSON.stringify(data) }),
  updateDepartment: (id, data) => apiRequest(`/api/tenant/departments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateDepartmentStatus: (id, data) => apiRequest(`/api/tenant/departments/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteDepartment: (id) => apiRequest(`/api/tenant/departments/${id}`, { method: 'DELETE' }),
  getHolidays: (year) => {
    const params = year ? `?year=${year}` : '';
    return apiRequest(`/api/tenant/holidays${params}`);
  },
  createHoliday: (data) => apiRequest('/api/tenant/holidays', { method: 'POST', body: JSON.stringify(data) }),
  getTenantProfile: () => apiRequest('/api/tenant/profile'),
  updateHoliday: (id, data) => apiRequest(`/api/tenant/holidays/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteHoliday: (id) => apiRequest(`/api/tenant/holidays/${id}`, { method: 'DELETE' }),
  getUpcomingHolidays: (limit = 5) => apiRequest(`/api/tenant/holidays/upcoming?limit=${limit}`),
  getDevices: () => apiRequest('/api/tenant/devices'),
  getDeviceStatus: () => apiRequest('/api/tenant/devices/status'),
  getDeviceDetails: (deviceId) => apiRequest(`/api/tenant/devices/${deviceId}`),
  createDevice: (data) => apiRequest('/api/tenant/devices', { method: 'POST', body: JSON.stringify(data) }),
  updateDevice: (deviceId, data) => apiRequest(`/api/tenant/devices/${deviceId}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteDevice: (deviceId) => apiRequest(`/api/tenant/devices/${deviceId}`, { method: 'DELETE' }),
  fireCommand: (data) => apiRequest('/api/tenant/devices/fire-command', { method: 'POST', body: JSON.stringify(data) }),
  getOrgAdmins: () => apiRequest('/api/tenant/org-admins'),
  createOrgAdmin: (data) => apiRequest('/api/tenant/org-admins', { method: 'POST', body: JSON.stringify(data) }),
  updateOrgAdmin: (id, data) => apiRequest(`/api/tenant/org-admins/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteOrgAdmin: (id) => apiRequest(`/api/tenant/org-admins/${id}`, { method: 'DELETE' }),
  getLeaveStats: () => apiRequest('/api/tenant/leaves/stats'),
  getLeaveRequests: (status, deptId) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (deptId) params.append('dept_id', deptId);
    return apiRequest(`/api/tenant/leaves?${params.toString()}`);
  },
  getPendingLeaves: () => apiRequest('/api/tenant/leaves/pending'),
  approveLeave: (id) => apiRequest(`/api/tenant/leaves/${id}/approve`, { method: 'PATCH' }),
  rejectLeave: (id, reason) => {
    const body = reason ? JSON.stringify({ reason }) : '{}';
    return apiRequest(`/api/tenant/leaves/${id}/reject`, { method: 'PATCH', body });
  },
  getAllEmployees: (deptId) => {
    const params = deptId ? `?dept_id=${deptId}` : '';
    return apiRequest(`/api/tenant/employees${params}`);
  },
  getEmployeeDetail: (id) => apiRequest(`/api/tenant/employees/${id}`),
  getEmployeeAttendance: (id, month, year) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    return apiRequest(`/api/tenant/employees/${id}/attendance?${params.toString()}`);
  },
  findEmployeeByFingerprint: (fingerId) => apiRequest(`/api/tenant/employees/fingerprint/${fingerId}`),
  getSettings: () => apiRequest('/api/tenant/settings'),
  updateSettings: (data) => apiRequest('/api/tenant/settings', { method: 'PUT', body: JSON.stringify(data) }),
  getTenantProfile: () => apiRequest('/api/tenant/profile'),
  getActivityLog: () => apiRequest('/api/tenant/activity'),
};

// ==================== SUPER ADMIN APIs ====================
export const superAdminApi = {
  getTenants: () => apiRequest('/api/superadmin/tenants'),
  createTenant: (data) => apiRequest('/api/superadmin/tenants', { method: 'POST', body: JSON.stringify(data) }),
  getTenantDetails: (id) => apiRequest(`/api/superadmin/tenants/${id}`),
  resetTenantApiKey: (id) => apiRequest(`/api/superadmin/tenants/${id}/reset-api-key`, { method: 'PATCH' }),
  deleteTenant: (id) => apiRequest(`/api/superadmin/tenants/${id}`, { method: 'DELETE' }),
};

// ==================== AUTH APIs ====================
export const authApi = {
  login: (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    
    return fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    }).then(async (response) => {
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'Login failed');
      }
      const data = await response.json();
      localStorage.removeItem('api_key');
      localStorage.setItem('auth_type', 'bearer');
      localStorage.setItem('access_token', data.access_token);
      if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token);
      return data;
    });
  },
  
  tenantLogin: (apiKey) => {
    return fetch(`${API_BASE_URL}/api/auth/tenant-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey }),
    }).then(async (response) => {
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'Invalid API Key');
      }
      const data = await response.json();
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.setItem('api_key', apiKey);
      localStorage.setItem('auth_type', 'api_key');
      return data;
    });
  },
  
  refreshToken: (refreshToken) => apiRequest('/api/auth/refresh', { 
    method: 'POST', 
    body: JSON.stringify({ refresh_token: refreshToken }) 
  }),
  
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('api_key');
    localStorage.removeItem('auth_type');
    localStorage.removeItem('user');
  },
  
  changePassword: (data) => apiRequest('/api/auth/change-password', { method: 'POST', body: JSON.stringify(data) }),
  setPassword: (data) => apiRequest('/api/auth/set-password', { method: 'POST', body: JSON.stringify(data) }),
  createSuperAdmin: (data) => apiRequest('/api/auth/setup/super-admin', { method: 'POST', body: JSON.stringify(data) }),
};

// Backward compatibility
export const attendanceAPI = employeeApi;
export const profileAPI = employeeApi;
export const dashboardAPI = employeeApi;
export const leavesAPI = employeeApi;
export const holidaysAPI = employeeApi;
export const notificationsAPI = employeeApi;

export default {
  employee: employeeApi,
  org: orgApi,
  tenant: tenantApi,
  superAdmin: superAdminApi,
  auth: authApi,
};