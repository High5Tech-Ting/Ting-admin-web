import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "@/pages/signin";
import SignUp from "@/pages/signup";
import Home from "@/pages/home";
import AuthLayout from "@/components/auth_layout";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import DashboardPage from "@/pages/dashboard";
import UsersPage from "@/pages/dashboard/users";
import AddUserPage from "@/pages/dashboard/users/add";
import EditUserPage from "@/pages/dashboard/users/[id]";
import { ProtectedRoute } from "@/components/protected-route";
import { AuthProvider } from "./context/auth-context";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Authentication Routes */}
          <Route
            path="/signin"
            element={
              <AuthLayout>
                <SignIn />
              </AuthLayout>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthLayout>
                <SignUp />
              </AuthLayout>
            }
          />

          {/* Legacy Home Route */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/users"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <UsersPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/users/add"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AddUserPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/users/:id"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <EditUserPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;