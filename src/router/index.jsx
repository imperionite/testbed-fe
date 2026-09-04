import { Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import LoginPage from "../pages/LoginPage";
import About from "../pages/About";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsConditions from "../pages/TermsConditions";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import StudentsRoute from "../features/students/StudentsRoute";
import StudentProfilePage from "../features/students/StudentProfilePage";

import Dashboard from "../pages/Dashboard";
import UserManagementPage from "../features/users/UserManagementPage";
import HteManagementPage from "../features/htes/HTEManagementPage";
import AppLayout from "../layouts/AppLayout";
import AuthGuard from "../guards/AuthGuard";
import GuestGuard from "../guards/GuestGuard";

import NotFound from "../pages/NotFound";

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route element={<GuestGuard />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        <Route path="/about" element={<About />} />

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        <Route path="/terms-and-conditions" element={<TermsConditions />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<AuthGuard />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/userandroles" element={<UserManagementPage />} />
          <Route path="/companies" element={<HteManagementPage />} />
          <Route path="/students" element={<StudentsRoute />} />
          <Route path="/students/me" element={<StudentProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
