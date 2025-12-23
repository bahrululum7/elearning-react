import { useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function AdminGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      const snap = await getDoc(doc(db, 'students', user.uid));

      if (snap.exists() && snap.data().role === 'admin') {
        setAllowed(true);
      } else {
        setAllowed(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Checking admin access...</p>;
  if (!allowed) return <p>⛔ Akses ditolak (Admin only)</p>;

  return children;
}
