import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import DashboardLayout from './layouts/dashboard/DashboardLayout';
import DashboardAppPage from './pages/DashboardAppPage';
import Admin from './pages/Admin/Admin';
import ManageCPD from './pages/ManageCPD/ManageCPD';
import Page404 from './pages/Page404';
import CertCPDmanage from './pages/Cert&CPDmanage/Cert_CPDmanage';
import AddCPD from './pages/AddCPD/AddCPD';
import AdminProtectedRoute from './AdminProtectedRoute/AdminProtectedRoute';
import BlockedUser from './pages/BlockedUser';
import LoginSignupForm from './pages/Login/LoginSignupForm';
import ApproveUser from './pages/Admin/ApproveUser';
import CourseApprove from './pages/Admin/CourseApprove';
import BlockUser from './pages/Admin/BlockUser';
import Profile from './pages/Profile/Profile';
import Loader from './pages/Login/Loading/Loader';
import CPDApprove from './pages/Admin/CPDApprove';
import ForgotPassword from './pages/Login/ForgotPassword/ForgotPassword';
import AddCPD2 from './pages/AddCPD/AddCPD2';
import CourseAdmin from './pages/Admin/CourseAdmin';
import AddCourses from './pages/Cert&CPDmanage/AddCourses/AddCourses';
import AllUser from './pages/Admin/AllUser';
import CertUpload from './pages/Admin/CertUpload';
import Print from './pages/Cert&CPDmanage/Print Certificate/PrintCertificate';
import ApproveAllUsers from './pages/Admin/ApproveAllUsers';
import Courses from './pages/Admin/Courses';
import AddCourses1 from './pages/Login/AddCourses1/AddCourses1';
import BlockCourses from './pages/Admin/BlockCourses';
import ExpirableUser from './pages/Admin/ExpirableUser';
import AddUser from './pages/Admin/AddUser';
import ChangePassword from './pages/Profile/ChangePassword';
import EditProfile from './pages/Profile/EditProfile';

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <ScrollToTop />
          <StyledChart />
          <Routes>
            {/* Admin Routes */}
            <Route
              element={
                <AdminProtectedRoute roleRequired="admin" statusRequired="approved" roleRequired2="management" />
              }
            >
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/approve" element={<ApproveUser />} />
              <Route path="/admin/all-user" element={<AllUser />} />
              <Route path="/admin/freeze" element={<BlockUser />} />
              <Route path="/admin/approve-all" element={<ApproveAllUsers />} />
              <Route path="/admin/addcourse" element={<CourseAdmin />} />
              <Route path="/admin/course" element={<CourseApprove />} />
              <Route path="/admin/cpd" element={<CPDApprove />} />
              <Route path="/admin/cert-upload" element={<CertUpload />} />
              <Route path="/admin/user-courses/:id" element={<Courses />} />
              <Route path="/admin/freeze/courses" element={<BlockCourses />} />
              <Route path="/admin/expire-user" element={<ExpirableUser />} />
              <Route path="/admin/add-user" element={<AddUser />} />
            </Route>

            {/* User Routes */}
            <Route element={<DashboardLayout roleRequired="user" statusRequired={['approved', 'pending']} />}>
              <Route index element={<DashboardAppPage />} />
              <Route path="/dashboard/app" element={<DashboardAppPage />} />
              <Route path="/dashboard/managecpd" element={<ManageCPD />} />
              <Route path="/dashboard/profile" element={<Profile />} />
              <Route path="/dashboard/cpdmanagement" element={<CertCPDmanage />} />
              <Route path="/dashboard/addcpd" element={<AddCPD />} />
              <Route path="/dashboard/addcpd2" element={<AddCPD2 />} />
              <Route path="/dashboard/addcourse" element={<AddCourses />} />
              <Route path="/dashboard/print" element={<Print />} />
              <Route path="/dashboard/change_password" element={<ChangePassword />} />
              <Route path="/dashboard/edit-profile" element={<EditProfile />} />
            </Route>

            {/* Public Routes */}
            <Route path="/block" element={<BlockedUser />} />
            <Route path="/login" element={<LoginSignupForm />} />
            <Route path="/add-course" element={<AddCourses1 />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/loader" element={<Loader />} />
            <Route path="/*" element={<Page404 />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
