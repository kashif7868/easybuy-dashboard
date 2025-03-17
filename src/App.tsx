import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./components/auth/AuthPage";
import AllPages from "./components/AllPages/AllPages";
import AppLayout from "./layout/AppLayout";
import { AuthProvider, useAuth } from "./context/authContext";

// Protected Route to ensure only logged-in users can access certain pages
interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth();  // Access user from context

  if (!user) {
    // If the user is not logged in, redirect to the user page
    return <Navigate to="/user" />;
  }

  return <>{children}</>; // If the user is logged in, render the children (protected route)
}

interface AppProps {}

function App({}: AppProps) {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Authentication Routes */}
          <Route path="/user" element={<AuthPage />} />

          {/* App Layout Routes - Protected Routes */}
          <Route element={<AppLayout />}>
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AllPages />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
