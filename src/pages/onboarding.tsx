import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import { 
  UniversityIcon, 
  Search01Icon, 
  CheckmarkCircle02Icon, 
  ArrowRight01Icon 
} from 'hugeicons-react';

const UNIVERSITIES = [
  "FUTA (Federal University of Technology, Akure)",
  "UNILAG (University of Lagos)",
  "OAU (Obafemi Awolowo University)",
  "UI (University of Ibadan)",
  "UNILORIN (University of Ilorin)",
  "UNIBEN (University of Benin)",
  "LASU (Lagos State University)",
  "ABU (Ahmadu Bello University)",
  "UNN (University of Nigeria, Nsukka)",
  "CU (Covenant University)",
  "BABCOCK (Babcock University)",
  "LAUTECH (Ladoke Akintola University)",
  "FUOYE (Federal University Oye-Ekiti)",
  "ADEKUNLE AJASIN (AAUA)",
  "KWASU (Kwara State University)"
];

const Onboarding = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUni, setSelectedUni] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const filteredUnis = UNIVERSITIES.filter(uni => 
    uni.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleJoinCampus = async () => {
    if (!selectedUni || !auth.currentUser) return;

    setSaving(true);
    try {
      // CRITICAL: Save to the user's specific document ID
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        university: selectedUni,
        email: auth.currentUser.email,
        displayName: auth.currentUser.displayName,
        photoURL: auth.currentUser.photoURL,
        joinedAt: Date.now()
      }, { merge: true }); // Merge ensures we don't wipe existing data

      // Force reload to trigger useAuth check
      window.location.reload(); 
    } catch (error) {
      console.error("Error saving campus:", error);
      alert("Something went wrong. Please try again.");
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-8 md:p-12 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-blue-50 text-blue-600 mb-6">
            <UniversityIcon size={40} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Select your Campus</h1>
          <p className="mt-3 text-slate-500 font-medium">
            CamPulse is hyperlocal. You will only see items posted by students at your school.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <span className="absolute left-5 top-4 text-slate-400">
            <Search01Icon size={20} />
          </span>
          <input 
            type="text" 
            placeholder="Search your university..." 
            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-4 font-bold text-slate-900 outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-600 transition-all placeholder:font-medium placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* University List */}
        <div className="max-h-60 overflow-y-auto space-y-2 mb-8 pr-2 custom-scrollbar">
          {filteredUnis.length > 0 ? (
            filteredUnis.map((uni) => (
              <button
                key={uni}
                onClick={() => setSelectedUni(uni)}
                className={`w-full text-left px-5 py-4 rounded-xl font-bold transition-all flex items-center justify-between group ${
                  selectedUni === uni 
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100 hover:border-slate-200'
                }`}
              >
                <span>{uni}</span>
                {selectedUni === uni && <CheckmarkCircle02Icon size={20} className="text-blue-400" />}
              </button>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400 font-medium">
              No university found. <br /> Try "FUTA" or "UNILAG"
            </div>
          )}
        </div>

        {/* Action Button */}
        <button 
          onClick={handleJoinCampus}
          disabled={!selectedUni || saving}
          className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white rounded-2xl py-5 font-black text-lg shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {saving ? (
            <div className="h-6 w-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              Join Campus <ArrowRight01Icon size={24} />
            </>
          )}
        </button>
        
        <p className="mt-6 text-center text-[10px] font-black uppercase tracking-widest text-slate-300">
          Step 2 of 2: Community Setup
        </p>
      </div>
    </div>
  );
};

export default Onboarding;