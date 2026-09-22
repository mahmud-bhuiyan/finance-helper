import { useEffect, useState, type FormEvent } from 'react';
import { api } from '../../api';
import { useAuth } from '../../context/AuthContext';
import type { Role, UserListItem } from '../../types';

export default function Users() {
  const { canEdit } = useAuth();
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [form, setForm] = useState({
    email: '',
    name: '',
    password: '',
    roleId: '',
    isSuperAdmin: false,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api<UserListItem[]>('/users'), api<Role[]>('/roles')])
      .then(([u, r]) => {
        setUsers(u);
        setRoles(r);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'));
  }, []);

  async function createUser(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await api('/users', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          roleId: form.roleId ? Number(form.roleId) : null,
        }),
      });
      setUsers(await api<UserListItem[]>('/users'));
      setForm({ email: '', name: '', password: '', roleId: '', isSuperAdmin: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    }
  }

  return (
    <div>
      <h1>Users</h1>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {canEdit('users') && (
        <form onSubmit={createUser} style={{ display: 'grid', gap: 8, maxWidth: 420, marginBottom: 24 }}>
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <select value={form.roleId} onChange={(e) => setForm({ ...form, roleId: e.target.value })}>
            <option value="">No role</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          <label>
            <input
              type="checkbox"
              checked={form.isSuperAdmin}
              onChange={(e) => setForm({ ...form, isSuperAdmin: e.target.checked })}
            />
            Super Admin
          </label>
          <button type="submit">Create user</button>
        </form>
      )}
      <table style={{ width: '100%', background: '#fff', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Super Admin</th>
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role?.name || '—'}</td>
              <td>{u.isSuperAdmin ? 'Yes' : 'No'}</td>
              <td>{u.isActive ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
