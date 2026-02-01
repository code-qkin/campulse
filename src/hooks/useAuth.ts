import { useState, useEffect } from 'react';
import { onAuthStateChanged,  type User} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        setIsOnboarded(userDoc.exists() && userDoc.data().onboarded);
      }
      
      setLoading(false);
    });
  }, []);

  return { user, isOnboarded, loading };
}