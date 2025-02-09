import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login/Login";
import Homebase from "./components/Homebase/Homebase";
import Dashboard from "./components/Dashboard/Dashboard";
import { BrowserRouter as Router } from "react-router-dom";
import { BFFHost } from "app/shared/env";

export const bffUrl = `localhost:${BFFHost}`;

interface ProtectedRouteProps {
  children: React.ReactElement;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('authToken');
    const expiry = localStorage.getItem('tokenExpiry');

    if (!token || !expiry || parseInt(expiry) < Date.now()) {
      return false;
    }

    return true;
  }

  return isAuthenticated() ? children : <Navigate to="/" />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/homebase"
          element={
            <ProtectedRoute>
              <Homebase />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;