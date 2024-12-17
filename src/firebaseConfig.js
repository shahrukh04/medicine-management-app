import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCPVawetexFx6vq2erk6RoOUDcHze2wGn4',
  authDomain: 'medicine-management-6baec.firebaseapp.com',
  projectId: 'medicine-management-6baec',
  storageBucket: 'medicine-management-6baec.appspot.com',
  messagingSenderId: '509275459147',
  appId: '1:509275459147:web:your-full-app-id', // Check Firebase Console for correct appId
};



const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
