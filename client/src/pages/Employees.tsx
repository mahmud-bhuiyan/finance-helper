import { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import type { Employee } from '../types';

export default function Employees() {
  const { canEdit } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api<Employee[]>('/employees')
      .then(setEmployees)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'));
  }, []);

  async function deleteDemoData() {
    if (!confirm('Delete all demo employee data?')) return;
    await api('/employees/demo', { method: 'DELETE' });
    const data = await api<Employee[]>('/employees');
    setEmployees(data);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Employees</h1>
        {canEdit('employees') && <button onClick={deleteDemoData}>Delete demo data</button>}
      </div>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <table style={{ width: '100%', background: '#fff', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">Code</th>
            <th align="left">Name</th>
            <th align="left">Type</th>
            <th align="right">Gross</th>
            <th align="right">Basic</th>
            <th align="left">PF Start</th>
            <th align="left">Demo</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((e) => (
            <tr key={e.id}>
              <td>{e.employeeCode}</td>
              <td>{e.fullName}</td>
              <td>{e.employmentType}</td>
              <td align="right">{Number(e.grossSalary).toLocaleString()}</td>
              <td align="right">{Number(e.basicSalary).toLocaleString()}</td>
              <td>{e.pfStartDate ? new Date(e.pfStartDate).toLocaleDateString() : '—'}</td>
              <td>{e.isDemo ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
