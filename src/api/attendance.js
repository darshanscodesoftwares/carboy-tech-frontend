import api from "./index";

export const getTodayAttendance = () =>
  api.get("/attendance/today").then((r) => r.data.data);

export const markAttendance = (formData) =>
  api.post("/attendance", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((r) => r.data);
