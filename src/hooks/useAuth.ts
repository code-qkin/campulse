import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This listener runs whenever the user logs in or out
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true); 

      if (currentUser) {
        setUser(currentUser);
        try {
          // Check if the user has a university saved in Firestore
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          
          if (userDoc.exists() && userDoc.data().university) {
            setIsOnboarded(true); 
          } else {
            setIsOnboarded(false);
          }
        } catch (error) {
          console.error("Error checking user profile:", error);
          setIsOnboarded(false); 
        }
      } else {
        setUser(null);
        setIsOnboarded(false);
      }
      
      setLoading(false); 
    });

    return () => unsubscribe();
  }, []);

  return { user, isOnboarded, loading };
}