import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 32, borderRadius: 8, width: 360 }}>
        <h1>Finance Helper</h1>
        <p style={{ color: '#666' }}>Sign in to continue</p>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        <label style={{ display: 'block', marginTop: 16 }}>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', marginTop: 4 }} />
        </label>
        <label style={{ display: 'block', marginTop: 16 }}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', marginTop: 4 }}
          />
        </label>
        <button type="submit" style={{ marginTop: 20, width: '100%', padding: 10 }}>
          Login
        </button>
      </form>
    </div>
  );
}
