import { useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import type { PfContribution, PfGenerateResult } from '../types';

export default function MonthlyPf() {
  const { canEdit } = useAuth();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [result, setResult] = useState<PfGenerateResult | { contributions: PfContribution[] } | null>(null);
  const [error, setError] = useState('');

  async function load() {
    setError('');
    try {
      const data = await api<PfContribution[]>(`/pf/${year}/${month}`);
      setResult({ contributions: data });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    }
  }

  async function generate() {
    setError('');
    try {
      const data = await api<PfGenerateResult>(`/pf/generate/${year}/${month}`, { method: 'POST' });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate');
    }
  }

  const totals = result && 'totals' in result ? result.totals : null;

  return (
    <div>
      <h1>Monthly PF</h1>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
        <input type="number" min={1} max={12} value={month} onChange={(e) => setMonth(Number(e.target.value))} />
        <button onClick={load}>Load</button>
        {canEdit('monthly_pf') && <button onClick={generate}>Generate</button>}
      </div>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {totals && (
        <p>
          Total deposit: <strong>{totals.combined.toLocaleString()} BDT</strong>
        </p>
      )}
      {result?.contributions?.length > 0 && (
        <table style={{ width: '100%', background: '#fff', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Employee PF</th>
              <th>Employer PF</th>
              <th>Days worked</th>
            </tr>
          </thead>
          <tbody>
            {result.contributions.map((c) => (
              <tr key={c.id}>
                <td>{c.employeeId}</td>
                <td>{Number(c.employeePf).toLocaleString()}</td>
                <td>{Number(c.employerPf).toLocaleString()}</td>
                <td>{c.daysWorked}/{c.daysInMonth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
