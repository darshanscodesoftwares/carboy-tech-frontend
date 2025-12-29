import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTechnicianStore = create(
  persist(
    (set, get) => ({
      technician: null,
      token: null,
      isAuthenticated: false,
      notificationCount: 0,

      setAuth: (token, technician) => {
        localStorage.setItem('token', token);
        set({ token, technician, isAuthenticated: true });
      },

      updateTechnician: (technician) => {
        set({ technician });
      },

      incrementNotification: () => {
        set((state) => ({ notificationCount: state.notificationCount + 1 }));
      },

      clearNotification: () => {
        set({ notificationCount: 0 });
      },

      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('technician');
        set({ token: null, technician: null, isAuthenticated: false, notificationCount: 0 });
      },

      checkAuth: () => {
        const state = get();

        // If already authenticated with technician data, return true
        if (state.isAuthenticated && state.token && state.technician) {
          return true;
        }

        // Check localStorage for token
        const token = localStorage.getItem('token');

        if (token) {
          // Try to restore from persisted state (Zustand persistence)
          // The persist middleware should have already restored the state
          if (state.technician) {
            set({ token, isAuthenticated: true });
            return true;
          }

          // If no technician data, still set authenticated
          // The Dashboard will fetch the profile
          set({ token, isAuthenticated: true });
          return true;
        }

        return false;
      },
    }),
    {
      name: 'technician-storage',
      partialize: (state) => ({
        technician: state.technician,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        notificationCount: state.notificationCount,
      }),
    }
  )
);

export default useTechnicianStore;