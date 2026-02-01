import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [university, setUniversity] = useState('');
  const [displayName, setDisplayName] = useState(''); 
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update the Auth Profile
        await updateProfile(userCredential.user, { displayName: displayName });

        // Save to Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: displayName, 
          university: university,
          onboarded: true, 
          createdAt: Date.now()
        });
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  
  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName, // Google gives us this
        photoURL: result.user.photoURL,
        lastLogin: Date.now()
      }, { merge: true });
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Image Side (Same as before) */}
      <div className="relative hidden w-1/2 lg:block">
        <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000" alt="Students" className="absolute inset-0 h-full w-full object-cover"/>
        <div className="absolute inset-0 bg-blue-600/30 backdrop-blur-[1px]"></div>
      </div>

      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-24">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <div className="mb-12 flex items-center gap-1 text-4xl font-black tracking-tighter">
            <span className="text-blue-600">Cam</span><span className="text-slate-900">pulse</span>
          </div>

          <h2 className="text-3xl font-bold text-slate-900">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>

          <form onSubmit={handleAuth} className="mt-8 space-y-4">
            {/* NEW: Full Name Field (Only shows on Sign Up) */}
            {!isLogin && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
                <input 
                  type="text" 
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition-all focus:border-blue-500 focus:bg-white"
                  placeholder="John Doe"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
              <input 
                type="email" 
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition-all focus:border-blue-500 focus:bg-white"
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Your University</label>
                <select 
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition-all focus:border-blue-500 focus:bg-white"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  required
                >
                  <option value="">Select campus</option>
                  <option value="unilag">UNILAG</option>
                  <option value="oau">OAU</option>
                  <option value="futa">FUTA</option>
                </select>
              </div>
            )}

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
              <input 
                type="password" 
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition-all focus:border-blue-500 focus:bg-white"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button disabled={loading} className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg hover:bg-blue-700 disabled:opacity-70">
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Google Button */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-400">Or</span></div>
          </div>

          <button onClick={handleGoogleAuth} className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-4 font-bold text-slate-700 hover:bg-slate-50">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5" />
            Continue with Google
          </button>

          <p className="mt-8 text-center text-sm font-medium text-slate-600">
            {isLogin ? "Don't have an account?" : "Already a member?"}
            <button onClick={() => setIsLogin(!isLogin)} className="ml-1.5 font-bold text-blue-600 hover:underline">
              {isLogin ? "Join for free" : "Log in now"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;