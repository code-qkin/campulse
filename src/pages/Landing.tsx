import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight01Icon, 
  SecurityCheckIcon, 
  Rocket01Icon, 
  Money03Icon, 
  Message01Icon,
  Search01Icon,
  Menu01Icon,
  Cancel01Icon,
  ArrowDown01Icon,
  HelpCircleIcon,
  Mail01Icon,
} from 'hugeicons-react';

const Landing = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // State for FAQ Accordion
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Helper to handle navigation
  const goToApp = () => navigate('/auth');

  const faqs = [
    {
      question: "Is CamPulse really free for students?",
      answer: "Yes! It is 100% free to post items and browse deals. We are built to support the student community. We do not charge commissions on your sales."
    },
    {
      question: "How do I get paid for my items?",
      answer: "CamPulse connects you directly with buyers. Payment happens offline or via bank transfer when you meet to hand over the item. We recommend meeting in public places like the Student Center or Library."
    },
    {
      question: "Can I sell to students in other universities?",
      answer: "Currently, CamPulse is designed for hyperlocal trading. You can only see and sell items within your own registered campus (e.g., FUTA students trade with FUTA students). This keeps transactions safe and fast."
    },
    {
      question: "How do I verify that a buyer is real?",
      answer: "We require users to select their campus during onboarding. Additionally, since you meet in person on campus, the risk of 'internet scams' is significantly lower compared to selling to strangers online."
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 scroll-smooth">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo - Refreshes Page */}
          <div className="flex items-center gap-1 text-2xl font-black italic tracking-tighter cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="text-blue-600">Cam</span><span>pulse</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">How it Works</a>
            <a href="#faq" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">FAQ</a>
            <button 
              onClick={goToApp}
              className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-blue-600 hover:scale-105 transition-all"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-slate-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <Cancel01Icon size={24} /> : <Menu01Icon size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-slate-100 p-6 flex flex-col gap-4 shadow-xl md:hidden animate-in slide-in-from-top-5">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-slate-600">Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-slate-600">How it Works</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-slate-600">Contact Us</a>
            <button onClick={goToApp} className="w-full rounded-xl bg-blue-600 py-4 font-black text-white">Join Now</button>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        <div className="mx-auto max-w-7xl grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left animate-in slide-in-from-bottom-10 duration-700">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-600 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Live at 15+ Nigerian Campuses
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6 text-slate-900">
              The marketplace that <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">knows your campus.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-10 max-w-lg mx-auto md:mx-0">
              Buy and sell textbooks, dorm essentials, and gadgets safely within your university. No shipping fees, no strangers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button 
                onClick={goToApp}
                className="group flex items-center justify-center gap-3 rounded-2xl bg-slate-900 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-slate-900/20 hover:bg-blue-600 transition-all hover:-translate-y-1"
              >
                Start Trading <ArrowRight01Icon size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={goToApp}
                className="flex items-center justify-center gap-3 rounded-2xl bg-white border border-slate-200 px-8 py-4 text-lg font-bold text-slate-600 hover:bg-slate-50 transition-all hover:border-blue-200 hover:text-blue-600"
              >
                Browse Deals
              </button>
            </div>
            
            <p className="mt-6 text-xs font-bold text-slate-400">
              Trusted by 5,000+ students from FUTA, UNILAG, UI & more.
            </p>
          </div>

          <div className="relative animate-in zoom-in-95 duration-1000 delay-200 hidden md:block">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-[3rem] -z-10 blur-2xl opacity-60"></div>
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 bg-white aspect-[4/3] group cursor-pointer" onClick={goToApp}>
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop" 
                alt="Students studying" 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <Money03Icon size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Recent Sale</p>
                  <p className="font-bold text-slate-900">Engineering Math Textbook sold for ₦2,500</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- LOGO TICKER --- */}
      <section className="border-y border-slate-100 bg-slate-50/50 py-10 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">
            Connecting students across
          </p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 cursor-default">
            {['FUTA', 'UNILAG', 'OAU', 'UI', 'CU', 'UNIBEN'].map(uni => (
              <span key={uni} className="text-2xl font-black text-slate-900">{uni}</span>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="py-24 px-6 scroll-mt-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
              Why stick to <span className="text-blue-600">WhatsApp Groups?</span>
            </h2>
            <p className="text-lg text-slate-500">
              Spammy group chats are messy. CamPulse is built specifically for commerce, safety, and speed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <SecurityCheckIcon size={32} />,
                title: "Verified Students Only",
                desc: "No random strangers. We require campus selection to ensure you are trading with real students."
              },
              {
                icon: <Search01Icon size={32} />,
                title: "Smart Filtering",
                desc: "Stop scrolling through 500 messages. Search by 'Textbook' or 'Fridge' and find exactly what you need."
              },
              {
                icon: <Rocket01Icon size={32} />,
                title: "Instant Setup",
                desc: "Snap a photo, add a price, and your item is visible to thousands of students at your school instantly."
              }
            ].map((feature, i) => (
              <div key={i} className="group rounded-[2rem] border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/40 hover:border-blue-100 hover:shadow-blue-500/10 transition-all hover:-translate-y-2">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="how-it-works" className="py-24 bg-slate-900 text-white px-6 scroll-mt-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8">
                Turn your clutter into <br />
                <span className="text-blue-500">cash in minutes.</span>
              </h2>
              <div className="space-y-8">
                {[
                  { title: "Create an Account", desc: "Sign up with Google and select your university campus." },
                  { title: "Post an Item", desc: "Upload a photo, set a price, and add your WhatsApp contact." },
                  { title: "Get Paid", desc: "Meet the buyer on campus and complete the trade safely." }
                ].map((step, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full border-2 border-slate-700 font-black text-xl text-blue-500">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                      <p className="text-slate-400 font-medium">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={goToApp}
                className="mt-12 rounded-2xl bg-blue-600 px-8 py-4 font-black text-white hover:bg-white hover:text-blue-600 transition-all"
              >
                Start Selling Now
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-[100px] opacity-20 rounded-full"></div>
              <div className="relative rounded-[2.5rem] border border-slate-800 bg-slate-950 p-6 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                 <div className="flex items-center gap-4 mb-6 border-b border-slate-800 pb-4">
                   <div className="h-10 w-10 rounded-full bg-slate-800"></div>
                   <div className="h-4 w-32 bg-slate-800 rounded-full"></div>
                </div>
                <div className="space-y-4">
                   <div className="h-48 w-full bg-slate-800 rounded-2xl animate-pulse"></div>
                   <div className="h-4 w-3/4 bg-slate-800 rounded-full"></div>
                </div>
                <div className="mt-6 flex justify-between items-center">
                   <div className="h-8 w-24 bg-blue-600/20 rounded-lg"></div>
                   <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Message01Icon size={20} className="text-white" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section id="testimonials" className="py-24 px-6 bg-slate-50 scroll-mt-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-black text-center mb-16">What students are saying</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { text: "Sold my old fridge in 2 hours. Way faster than posting on status updates.", name: "Tobi", school: "FUTA" },
              { text: "Found a cheap calculus textbook for my 100lvl exams. Life saver.", name: "Chioma", school: "UNILAG" },
              { text: "Finally a place that feels safe. I know everyone here actually goes to my school.", name: "Ibrahim", school: "ABU" }
            ].map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm">
                <div className="flex gap-1 text-yellow-400 mb-4">
                  {[1,2,3,4,5].map(s => <span key={s}>★</span>)}
                </div>
                <p className="text-slate-600 font-medium mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden">
                     <img src={`https://ui-avatars.com/api/?name=${t.name}&background=random`} alt={t.name} />
                  </div>
                  <div>
                    <p className="font-black text-sm text-slate-900">{t.name}</p>
                    <p className="text-xs font-bold text-slate-400">{t.school}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section id="faq" className="py-24 px-6 scroll-mt-24 bg-white">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-16">
             <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4">
                <HelpCircleIcon size={24} />
             </div>
             <h2 className="text-4xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                className={`group cursor-pointer rounded-2xl border p-6 transition-all duration-300 ${
                  openFaqIndex === index 
                  ? 'bg-slate-50 border-blue-200 shadow-md' 
                  : 'bg-white border-slate-100 hover:border-blue-100 hover:shadow-lg hover:shadow-slate-200/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className={`font-bold text-lg ${openFaqIndex === index ? 'text-blue-600' : 'text-slate-900'}`}>
                    {faq.question}
                  </h3>
                  <div className={`transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180 text-blue-600' : 'text-slate-400'}`}>
                    <ArrowDown01Icon size={20} />
                  </div>
                </div>
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    openFaqIndex === index ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-slate-600 font-medium leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CONTACT US SECTION (NEW) --- */}
      <section id="contact" className="py-24 px-6 bg-slate-50 border-t border-slate-100">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Still have questions?</h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Can't find the answer you're looking for? Chat to our friendly team.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center gap-6">
             <a 
               href="mailto:alabiabubakr2020@gmail.com"
               className="flex items-center gap-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/10 transition-all group"
             >
               <div className="h-14 w-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                 <Mail01Icon size={28} />
               </div>
               <div className="text-left">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email Support</p>
                 <p className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">alabiabubakr2020@gmail.com</p>
               </div>
             </a>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white pt-24 pb-10 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-1 text-2xl font-black italic tracking-tighter mb-6 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <span className="text-blue-600">Cam</span><span>pulse</span>
            </div>
            <p className="text-slate-500 max-w-xs font-medium">
              The #1 Hyperlocal Marketplace for Nigerian Students. Safe, fast, and built for your campus.
            </p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-6">Product</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li><button onClick={goToApp} className="hover:text-blue-600 text-left">Marketplace</button></li>
              <li><button onClick={goToApp} className="hover:text-blue-600 text-left">Sell an Item</button></li>
              <li><button onClick={goToApp} className="hover:text-blue-600 text-left">Create Account</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-6">Support</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li><a href="#how-it-works" className="hover:text-blue-600">How it Works</a></li>
              <li><a href="#faq" className="hover:text-blue-600">FAQ</a></li>
              <li><a href="mailto:alabiabubakr2020@gmail.com" className="hover:text-blue-600">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-6 pt-8 border-t border-slate-100 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
          <p>&copy; 2026 CamPulse Nigeria.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
             <a href="#" className="hover:text-slate-900">Privacy Policy</a>
             <a href="#" className="hover:text-slate-900">Terms of Use</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;