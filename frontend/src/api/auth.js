import api from './axios';

export const forgotPassword = async (email) => {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data;
};

export const resetPassword = async (token, newPassword) => {
  const { data } = await api.put(`/auth/reset-password/${encodeURIComponent(token)}`, {
    password: newPassword,
  });
  return data;
};
