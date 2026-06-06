// src/routes/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import { PATHS } from './routes.config';

// Pages
import LandingPage from '../pages/landing';
import Login from '../pages/login';
import DashboardPage from '../pages/dashboard';

// Layouts
import { LandingPageLayout } from '../components/layout/LandingPageLayout';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import LiveClassesPage from '@/pages/live-classes';
import MyCoursesPage from '@/pages/my-courses';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing Route */}
      <Route 
        path={PATHS.HOME} 
        element={<LandingPageLayout><LandingPage /></LandingPageLayout>} 
      />

      {/* Auth Route */}
      <Route path={PATHS.LOGIN} element={<Login />} />

      {/* Dashboard Route */}
      <Route 
        path={PATHS.DASHBOARD} 
        element={<DashboardLayout><DashboardPage /></DashboardLayout>} 
      />
      <Route 
        path={PATHS.LiveClasses} 
        element={<DashboardLayout><LiveClassesPage /></DashboardLayout>} 
      />
      <Route 
        path={PATHS.Courses} 
        element={<DashboardLayout><MyCoursesPage /></DashboardLayout>} 
      />
    

      {/* Admin Route */}
      {/* <Route path={PATHS.ADMIN_DASHBOARD} element={<AdminDashboard />} /> */}
    </Routes>
  );
};