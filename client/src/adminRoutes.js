import { Navigate, useRoutes } from 'react-router-dom';
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import ManageCPD from './pages/ManageCPD/ManageCPD';
import SignUpPage from './pages/SignUpPage';
import ProfileMain from './pages/Profile/ProfileMain';
import CertCPDmanage from './pages/Cert&CPDmanage/Cert_CPDmanage';
import UserData from './_mock/UserData';
import AdminPage from './pages/AdminPage'; // new admin page component
import { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext'; // import auth context
import Admin from './pages/Admin/Admin';

export default function Router() {
  const { isAuthenticated, user } = useContext(AuthContext); // get auth context
  const isAdmin = user.role === 'admin' || 'management'; // check if user is admin or management

  const routes = useRoutes([
    {
      path: '/admin',
      element: <Admin />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'managecpd', element: <ManageCPD /> },
        { path: 'profile', element: <ProfileMain /> },
        { path: 'cpdmanagement', element: <CertCPDmanage /> },
        { path: 'userdata', element: <UserData /> },
        {
          // create new admin route with the "isAdmin" check
          path: 'admin',
          element: isAuthenticated && isAdmin ? <AdminPage /> : <Navigate to="/404" />,
        },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'signup',
      element: <SignUpPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
