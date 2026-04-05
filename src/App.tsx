import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RequireBusiness from "./components/RequireBusiness";
import RequireNoBusiness from "./components/RequireNoBusiness";
import AppShell from "./components/layout/AppShell";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import BusinessesPage from "./pages/BusinessesPage";
import CreateBusinessPage from "./pages/CreateBusinessPage";
import EditBusinessPage from "./pages/EditBusinessPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route
          path="/"
          element={
            <RequireBusiness>
              <DashboardPage />
            </RequireBusiness>
          }
        />

        <Route
          path="/upload"
          element={
            <RequireBusiness>
              <UploadPage />
            </RequireBusiness>
          }
        />

        <Route
          path="/analytics"
          element={
            <RequireBusiness>
              <AnalyticsPage />
            </RequireBusiness>
          }
        />

        <Route path="/businesses" element={<BusinessesPage />} />

        <Route
          path="/businesses/new"
          element={
            // <RequireNoBusiness>
              <CreateBusinessPage />
            // </RequireNoBusiness>           
          }
        />

        <Route path="/businesses/:id/edit" element={<EditBusinessPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}