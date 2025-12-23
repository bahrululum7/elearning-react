import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AdminPanel() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div style={{ padding: 20 }}>
        <h1>🛠 Admin Panel</h1>
        <ul style={{ lineHeight: '2em' }}>
          <li onClick={() => navigate('/admin/edit-session')} style={{ cursor: 'pointer' }}>
            ✏️ Edit Session
          </li>
        </ul>
      </div>
    </>
  );
}
