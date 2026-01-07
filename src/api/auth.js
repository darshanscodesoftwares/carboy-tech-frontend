import api from './index';

// -------------------------
// TECHNICIAN LOGIN
// -------------------------
export const login = async (email, password) => {
  const response = await api.post(
    '/auth/login', // ✅ FIXED
    { email, password }
  );

  const data = response.data?.data || response.data;
  return data;
};

// -------------------------
// GET TECHNICIAN PROFILE
// -------------------------
export const getTechnicianProfile = async () => {
  const response = await api.get('/me'); // ✅ FIXED

  const data = response.data?.data || response.data;
  return data.technician || data;
};

// -------------------------
// LOGOUT
// -------------------------
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('technician');
};
