import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Simple Nav */}
      <nav className="flex items-center justify-between px-6 py-6 mx-auto max-w-7xl">
        <div className="flex items-center gap-1 text-2xl font-black italic tracking-tighter">
          <span className="text-blue-600">Cam</span><span>pulse</span>
        </div>
        <button 
          onClick={() => navigate('/auth')} 
          className="font-bold text-sm text-slate-600 hover:text-blue-600 transition-colors"
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <section className="px-6 pt-16 pb-24 mx-auto max-w-7xl text-center">
        <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 rounded-full">
          Exclusively for Students
        </span>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
          The smartest way to <br /> 
          <span className="text-blue-600 italic">trade on campus.</span>
        </h1>
        <p className="mt-8 text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Buy and sell textbooks, dorm gear, and electronics with verified students 
          at your university. No shipping, no stress, just campus deals.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-2xl hover:bg-blue-600 transition-all hover:scale-105 active:scale-95"
          >
            Start Trading Now
          </button>
          <a href="#about" className="font-bold text-slate-400 hover:text-slate-900 transition-colors">
            Learn how it works →
          </a>
        </div>
      </section>

      {/* Stats/Social Proof */}
      <section className="border-y border-slate-100 bg-slate-50/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-6 py-12 mx-auto max-w-7xl">
          {[
            { label: 'Universities', val: '10+' },
            { label: 'Active Students', val: '2k+' },
            { label: 'Items Sold', val: '500+' },
            { label: 'Safe Deals', val: '100%' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-black text-slate-900">{stat.val}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-6 py-24 mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black leading-tight">
              Built for the <br /> 
              <span className="text-blue-600">hyperlocal economy.</span>
            </h2>
            <div className="mt-8 space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">1</div>
                <div>
                  <h4 className="font-bold text-lg">Verified Campus Feeds</h4>
                  <p className="text-slate-500">You only see items listed at your specific school. No more scrolling through deals 500km away.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">2</div>
                <div>
                  <h4 className="font-bold text-lg">Instant Communication</h4>
                  <p className="text-slate-500">Connect with sellers instantly. Arrange meetups at the library, student center, or dorms.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
             <div className="aspect-square bg-blue-100 rounded-[3rem] overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80" 
                  alt="Students on campus" 
                  className="w-full h-full object-cover"
                />
             </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="bg-slate-900 py-20 px-6 text-center text-white">
        <h2 className="text-3xl font-black">Ready to declutter your dorm?</h2>
        <p className="mt-4 text-slate-400">Join thousands of students turning old gear into cash.</p>
        <button 
          onClick={() => navigate('/auth')}
          className="mt-10 px-10 py-4 bg-blue-600 rounded-2xl font-black hover:bg-white hover:text-blue-600 transition-all"
        >
          Join CamPulse
        </button>
        <div className="mt-20 pt-8 border-t border-slate-800 text-xs text-slate-500 uppercase tracking-widest font-bold">
          &copy; 2026 CamPulse Hyperlocal. Akure, Nigeria.
        </div>
      </footer>
    </div>
  );
};

export default Landing;