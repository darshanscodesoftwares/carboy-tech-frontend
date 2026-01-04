import { Routes, Route, Navigate } from "react-router-dom";
import useTechnicianStore from "./store/technician";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import JobFlow from "./pages/JobFlow";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, checkAuth } = useTechnicianStore();
  if (!isAuthenticated && !checkAuth()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, checkAuth } = useTechnicianStore();
  if (isAuthenticated || checkAuth()) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/flow/:jobId"
        element={
          <ProtectedRoute>
            <JobFlow />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
