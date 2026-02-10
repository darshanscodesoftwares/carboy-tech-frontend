import { create } from "zustand";

const useNotificationStore = create((set) => ({
  notifications: [],
  addNotification: (message, type = "info") =>
    set((state) => ({
      notifications: [...state.notifications, { id: Date.now() + Math.random(), message, type }],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((notification) => notification.id !== id),
    })),
}));

export default useNotificationStore;
