
import api from './index';

 

export const login = async (email, password) => {

  const response = await api.post('/auth/login', { email, password });

  return response.data.data;

};

 

export const getTechnicianProfile = async () => {

  const response = await api.get('/me');

  return response.data.data;

};

 

export const logout = () => {

  localStorage.removeItem('token');

  localStorage.removeItem('technician');

};

