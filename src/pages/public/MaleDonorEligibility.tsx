import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertCircle, CheckCircle2, User, FileText, HeartPulse, BookOpen, Activity,
  ChevronDown, Phone, Calendar, ArrowRight, ArrowLeft, Dna, FileSearch, ShieldCheck, Download
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function MaleDonorEligibility() {
  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" as any }
  };

  const [activeReq, setActiveReq] = useState<number | null>(null);

  const requirements = [
    { title: "Age & Physical Health", desc: "Must be between 21 and 35 years of age with a healthy BMI.", reason: "Ensures optimal sperm quality and reduces age-related genetic risks.", verify: "Physical examination and age verification via government ID." },
    { title: "Educational Qualification", desc: "Minimum requirement of a bachelor's degree.", reason: "As per strict internal and regulatory guidelines.", verify: "Educational certificates verification." },
    { title: "Medical History", desc: "No significant hereditary disorders or active infectious diseases.", reason: "To prevent the transmission of genetic conditions or infections.", verify: "Extensive family history interview and blood tests." },
    { title: "Psychological Suitability", desc: "Mentally healthy and emotionally prepared for donation.", reason: "Ensures informed consent and understanding of the donation implications.", verify: "Mandatory counseling and psychological assessment." },
    { title: "Lifestyle Choices", desc: "Non-smoker, minimal alcohol consumption, and no substance abuse.", reason: "Substances negatively impact sperm count, motility, and DNA integrity.", verify: "Medical history and lifestyle questionnaire." },
  ];

  const documents = [
    { name: "Aadhaar Card", desc: "Primary identity and address proof." },
    { name: "PAN Card", desc: "Financial identity verification." },
    { name: "Passport", desc: "Additional identity proof (if applicable)." },
    { name: "Educational Degree", desc: "Proof of minimum educational qualification." },
    { name: "Passport-size Photos", desc: "Recent color photographs for records." }
  ];

  return (
    <div className="w-full bg-slate-50 min-h-screen font-sans">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" as any }}
            className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] rounded-full bg-blue-500/20 blur-[120px]"
          />
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-900/50 border border-blue-800 text-blue-300 text-sm font-semibold tracking-wide mb-6 backdrop-blur-md">
                <User className="w-4 h-4" /> Male Donor Program
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight">
                Become a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Sperm Donor</span>
              </h1>
              <p className="text-xl text-blue-100/80 mb-10 leading-relaxed max-w-2xl">
                Learn about the eligibility requirements, comprehensive medical screening, and legal guidelines involved in becoming a donor.
              </p>
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex gap-4 items-start">
                <AlertCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">
                  <strong className="text-red-100">No Online Registration.</strong> All registrations are conducted offline at our facility following mandatory counseling and medical evaluation.
                </p>
              </div>
            </motion.div>
          </div>
          
          <div className="flex-1 hidden lg:flex justify-center relative">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="relative w-full aspect-square max-w-[500px]"
             >
               <div className="absolute inset-0 rounded-full border border-white/10 opacity-20"></div>
               <div className="absolute inset-10 rounded-full bg-gradient-to-br from-blue-900/50 to-indigo-900/50 backdrop-blur-3xl border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden">
                  <Activity className="w-32 h-32 text-blue-400 opacity-80" />
               </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Eligibility Checklist */}
      <section className="py-24 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Eligibility Criteria</h2>
          <p className="text-lg text-slate-600">Our strict screening protocols ensure only the highest quality samples are selected.</p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-4">
            {requirements.map((req, i) => (
              <button
                key={i}
                onClick={() => setActiveReq(activeReq === i ? null : i)}
                className={`w-full flex items-center justify-between p-6 rounded-2xl border text-left transition-all duration-300 ${activeReq === i ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white border-slate-200 text-slate-900 hover:border-blue-300'}`}
              >
                <div className="flex items-center gap-4">
                  <CheckCircle2 className={`w-6 h-6 ${activeReq === i ? 'text-white' : 'text-blue-500'}`} />
                  <span className="text-lg font-bold">{req.title}</span>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${activeReq === i ? 'rotate-180 text-white' : 'text-slate-400'}`} />
              </button>
            ))}
          </div>

          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              {activeReq !== null ? (
                <motion.div
                  key={activeReq}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-slate-200 h-full"
                >
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{requirements[activeReq].title}</h3>
                  <p className="text-slate-600 text-lg mb-8 leading-relaxed">{requirements[activeReq].desc}</p>
                  
                  <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div>
                      <strong className="flex items-center gap-2 text-slate-900 mb-2"><ShieldCheck className="w-5 h-5 text-green-500" /> Why it matters</strong>
                      <p className="text-slate-600">{requirements[activeReq].reason}</p>
                    </div>
                    <div>
                      <strong className="flex items-center gap-2 text-slate-900 mb-2"><FileSearch className="w-5 h-5 text-blue-500" /> Verification Method</strong>
                      <p className="text-slate-600">{requirements[activeReq].verify}</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full bg-white border border-slate-200 border-dashed rounded-3xl flex flex-col items-center justify-center text-slate-400 p-12 min-h-[400px]">
                  <Activity className="w-16 h-16 mb-4 opacity-20" />
                  <p className="text-lg">Select a requirement to view details</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Required Documents */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Required Documents</h2>
            <p className="text-lg text-slate-600">Original documents must be presented during your initial offline appointment.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {documents.map((doc, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center hover:border-blue-300 transition-colors group"
              >
                <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform text-blue-600">
                  <FileText className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">{doc.name}</h4>
                <p className="text-sm text-slate-500">{doc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Journey Timeline */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">The Donation Journey</h2>
            <p className="text-lg text-slate-600">A clear, step-by-step process from your first appointment to successful donation.</p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 md:-translate-x-1/2"></div>

            <div className="space-y-12">
              {[
                { title: "Offline Enquiry", desc: "Contact us via phone to schedule your initial consultation.", icon: Phone },
                { title: "Counseling & ID Verification", desc: "In-person psychological assessment and strict identity verification.", icon: User },
                { title: "Semen Analysis", desc: "Initial sample collection to evaluate count, motility, and morphology.", icon: Activity },
                { title: "Medical & Genetic Testing", desc: "Extensive blood work to rule out infections and hereditary conditions.", icon: Dna },
                { title: "Doctor Approval", desc: "Final review of all reports by our medical officers.", icon: ShieldCheck },
                { title: "Donation & Cryopreservation", desc: "Routine sample collection and cryogenic freezing.", icon: CheckCircle2 }
              ].map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex flex-col md:flex-row gap-8 items-start md:items-center relative ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
                >
                  <div className={`hidden md:block flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-slate-600">{step.desc}</p>
                  </div>
                  
                  <div className="w-16 h-16 shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center border-4 border-slate-50 relative z-10 shadow-lg">
                    <step.icon className="w-6 h-6" />
                  </div>

                  <div className="flex-1 md:hidden bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{step.title}</h3>
                    <p className="text-slate-600 text-sm">{step.desc}</p>
                  </div>
                  
                  <div className="hidden md:block flex-1"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px]"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to Take the Next Step?</h2>
              <p className="text-xl text-blue-100 mb-10 leading-relaxed">
                Remember, all donor registrations are conducted strictly through scheduled offline appointments at Genes India. 
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="tel:+919893312881" className="bg-white text-slate-900 px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" /> Call to Schedule Appointment
                </a>
                <button className="bg-blue-800/50 backdrop-blur-md text-white border border-blue-700 px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-800 transition-colors flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" /> Download Donor Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
