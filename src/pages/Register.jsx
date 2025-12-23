import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email dan password wajib diisi');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    try {
      setLoading(true);
      await register(email, password);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrapper}>
      {/* Judul Utama */}
      <h1 style={styles.mainTitle}>Speaking English with Bahrul</h1>

      {/* Card Register */}
      <form onSubmit={handleRegister} style={styles.card}>
        <p style={styles.subtitle}>Buat akun baru untuk mulai belajar</p>

        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />

        <input type="password" placeholder="Password (min. 6 karakter)" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.registerButton} disabled={loading}>
          {loading ? 'Mendaftarkan...' : 'Register'}
        </button>

        <p style={styles.footerText}>
          Sudah punya akun?{' '}
          <span onClick={() => navigate('/login')} style={styles.link}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #2563eb, #1e40af)',
    gap: 24,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: 900,
    color: '#ffffff',
    textAlign: 'center',
  },
  card: {
    width: 380,
    padding: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
    display: 'flex',
    flexDirection: 'column',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
  },
  input: {
    marginBottom: 14,
    padding: '12px 14px',
    fontSize: 14,
    borderRadius: 8,
    border: '1px solid #cbd5f5',
    outline: 'none',
  },
  registerButton: {
    marginTop: 8,
    padding: '12px',
    fontSize: 15,
    fontWeight: 'bold',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#facc15',
    color: '#1e293b',
  },
  error: {
    color: '#dc2626',
    fontSize: 13,
    marginBottom: 10,
    textAlign: 'center',
  },
  footerText: {
    marginTop: 18,
    fontSize: 13,
    textAlign: 'center',
    color: '#475569',
  },
  link: {
    color: '#2563eb',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};
