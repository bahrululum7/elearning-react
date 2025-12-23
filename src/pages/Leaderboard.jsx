import { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/firebase';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

export default function Leaderboard() {
  const { semester } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const semesterNumber = semester ? Number(semester) : 1;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'quizResults'));
        const semesterKey = `semester_${semesterNumber}`;

        const result = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const quizData = docSnap.data().quizzes?.[semesterKey];
            if (!quizData) return null;

            // Ambil profile dari collection 'students'
            const profileDoc = await getDoc(doc(db, 'students', docSnap.id));
            const profile = profileDoc.exists() ? profileDoc.data() : {};

            return {
              uid: docSnap.id,
              email: docSnap.data().email,
              nickname: profile.nickname || 'Anonymous',
              bio: profile.bio || '',
              photoUrl: profile.photoUrl || '',
              score: quizData.score ?? 0,
            };
          })
        );

        setData(result.filter(Boolean).sort((a, b) => b.score - a.score));
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [semesterNumber]);

  if (loading) return <p style={{ textAlign: 'center', marginTop: 40 }}>Loading leaderboard...</p>;

  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  const openProfile = (user) => setSelectedProfile(user);
  const closeProfile = () => setSelectedProfile(null);

  return (
    <>
      <Navbar />
      <div style={{ padding: 20 }}>
        <h1 style={{ textAlign: 'center', marginBottom: 30, color: '#1e3a8a' }}>🏆 Leaderboard – Week {semesterNumber}</h1>

        {data.length === 0 && <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#555' }}>No participants yet.</p>}

        <AnimatePresence>
          {top3.length > 0 && (
            <motion.div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginBottom: 30 }} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.5 }}>
              {top3.map((u, i) => (
                <motion.div
                  key={u.uid}
                  onClick={() => openProfile(u)}
                  whileHover={{ scale: 1.05 }}
                  style={{
                    flex: 1,
                    maxWidth: 200,
                    padding: 20,
                    borderRadius: 16,
                    backgroundColor: i === 0 ? '#facc15' : i === 1 ? '#eab308' : '#fbbf24',
                    textAlign: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                    color: '#1f2937',
                  }}
                >
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      backgroundColor: '#ccc',
                      margin: '0 auto 12px',
                      backgroundImage: u.photoUrl ? `url(${u.photoUrl})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      border: '3px solid #fff',
                    }}
                  />
                  <div style={{ fontWeight: 'bold', fontSize: '1.1em', marginBottom: 4 }}>{u.nickname}</div>
                  <div>{u.score}</div>
                  <div style={{ fontSize: '0.8em', color: '#374151', marginTop: 4 }}>Rank {i + 1}</div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {rest.length > 0 && (
          <motion.table width="100%" cellPadding={10} style={{ borderCollapse: 'collapse', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <thead style={{ backgroundColor: '#1e40af', color: '#fff' }}>
              <tr>
                <th style={{ padding: 12 }}>Rank</th>
                <th>Nickname</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {rest.map((u, i) => (
                <motion.tr
                  key={u.uid}
                  style={{ borderTop: '1px solid #ddd', cursor: 'pointer' }}
                  whileHover={{ backgroundColor: '#e0f2fe' }}
                  onClick={() => openProfile(u)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <td style={{ padding: 8 }}>{i + 4}</td>
                  <td>{u.nickname}</td>
                  <td>{u.score}</td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        )}

        {/* Modal profile */}
        <AnimatePresence>
          {selectedProfile && (
            <motion.div
              onClick={closeProfile}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                style={{
                  backgroundColor: '#fff',
                  padding: 32,
                  borderRadius: 16,
                  maxWidth: 400,
                  width: '90%',
                  textAlign: 'center',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
                }}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    backgroundColor: '#ccc',
                    margin: '0 auto 16px',
                    backgroundImage: selectedProfile.photoUrl ? `url(${selectedProfile.photoUrl})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '3px solid #1e3a8a',
                  }}
                />
                <h2 style={{ color: '#1e3a8a' }}>{selectedProfile.nickname || 'Anonymous'}</h2>
                <p style={{ fontStyle: 'italic', color: '#555' }}>{selectedProfile.bio || 'No bio available'}</p>
                <button
                  onClick={closeProfile}
                  style={{
                    marginTop: 20,
                    padding: '10px 20px',
                    backgroundColor: '#1e40af',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
