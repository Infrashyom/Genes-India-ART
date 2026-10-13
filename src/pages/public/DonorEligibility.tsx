import { motion } from 'motion/react';
import { ArrowRight, User, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DonorEligibility() {
  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" as any }
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen font-sans">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" as any }}
            className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] rounded-full bg-teal-500/20 blur-[120px]"
          />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" as any, delay: 1 }}
            className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[70%] rounded-full bg-blue-600/30 blur-[120px]"
          />
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-900/50 border border-blue-800 text-blue-300 text-sm font-semibold tracking-wide mb-6 backdrop-blur-md">
              <Users className="w-4 h-4" /> Become a Donor
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight">
              Donor <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Eligibility</span>
            </h1>
            <p className="text-xl text-blue-100/80 mb-10 leading-relaxed max-w-2xl mx-auto">
              Learn about the eligibility requirements, medical screening, and legal guidelines for becoming a sperm or egg donor.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pathways Section */}
      <section className="py-24 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Male Donor Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/5 border border-slate-100 group flex flex-col"
          >
            <div className="aspect-[4/3] bg-blue-50 relative overflow-hidden flex items-center justify-center p-8">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-teal-50/50"></div>
               <User className="w-48 h-48 text-blue-200 relative z-10 group-hover:scale-110 transition-transform duration-700" />
               <div className="absolute bottom-6 left-8 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full font-bold text-blue-900 text-sm shadow-sm border border-white">
                 Sperm Donation
               </div>
            </div>
            <div className="p-10 flex flex-col flex-1">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Male Donor Eligibility</h2>
              <p className="text-slate-600 mb-8 leading-relaxed flex-1">
                Explore the criteria, medical screening process, and commitment required to become a sperm donor at Genes India.
              </p>
              <Link 
                to="/male-donor-eligibility" 
                className="inline-flex items-center justify-between bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 px-8 py-4 rounded-full font-bold transition-all group/btn"
              >
                Explore Male Donor Eligibility
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Female Donor Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-rose-900/5 border border-slate-100 group flex flex-col"
          >
            <div className="aspect-[4/3] bg-rose-50 relative overflow-hidden flex items-center justify-center p-8">
               <div className="absolute inset-0 bg-gradient-to-br from-rose-100/50 to-orange-50/50"></div>
               <User className="w-48 h-48 text-rose-200 relative z-10 group-hover:scale-110 transition-transform duration-700" />
               <div className="absolute bottom-6 left-8 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full font-bold text-rose-900 text-sm shadow-sm border border-white">
                 Egg Donation
               </div>
            </div>
            <div className="p-10 flex flex-col flex-1">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Female Donor Eligibility</h2>
              <p className="text-slate-600 mb-8 leading-relaxed flex-1">
                Understand the requirements, hormonal evaluation, and comprehensive journey for prospective egg donors.
              </p>
              <Link 
                to="/female-donor-eligibility" 
                className="inline-flex items-center justify-between bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 px-8 py-4 rounded-full font-bold transition-all group/btn"
              >
                Explore Female Donor Eligibility
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Disclaimer */}
      <section className="pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 text-center border border-slate-800">
          <h3 className="text-xl font-bold text-white mb-4">Important Notice: No Online Registration</h3>
          <p className="text-slate-400 leading-relaxed">
            To prevent identity fraud and maintain ethical standards, <strong>Genes India does not accept online donor registrations</strong>. All prospective donors must visit our facility in person for mandatory identity verification, comprehensive medical screening, and psychological counseling.
          </p>
        </div>
      </section>

    </div>
  );
}