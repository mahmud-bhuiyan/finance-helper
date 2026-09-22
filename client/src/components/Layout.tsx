import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard', module: 'dashboard', end: true },
  { to: '/employees', label: 'Employees', module: 'employees' },
  { to: '/monthly-pf', label: 'Monthly PF', module: 'monthly_pf' },
  { to: '/exit-settlement', label: 'Exit Settlement', module: 'exit_settlement' },
  { to: '/admin/users', label: 'Users', module: 'users' },
  { to: '/admin/roles', label: 'Roles', module: 'roles' },
];

export default function Layout() {
  const { user, logout, canView } = useAuth();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 220, background: '#1e293b', color: '#fff', padding: 16 }}>
        <h2 style={{ fontSize: 18, margin: '0 0 16px' }}>Finance Helper</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {navItems
            .filter((item) => canView(item.module))
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                style={({ isActive }) => ({
                  padding: '8px 12px',
                  borderRadius: 6,
                  background: isActive ? '#334155' : 'transparent',
                })}
              >
                {item.label}
              </NavLink>
            ))}
        </nav>
        <div style={{ marginTop: 24, fontSize: 14, opacity: 0.85 }}>
          <div>{user?.name}</div>
          <div style={{ fontSize: 12 }}>{user?.isSuperAdmin ? 'Super Admin' : user?.role?.name}</div>
          <button
            onClick={logout}
            style={{
              marginTop: 12,
              padding: '6px 10px',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}
