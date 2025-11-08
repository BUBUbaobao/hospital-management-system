import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import PatientDashboard from '../pages/Patient/Dashboard';
import DoctorDashboard from '../pages/Doctor/Dashboard';
import AdminDashboard from '../pages/Admin/Dashboard';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route
        path="/patient/*"
        element={
          <PrivateRoute requiredRole="PATIENT">
            <PatientDashboard />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/doctor/*"
        element={
          <PrivateRoute requiredRole="DOCTOR">
            <DoctorDashboard />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/admin/*"
        element={
          <PrivateRoute requiredRole="ADMIN">
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;

