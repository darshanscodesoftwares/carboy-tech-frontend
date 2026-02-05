import axios from "axios";

/* ========================================================
   ENVIRONMENT-AWARE BASE URL (LOCAL FIRST)
======================================================== */
const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const API_BASE_URL = isLocalhost
  ? import.meta.env.VITE_API_BASE_URL_LOCAL
  : import.meta.env.VITE_API_BASE_URL;

console.log("✅ TECH API BASE URL:", API_BASE_URL);

/* ========================================================
   AXIOS INSTANCE
======================================================== */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true, // 🔥 REQUIRED for CORS on Render
});

/* ========================================================
   REQUEST INTERCEPTOR
======================================================== */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.log("➡️ API Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ========================================================
   RESPONSE INTERCEPTOR
======================================================== */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("technician");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
