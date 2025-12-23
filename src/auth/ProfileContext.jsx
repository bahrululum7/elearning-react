import { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from './AuthContext';

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const ref = doc(db, 'students', user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setProfile(snap.data());
      } else {
        const newProfile = {
          email: user.email,
          role: 'mahasiswa',
          level: null, // DISET OLEH ADMIN SAJA
          createdAt: serverTimestamp(),
        };

        await setDoc(ref, newProfile);
        setProfile(newProfile);
      }

      setLoading(false);
    }

    loadProfile();
  }, [user]);

  return <ProfileContext.Provider value={{ profile }}>{!loading && children}</ProfileContext.Provider>;
}

export function useProfile() {
  return useContext(ProfileContext);
}
