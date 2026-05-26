import axiosClient from './axiosClient.js';

export const shiftApi = {
  getMyShifts: () => axiosClient.get('/api/shifts/my').then((res) => res.data)
};
