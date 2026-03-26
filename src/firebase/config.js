import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDciK_xC_yJjz6ubJTWl7EldDsbtyoLsd0",
  authDomain: "ecomerce-65ae5.firebaseapp.com",
  projectId: "ecomerce-65ae5",
  storageBucket: "ecomerce-65ae5.firebasestorage.app",
  messagingSenderId: "672304568491",
  appId: "1:672304568491:web:e6f7fedeafff6ea681ffee",
  measurementId: "G-5QEG5CYJLP"
};

let app, db, auth;
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
} catch (error) {
  console.warn("Firebase no ha sido configurado. Datos no persistirán.");
}

export { db, auth };
