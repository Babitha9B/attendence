// Android emulator: use http://10.0.2.2:8080/api
// iOS simulator: use http://localhost:8080/api
// Physical phone: use your Mac's LAN IP, e.g. http://192.168.1.10:8080/api
export const API_BASE_URL = 'http://localhost:8080/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${response.status})`);
  }
  if (response.status === 204) return null;
  return response.json();
}

export const getStudents = () => request('/students');
export const createStudent = (student) => request('/students', {
  method: 'POST', body: JSON.stringify(student)
});
export const deleteStudent = (id) => request(`/students/${id}`, { method: 'DELETE' });
export const markAttendance = (record) => request('/attendance', {
  method: 'POST', body: JSON.stringify(record)
});
export const getAttendance = (date) => request(`/attendance?date=${date}`);
export const getSummary = (studentId, year, month) =>
  request(`/attendance/summary?studentId=${studentId}&year=${year}&month=${month}`);
