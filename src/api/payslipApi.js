import axiosClient from './axiosClient.js';

export const payslipApi = {
  getMyPayslips: () => axiosClient.get('/api/payslips/my').then((res) => {
    console.log('Payslips API response:', res.data);
    return res.data;
  }),
  getMyPayslipRequests: () => axiosClient.get('/api/payslips/requests/my').then((res) => {
    console.log('Payslip requests API response:', res.data);
    return res.data;
  }),
  requestPayslip: (payload) => axiosClient.post('/api/payslips/request', payload).then((res) => res.data),
  getPayslipPdf: (payslipId) => axiosClient.get(`/api/payslips/${payslipId}/pdf`, {
    responseType: 'blob'
  })
};
