import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import { ToastProvider } from '../components/ui/Toast';
import { ProtectedRoute, PublicOnlyRoute } from './routes';

// Pages
import LeadCapture from '../pages/LeadCapture';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Leads from '../pages/Leads';
import LeadDetails from '../pages/LeadDetails';
import CalendarPage from '../pages/Calendar';
import Settings from '../pages/Settings';
import NotFound from '../pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LeadCapture />} />

            {/* Login — redirect to /admin if already authenticated */}
            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<Login />} />
            </Route>

            {/* Protected admin routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/leads" element={<Leads />} />
              <Route path="/admin/leads/:id" element={<LeadDetails />} />
              <Route path="/admin/calendar" element={<CalendarPage />} />
              <Route path="/admin/settings" element={<Settings />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
