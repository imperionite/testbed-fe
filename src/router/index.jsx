import { Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import LoginPage from "../pages/LoginPage";
import About from "../pages/About";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsConditions from "../pages/TermsConditions";

import Dashboard from "../pages/Dashboard";
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
        </Route>

        <Route path="/about" element={<About />} />

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        <Route path="/terms-and-conditions" element={<TermsConditions />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<AuthGuard />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/*  <Route path="/users" element={<Users />} /> */}
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
