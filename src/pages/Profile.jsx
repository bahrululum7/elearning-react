import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import PhotoUpload from '../components/PhotoUpload';

export default function Profile() {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const docRef = doc(db, 'students', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setNickname(data.nickname || '');
        setBio(data.bio || '');
        setPhotoUrl(data.photoUrl || null);
        setUserData(data);
      } else {
        await setDoc(docRef, { email: user.email, nickname: '', bio: '', createdAt: serverTimestamp() });
        setUserData({ email: user.email });
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const docRef = doc(db, 'students', user.uid);
    await setDoc(docRef, { nickname, bio, photoUrl, updatedAt: serverTimestamp() }, { merge: true });
    alert('✅ Profile updated!');
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: 60, fontSize: 18 }}>Loading profile...</p>;

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 600, margin: '40px auto', padding: 20 }}>
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 12 }}
          style={{
            background: 'linear-gradient(135deg, #2563eb, #facc15)',
            borderRadius: 24,
            padding: 30,
            color: '#fff',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <PhotoUpload onUpload={setPhotoUrl} currentPhoto={photoUrl} />
          <motion.h2 initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 6 }}>
            {nickname || 'Anonymous'}
          </motion.h2>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              fontStyle: 'italic',
              color: '#2563eb', // teks biru
              WebkitTextStroke: '0.5px #2563eb', // stroke tipis biru
              marginBottom: 0,
              padding: '10px 15px',
              borderRadius: '12px',
              backgroundColor: '#facc15', // background kuning
              display: 'inline-block', // agar padding + borderRadius bekerja rapi
            }}
          >
            {bio || 'No bio available'}
          </motion.p>
        </motion.div>

        {/* Edit Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 24,
            marginTop: 30,
            boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 6, color: '#2563eb' }}>Nickname:</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter your nickname"
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 12,
                border: '2px solid #ccc',
                outline: 'none',
                transition: '0.3s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
              onBlur={(e) => (e.target.style.borderColor = '#ccc')}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 6, color: '#2563eb' }}>Kata-kata hari ini, {nickname || 'Kak'}:</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Tulis sesuatu yang menginspirasi..."
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 12,
                border: '2px solid #ccc',
                outline: 'none',
                transition: '0.3s',
                resize: 'none',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
              onBlur={(e) => (e.target.style.borderColor = '#ccc')}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            style={{
              width: '100%',
              padding: '12px 0',
              backgroundColor: '#2563eb',
              color: '#fff',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: 12,
              cursor: 'pointer',
              boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
              transition: '0.3s',
            }}
          >
            Save Profile
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}
