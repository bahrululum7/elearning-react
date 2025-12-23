import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSessionId, setOpenSessionId] = useState(null);
  const [showSessions, setShowSessions] = useState(false); // kontrol muncul session

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const q = query(collection(db, 'mainSessions'), where('semester', '==', 1), where('isActive', '==', true), orderBy('sessionNumber', 'asc'));

      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSessions(data);
    } catch (err) {
      console.error('Error fetch sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSession = (id) => {
    setOpenSessionId(openSessionId === id ? null : id);
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: 20 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 20, // jarak antar kartu
            marginTop: 50,
          }}
        >
          {/* Fun Quiz Card */}
          <motion.div
            layout
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03, boxShadow: '0 15px 25px rgba(0,0,0,0.2)' }}
            onClick={() => (window.location.href = '/quiz/1')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              background: 'linear-gradient(135deg, #f97316, #fb923c)',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 20,
              borderRadius: 24,
              padding: '20px 30px',
              cursor: 'pointer',
              width: 'fit-content',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            }}
          >
            🎲 Fun Quiz
          </motion.div>

          {/* Main Session Card */}
          <motion.div
            layout
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03, boxShadow: '0 15px 25px rgba(0,0,0,0.2)' }}
            onClick={() => setShowSessions(!showSessions)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 20,
              borderRadius: 24,
              padding: '20px 30px',
              cursor: 'pointer',
              width: 'fit-content',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            }}
          >
            📘 Main Session – Semester 1
          </motion.div>

          {/* Leaderboard Card */}
          <motion.div
            layout
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03, boxShadow: '0 15px 25px rgba(0,0,0,0.2)' }}
            onClick={() => (window.location.href = '/leaderboard/1')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              background: 'linear-gradient(135deg, #10b981, #34d399)',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 20,
              borderRadius: 24,
              padding: '20px 30px',
              cursor: 'pointer',
              width: 'fit-content',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            }}
          >
            🏆 Leaderboard
          </motion.div>
        </div>

        <br></br>
        <br></br>
        <br></br>

        {/* Session list */}
        <AnimatePresence>
          {showSessions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ staggerChildren: 0.05 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 20,
              }}
            >
              {sessions.map((s, idx) => (
                <motion.div
                  key={s.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                  style={{
                    background: '#fff',
                    borderRadius: 24,
                    padding: 20,
                    cursor: 'pointer',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderTop: '6px solid #2563eb',
                    minHeight: 140,
                  }}
                  onClick={() => toggleSession(s.id)}
                >
                  {/* Badge session number */}
                  <div
                    style={{
                      position: 'absolute',
                      top: -10,
                      left: -10,
                      backgroundColor: '#facc15',
                      color: '#1f2937',
                      fontWeight: 'bold',
                      borderRadius: '50%',
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      fontSize: 14,
                    }}
                  >
                    {s.sessionNumber}
                  </div>

                  {/* Title */}
                  <h3 style={{ margin: '0 0 10px 0', fontSize: 16, fontWeight: 600, color: '#2563eb' }}>{s.title}</h3>

                  {/* Expandable content */}
                  <AnimatePresence>
                    {openSessionId === s.id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginTop: 8 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {s.moduleUrl && (
                            <a
                              href={s.moduleUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                backgroundColor: '#2563eb',
                                color: '#fff',
                                fontWeight: 600,
                                textDecoration: 'none',
                                borderRadius: 8,
                                padding: '6px 12px',
                                textAlign: 'center',
                              }}
                            >
                              📄 Download Modul
                            </a>
                          )}
                          {s.meetingUrl && (
                            <a
                              href={s.meetingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                backgroundColor: '#facc15',
                                color: '#1f2937',
                                fontWeight: 600,
                                textDecoration: 'none',
                                borderRadius: 8,
                                padding: '6px 12px',
                                textAlign: 'center',
                              }}
                            >
                              🎥 Join Meeting
                            </a>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
