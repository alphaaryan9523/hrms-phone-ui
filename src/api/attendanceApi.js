import axiosClient from './axiosClient.js';

export const attendanceApi = {
  getMyAttendance: () => axiosClient.get('/api/attendance/my').then((res) => res.data),
  getTodayAttendance: () => axiosClient.get('/api/attendance/today').then((res) => res.data),
  clockIn: (payload = {}) => axiosClient.post('/api/attendance/clock-in', payload).then((res) => res.data),
  clockOut: (payload = {}) => axiosClient.post('/api/attendance/clock-out', payload).then((res) => res.data)
};
