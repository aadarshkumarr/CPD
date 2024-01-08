import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import ManageCPD from './pages/ManageCPD/ManageCPD';
import SignUpPage from './pages/SignUpPage';
import ProfileMain from './pages/Profile/ProfileMain';
import CertCPDmanage from './pages/Cert&CPDmanage/Cert_CPDmanage';
import UserData from './_mock/UserData';
import Admin from './pages/Admin/Admin';
import AddCPD from './pages/AddCPD/AddCPD';

export default function Router() {
  // const isAuthenticated = localStorage.getItem('user') === 'true';
  const user = localStorage.getItem('user');
  const userParse = JSON.parse(user);
  // const userRole = userParse.role;
  const userRole = userParse?.role || '';
  console.log(userRole);

  const requireAdminRole = (Component) => {
    return userRole === 'admin' || userRole === "management" ? <Component /> : <Navigate to="/dashboard/app" />;
  };

  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'admin', element: requireAdminRole(Admin) },
        { path: 'managecpd', element: <ManageCPD /> },
        { path: 'profile', element: <ProfileMain /> },
        { path: 'cpdmanagement', element: <CertCPDmanage /> },
        { path: 'userdata', element: <UserData /> },
        { path: 'addcpd', element: <AddCPD /> },
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
