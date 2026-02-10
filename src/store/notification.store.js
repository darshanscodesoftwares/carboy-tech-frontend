import { create } from "zustand";

const useNotificationStore = create((set) => ({
  notifications: [],
  addNotification: (message, type = "info") =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          id: Date.now() + Math.random(),
          // Normalize so Toast can always read {title, text}
          message:
            typeof message === "string"
              ? { title: type === "success" ? "Success" : type === "error" ? "Error" : "Info", text: message }
              : message,
          type,
        },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((notification) => notification.id !== id),
    })),
}));

export default useNotificationStore;
