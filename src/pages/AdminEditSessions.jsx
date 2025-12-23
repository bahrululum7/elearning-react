import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import Navbar from '../components/Navbar';

export default function AdminEditSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const q = query(collection(db, 'mainSessions'), orderBy('sessionNumber', 'asc'));
    const snap = await getDocs(q);
    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setSessions(data);
    setLoading(false);
  };

  const handleChange = (id, field, value) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const saveSession = async (session) => {
    try {
      setSavingId(session.id);
      const ref = doc(db, 'mainSessions', session.id);
      await updateDoc(ref, {
        title: session.title,
        moduleUrl: session.moduleUrl,
        meetingUrl: session.meetingUrl,
        isActive: session.isActive,
      });
      alert('✅ Session berhasil disimpan');
    } catch (err) {
      console.error(err);
      alert('❌ Gagal menyimpan');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: 20 }}>
        <h2>Admin – Edit Main Sessions</h2>
        {loading && <p>Loading sessions...</p>}
        {!loading &&
          sessions.map((s) => (
            <div key={s.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <h3>#{s.sessionNumber}</h3>
              <label>Judul</label>
              <input type="text" value={s.title} onChange={(e) => handleChange(s.id, 'title', e.target.value)} style={{ width: '100%', marginBottom: 8 }} />
              <label>Module URL (PDF)</label>
              <input type="text" value={s.moduleUrl} onChange={(e) => handleChange(s.id, 'moduleUrl', e.target.value)} style={{ width: '100%', marginBottom: 8 }} />
              <label>Meeting URL</label>
              <input type="text" value={s.meetingUrl} onChange={(e) => handleChange(s.id, 'meetingUrl', e.target.value)} style={{ width: '100%', marginBottom: 8 }} />
              <label style={{ display: 'flex', gap: 8 }}>
                <input type="checkbox" checked={s.isActive} onChange={(e) => handleChange(s.id, 'isActive', e.target.checked)} /> Aktif
              </label>
              <button onClick={() => saveSession(s)} disabled={savingId === s.id} style={{ marginTop: 12, padding: '8px 14px', fontWeight: 'bold', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                {savingId === s.id ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          ))}
      </div>
    </>
  );
}
