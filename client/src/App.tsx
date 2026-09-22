import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import MonthlyPf from './pages/MonthlyPf';
import ExitSettlement from './pages/ExitSettlement';
import Users from './pages/admin/Users';
import Roles from './pages/admin/Roles';
import type { ReactNode } from 'react';

function PrivateRoute({
  children,
  moduleKey,
  requireEdit = false,
}: {
  children: ReactNode;
  moduleKey: string;
  requireEdit?: boolean;
}) {
  const { user, loading, canView, canEdit } = useAuth();

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const allowed = requireEdit ? canEdit(moduleKey) : canView(moduleKey);
  if (!allowed) return <Navigate to="/" replace />;

  return children;
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute moduleKey="dashboard">
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route
          path="employees"
          element={
            <PrivateRoute moduleKey="employees">
              <Employees />
            </PrivateRoute>
          }
        />
        <Route
          path="monthly-pf"
          element={
            <PrivateRoute moduleKey="monthly_pf">
              <MonthlyPf />
            </PrivateRoute>
          }
        />
        <Route
          path="exit-settlement"
          element={
            <PrivateRoute moduleKey="exit_settlement">
              <ExitSettlement />
            </PrivateRoute>
          }
        />
        <Route
          path="admin/users"
          element={
            <PrivateRoute moduleKey="users">
              <Users />
            </PrivateRoute>
          }
        />
        <Route
          path="admin/roles"
          element={
            <PrivateRoute moduleKey="roles">
              <Roles />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
}
