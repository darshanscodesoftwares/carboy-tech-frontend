import api from './index';

// -------------------------
// TECHNICIAN LOGIN
// -------------------------
export const login = async (email, password) => {
  const response = await api.post(
    '/technician/auth/login',
    { email, password }
  );

  // Backend may return:
  // { token, technician }
  // OR { success: true, data: { token, technician } }
  const data = response.data?.data || response.data;
  return data;
};

// -------------------------
// GET TECHNICIAN PROFILE
// -------------------------
export const getTechnicianProfile = async () => {
  const response = await api.get('/technician/me');

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
