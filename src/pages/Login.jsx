import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const snap = await getDoc(doc(db, 'students', user.uid));
      if (!snap.exists()) {
        alert('Akses ditolak');
        return navigate('/home');
      }

      const role = snap.data().role;
      role === 'admin' ? navigate('/admin') : navigate('/home');
    } catch (err) {
      alert('Login gagal');
      console.error(err);
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Judul Utama */}
      <h1 style={styles.mainTitle}>Speaking English with Bahrul</h1>

      {/* Card Login */}
      <form onSubmit={handleLogin} style={styles.card}>
        <p style={styles.subtitle}>Silakan login untuk melanjutkan</p>

        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />

        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} />

        {/* Tombol Login */}
        <button type="submit" style={styles.loginButton}>
          Login
        </button>

        {/* Divider */}
        <div style={styles.divider}>
          <span>atau</span>
        </div>

        {/* Tombol Register */}
        <button type="button" onClick={() => navigate('/register')} style={styles.registerButton}>
          Register
        </button>
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
    letterSpacing: '0.5px',
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
  loginButton: {
    marginTop: 6,
    padding: '12px',
    fontSize: 15,
    fontWeight: 'bold',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#facc15',
    color: '#1e293b',
  },
  divider: {
    margin: '18px 0',
    textAlign: 'center',
    fontSize: 13,
    color: '#94a3b8',
  },
  registerButton: {
    padding: '10px',
    fontSize: 14,
    fontWeight: 'bold',
    borderRadius: 8,
    border: '1px solid #2563eb',
    backgroundColor: '#ffffff',
    color: '#2563eb',
    cursor: 'pointer',
  },
};
