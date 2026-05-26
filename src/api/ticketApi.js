import axiosClient from './axiosClient.js';

export const ticketApi = {
  getMyTickets: () => axiosClient.get('/api/tickets/my').then((res) => res.data),
  createTicket: (payload) => axiosClient.post('/api/tickets', payload).then((res) => res.data)
};
