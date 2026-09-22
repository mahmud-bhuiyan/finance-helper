import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.name}.</p>
      <p>Use the sidebar to manage employees, monthly PF, and exit settlements.</p>
    </div>
  );
}
