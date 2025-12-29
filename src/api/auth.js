import api from './index';

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  // Backend returns { token, technician } directly or wrapped in { success, data }
  // Handle both cases
  const data = response.data.data || response.data;
  return data;
};

export const getTechnicianProfile = async () => {
  const response = await api.get('/me');
  // Backend returns { technician } or wrapped in { success, data }
  const data = response.data.data || response.data;
  return data.technician || data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('technician');
};
