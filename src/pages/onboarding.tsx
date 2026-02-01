import { useState } from 'react';
import { db, auth } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

const Onboarding = () => {
  const [university, setUniversity] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    if (!university) return alert("Please select a university");
    setLoading(true);
    try {
      if (auth.currentUser) {
        // Update their profile with the school choice
        await setDoc(doc(db, "users", auth.currentUser.uid), {
          email: auth.currentUser.email,
          university: university,
          displayName: auth.currentUser.displayName,
          onboarded: true,
          createdAt: Date.now()
        }, { merge: true });
        
        // Refresh page or trigger state update
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl shadow-blue-500/5">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
            🎓
          </div>
          <h2 className="text-3xl font-black text-slate-900">One last thing!</h2>
          <p className="mt-3 text-slate-500">Which campus are you trading on?</p>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Select Your University</label>
            <select 
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
            >
              <option value="">Choose a campus...</option>
              <option value="unilag">University of Lagos</option>
              <option value="oau">Obafemi Awolowo University</option>
              <option value="futa">FUTA</option>
            </select>
          </div>

          <button 
            onClick={handleFinish}
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Start Trading"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;