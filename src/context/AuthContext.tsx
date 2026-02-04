import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userUni: string | null;
  updateUserUni: (uni: string) => void; 
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  userUni: null,
  updateUserUni: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userUni, setUserUni] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().university) {
            setUserUni(docSnap.data().university);
          } else {
            setUserUni(null);
          }
        } catch (err) {
          console.error("Auth Error:", err);
          setUserUni(null);
        }
      } else {
        setUser(null);
        setUserUni(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  
  const updateUserUni = (uni: string) => {
    setUserUni(uni);
  };

  return (
    <AuthContext.Provider value={{ user, loading, userUni, updateUserUni }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);