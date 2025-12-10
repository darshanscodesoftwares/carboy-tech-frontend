
import { create } from 'zustand';

import { persist } from 'zustand/middleware';

 

const useTechnicianStore = create(

  persist(

    (set, get) => ({

      technician: null,

      token: null,

      isAuthenticated: false,

 

      setAuth: (token, technician) => {

        localStorage.setItem('token', token);

        set({ token, technician, isAuthenticated: true });

      },

 

      updateTechnician: (technician) => set({ technician }),

 

      logout: () => {

        localStorage.removeItem('token');

        localStorage.removeItem('technician');

        set({ token: null, technician: null, isAuthenticated: false });

      },

 

      checkAuth: () => {

        const token = localStorage.getItem('token');

        if (token && !get().isAuthenticated) {

          set({ token, isAuthenticated: true });

          return true;

        }

        return get().isAuthenticated;

      },

    }),

    {

      name: 'technician-storage',

      partialize: (state) => ({

        technician: state.technician,

        token: state.token,

        isAuthenticated: state.isAuthenticated,

      }),

    }

  )

);

 

export default useTechnicianStore;

