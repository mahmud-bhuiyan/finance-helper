import { useEffect, useState } from 'react';
import { api } from '../../api';
import { useAuth } from '../../context/AuthContext';
import type { AppModule, Role } from '../../types';

export default function Roles() {
  const { canEdit } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [modules, setModules] = useState<AppModule[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api<Role[]>('/roles'), api<AppModule[]>('/modules')])
      .then(([r, m]) => {
        setRoles(r);
        setModules(m);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'));
  }, []);

  return (
    <div>
      <h1>Roles & Permissions</h1>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {!canEdit('roles') && <p>View only — contact superadmin to edit roles.</p>}
      {roles.map((role) => (
        <div key={role.id} style={{ background: '#fff', padding: 16, marginBottom: 16, borderRadius: 8 }}>
          <h3>{role.name}</h3>
          <p style={{ color: '#666' }}>{role.description}</p>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Module</th>
                <th>View</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {role.permissions.map((p) => (
                <tr key={p.id}>
                  <td>{p.module.name}</td>
                  <td>{p.canView ? 'Yes' : 'No'}</td>
                  <td>{p.canEdit ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      <p style={{ color: '#666', fontSize: 14 }}>
        Modules available: {modules.map((m) => m.name).join(', ')}
      </p>
    </div>
  );
}
