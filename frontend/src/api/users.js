import api from './axios';

export const getProfile = async () => {
  const { data } = await api.get('/users/profile');
  return data;
};

export const updateProfile = async (updates) => {
  const { data } = await api.put('/users/profile', updates);
  return data;
};
