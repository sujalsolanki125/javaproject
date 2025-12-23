import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import Dashboard from '../pages/Dashboard/Dashboard';
import SurveyForm from '../pages/Surveys/SurveyForm';
import Marketplace from '../pages/Marketplace/Marketplace';
import GoalsPage from '../pages/Goals/GoalsPage';
import Profile from '../pages/Profile/Profile';
import PrivateRoute from './PrivateRoute';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
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
        
        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
