import axiosClient from './axiosClient.js';

export const employeeApi = {
  me: () => axiosClient.get('/api/employee/me').then((res) => res.data)
};
