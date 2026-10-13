import { motion } from 'motion/react';
import { Building2, ShieldCheck, Microscope, Database, Lock, Clock, ChevronRight } from 'lucide-react';

export default function HospitalPartnership() {
  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Header */}
      <section className="bg-slate-900 py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-900/50 border border-blue-800 text-blue-200 text-sm font-semibold tracking-wide mb-6"
            >
              <Building2 className="w-4 h-4" />
              <span>B2B Portal Access</span>
            </motion.div>
            <motion.h1 {...fadeUp} className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Partner with India's Premier ART Bank</motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-blue-100 leading-relaxed mb-8"
            >
              Exclusive access to a rigorously screened donor database, AI-powered matching, and secure cold-chain delivery for certified IVF hospitals.
            </motion.p>
            <motion.button 
              onClick={(e) => { e.preventDefault(); document.getElementById(`enquiry`)?.scrollIntoView({ behavior: `smooth` }); }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-lg shadow-blue-600/20"
            >
              Initiate Partnership
            </motion.button>
          </div>
          
          {/* Abstract Dashboard Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="hidden md:block relative"
          >
            <div className="bg-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-700 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-2 mb-6 border-b border-slate-700 pb-4">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <div className="ml-4 text-xs font-mono text-slate-400">hospital.genesindia.com</div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-slate-700/50 rounded w-1/3"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-24 bg-blue-900/30 border border-blue-800/50 rounded-xl"></div>
                  <div className="h-24 bg-blue-900/30 border border-blue-800/50 rounded-xl"></div>
                  <div className="h-24 bg-blue-900/30 border border-blue-800/50 rounded-xl"></div>
                </div>
                <div className="h-32 bg-slate-700/50 rounded-xl"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Partner With Us?</h2>
            <p className="text-lg text-slate-600">We manage the complexities of ART banking so you can focus on patient care.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: "100% Offline Verified", desc: "Every donor is physically verified, medically examined, and counseled at our facility. No online registrations." },
              { icon: Microscope, title: "Advanced Genetics", desc: "Comprehensive karyotyping and extended carrier screening performed on all donors." },
              { icon: Database, title: "Smart B2B Portal", desc: "Access our inventory securely. Use AI to match phenotypical traits like height, eye color, and blood group." },
              { icon: Lock, title: "ICMR Compliant", desc: "We handle all regulatory paperwork, consents, and strict data anonymization per national guidelines." },
              { icon: Clock, title: "Cold-Chain Logistics", desc: "Secure, temperature-monitored sample transport directly to your IVF laboratory." },
              { icon: Building2, title: "Dedicated Support", desc: "Priority support and a dedicated relationship manager for your hospital." }
            ].map((benefit, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200"
              >
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <benefit.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section className="py-24" id="enquiry">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl border border-slate-100"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Request Portal Access</h2>
              <p className="text-slate-600">Submit your hospital's details. Our administrative team will verify your credentials before granting access to the Hospital Portal.</p>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => { e.preventDefault(); alert("Enquiry routed to Admin Portal successfully."); }}>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Hospital/Clinic Name <span className="text-red-500">*</span></label>
                <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">ICMR Registration Number <span className="text-red-500">*</span></label>
                <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Chief Doctor / Director <span className="text-red-500">*</span></label>
                <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Official Email Address <span className="text-red-500">*</span></label>
                <input required type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Phone Number <span className="text-red-500">*</span></label>
                <input required type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">City & State <span className="text-red-500">*</span></label>
                <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">Additional Message</label>
                <textarea rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"></textarea>
              </div>
              <div className="md:col-span-2 pt-4">
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20">
                  Submit Partnership Request
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}