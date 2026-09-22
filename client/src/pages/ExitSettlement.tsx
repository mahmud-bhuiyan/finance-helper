import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Employee, ExitSettlementResult } from '../types';

export default function ExitSettlement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeId, setEmployeeId] = useState('');
  const [lastWorkingDay, setLastWorkingDay] = useState('');
  const [totalBankProfit, setTotalBankProfit] = useState('');
  const [result, setResult] = useState<ExitSettlementResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api<Employee[]>('/employees')
      .then(setEmployees)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'));
  }, []);

  async function calculate() {
    setError('');
    try {
      const data = await api<ExitSettlementResult>('/exit/calculate', {
        method: 'POST',
        body: JSON.stringify({
          employeeId: Number(employeeId),
          lastWorkingDay,
          totalBankProfit: Number(totalBankProfit) || 0,
        }),
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed');
    }
  }

  return (
    <div>
      <h1>Exit Settlement</h1>
      <div style={{ display: 'grid', gap: 12, maxWidth: 420, marginBottom: 20 }}>
        <select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
          <option value="">Select employee</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>{e.fullName}</option>
          ))}
        </select>
        <input type="date" value={lastWorkingDay} onChange={(e) => setLastWorkingDay(e.target.value)} />
        <input
          type="number"
          placeholder="Total bank profit (BDT)"
          value={totalBankProfit}
          onChange={(e) => setTotalBankProfit(e.target.value)}
        />
        <button onClick={calculate}>Calculate</button>
      </div>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {result && (
        <div style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
          <h3>{result.employee.fullName}</h3>
          <p>PF tenure: {result.settlement.pfTenureYears} years</p>
          <p>Eligible for full PF: {result.settlement.eligibleForFull ? 'Yes' : 'No'}</p>
          <ul>
            <li>Employee 7%: {result.settlement.employeePf.toLocaleString()} BDT</li>
            <li>Employer 7%: {result.settlement.employerPf.toLocaleString()} BDT</li>
            <li>Bank profit share: {result.settlement.bankProfitShare.toLocaleString()} BDT</li>
            <li><strong>Total payout: {result.settlement.totalPayout.toLocaleString()} BDT</strong></li>
          </ul>
        </div>
      )}
    </div>
  );
}
