import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchNickname = async () => {
      const docRef = doc(db, 'students', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setNickname(docSnap.data().nickname || '');
      }
    };
    fetchNickname();
  }, [user]);

  if (!user) return null;

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#2563eb',
    color: '#fff',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    borderRadius: '0 0 10px 10px',
  };

  const buttonStyle = {
    backgroundColor: '#facc15',
    border: 'none',
    color: '#000',
    padding: '8px 16px',
    marginLeft: '10px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s',
  };

  const buttonHover = {
    backgroundColor: '#eab308',
    transform: 'scale(1.05)',
  };

  const [hoveredButton, setHoveredButton] = useState(null);

  return (
    <nav style={navStyle}>
      <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{`Hallooo ${nickname || user.email}`}</div>
      <div>
        {['Home', 'Profile', 'Logout'].map((label, idx) => {
          const onClick = label === 'Logout' ? handleLogout : () => navigate(`/${label.toLowerCase()}`);
          return (
            <button
              key={label}
              onClick={onClick}
              style={{
                ...buttonStyle,
                ...(hoveredButton === idx ? buttonHover : {}),
              }}
              onMouseEnter={() => setHoveredButton(idx)}
              onMouseLeave={() => setHoveredButton(null)}
            >
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
