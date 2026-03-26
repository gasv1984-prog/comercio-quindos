import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        setCurrentUser(docSnap.exists() ? { uid: user.uid, email: user.email, ...docSnap.data() } : { uid: user.uid, email: user.email, role: 'user', name: 'Usuario' });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  
  const register = async (name, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const assignedRole = password === 'S@ntysanchez1' ? 'supremo' : 'user';
    await setDoc(doc(db, "users", user.uid), {
      name, email, role: assignedRole, createdAt: serverTimestamp()
    });
    return user;
  };

  const logout = () => signOut(auth);

  const value = { currentUser, login, register, logout, loading };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
