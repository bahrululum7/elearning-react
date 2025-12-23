import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyARsav9m6Xv9H-XPPKnX8DNFwhZesRxQqE',
  authDomain: 'elearning-english.firebaseapp.com',
  projectId: 'elearning-english',
  storageBucket: 'elearning-english.appspot.com',
  messagingSenderId: '307108036106',
  appId: '1:307108036106:web:5c8a2b0bbdc7a084f7e9f3',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
