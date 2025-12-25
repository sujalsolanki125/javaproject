import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import VerifyOtp from '../pages/Auth/VerifyOtp';
import ResetPassword from '../pages/Auth/ResetPassword';
import Dashboard from '../pages/Dashboard/Dashboard';
import SurveyForm from '../pages/Surveys/SurveyForm';
import CarbonLogs from '../pages/Logs/CarbonLogs';
import Marketplace from '../pages/Marketplace/Marketplace';
import GoalsPage from '../pages/Goals/GoalsPage';
import Profile from '../pages/Profile/Profile';
import OrderHistory from '../pages/Orders/OrderHistory';
import Wishlist from '../pages/Wishlist/Wishlist';
import PrivateRoute from './PrivateRoute';

// Admin Components
import AdminLayout from '../components/admin/AdminLayout';
import AdminDashboard from '../pages/Admin/Dashboard';
import ProductManagement from '../pages/Admin/ProductManagement';
import UserManagement from '../pages/Admin/UserManagement';
import OrderManagement from '../pages/Admin/OrderManagement';
import Analytics from '../pages/Admin/Analytics';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/verify-otp" element={<VerifyOtp />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/survey" element={
          <PrivateRoute>
            <SurveyForm />
          </PrivateRoute>
        } />
        <Route path="/logs" element={
          <PrivateRoute>
            <CarbonLogs />
          </PrivateRoute>
        } />
        <Route path="/marketplace" element={
          <PrivateRoute>
            <Marketplace />
          </PrivateRoute>
        } />
        <Route path="/goals" element={
          <PrivateRoute>
            <GoalsPage />
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        <Route path="/orders" element={
          <PrivateRoute>
            <OrderHistory />
          </PrivateRoute>
        } />
        <Route path="/wishlist" element={
          <PrivateRoute>
            <Wishlist />
          </PrivateRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
        
        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
