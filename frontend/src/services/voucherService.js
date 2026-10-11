import api from './api';

export const voucherService = {
  getVouchers: async (params = {}) => {
    return await api.get('/vouchers', { params });
  },

  getVoucherById: async (id) => {
    return await api.get(`/vouchers/${id}`);
  },

  createVoucher: async (voucherData) => {
    return await api.post('/vouchers', voucherData);
  },

  updateDraftVoucher: async (id, voucherData) => {
    return await api.put(`/vouchers/${id}`, voucherData);
  },

  deleteDraftVoucher: async (id) => {
    return await api.delete(`/vouchers/${id}`);
  },

  submitVoucher: async (id, data = {}) => {
    return await api.post(`/vouchers/${id}/submit`, data);
  },

  uploadSignature: async (file) => {
    const formData = new FormData();
    formData.append('signature', file);
    return await api.post('/vouchers/upload-signature', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Director Approval endpoints
  getPendingApprovals: async (params = {}) => {
    return await api.get('/approvals/pending', { params });
  },

  approveVoucher: async (id, data) => {
    return await api.post(`/approvals/${id}/approve`, data);
  },

  rejectVoucher: async (id, data) => {
    return await api.post(`/approvals/${id}/reject`, data);
  }
};
