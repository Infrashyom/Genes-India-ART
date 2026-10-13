import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, Dna, Info, Stethoscope, Microscope, 
  HeartPulse, Brain, Apple, ArrowRight, Play, Download,
  CheckCircle2, Plus, Minus, ChevronDown, FileText,
  Cigarette, Wine, Moon, Dumbbell, Coffee, ShieldAlert,
  Building2, Phone, Target, Droplet, Syringe
} from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function MaleFertility() {
  const anatomyRef = useRef<HTMLElement>(null);
  
  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" as any }
  };

  // State for Interactive Anatomy
  const [activeAnatomy, setActiveAnatomy] = useState(0);
  const anatomyParts = [
    { name: 'Testis', desc: 'The primary male reproductive organs responsible for producing sperm (spermatogenesis) and testosterone.', function: 'Sperm and hormone production.', disorders: 'Varicocele, Testicular failure, Trauma.', tests: 'Scrotal Ultrasound, Hormone Profile.' },
    { name: 'Epididymis', desc: 'A coiled tube located at the back of each testicle where sperm mature and are stored.', function: 'Sperm maturation and storage.', disorders: 'Epididymitis, Blockages.', tests: 'Physical Exam, Ultrasound.' },
    { name: 'Vas Deferens', desc: 'The muscular tube that transports mature sperm to the urethra in preparation for ejaculation.', function: 'Sperm transport.', disorders: 'Obstruction, Absence (CBAVD).', tests: 'Transrectal Ultrasound, Genetic Testing (CFTR).' },
    { name: 'Seminal Vesicle', desc: 'Glands that produce a significant portion of the seminal fluid that nourishes and transports sperm.', function: 'Seminal fluid production (fructose).', disorders: 'Infection, Blockage.', tests: 'Semen Analysis (Fructose test).' },
    { name: 'Prostate', desc: 'A walnut-sized gland that produces prostatic fluid, adding enzymes and zinc to the semen.', function: 'Fluid production, sperm protection.', disorders: 'Prostatitis, BPH.', tests: 'Digital Rectal Exam (DRE), PSA.' },
  ];

  // State for Expandable Testing Cards
  const [activeTest, setActiveTest] = useState<number | null>(null);
  const tests = [
    { name: 'Semen Analysis', purpose: 'To evaluate sperm quantity, quality, and motility.', prep: '2-5 days of sexual abstinence.', procedure: 'Masturbation into a sterile container at the clinic.', normal: '>15 million/mL count, >40% motility.', abnormal: 'Oligozoospermia, Asthenozoospermia.', time: '1-2 hours for processing.', doctor: 'First-line diagnostic test.' },
    { name: 'DNA Fragmentation', purpose: 'To assess the integrity of the genetic material within the sperm.', prep: 'Similar to semen analysis.', procedure: 'Specialized lab analysis (SCD, TUNEL).', normal: '<15% fragmentation.', abnormal: '>30% indicates poor fertility potential.', time: '3-5 days.', doctor: 'Recurrent pregnancy loss or IVF failure.' },
    { name: 'Hormone Panel', purpose: 'To check endocrine function supporting sperm production.', prep: 'Morning blood draw preferred.', procedure: 'Venous blood collection.', normal: 'Varies by hormone (FSH, LH, Testosterone).', abnormal: 'Hypogonadism, Hyperprolactinemia.', time: '1-2 days.', doctor: 'Low sperm count or sexual dysfunction.' },
    { name: 'Genetic Testing', purpose: 'To identify chromosomal abnormalities affecting fertility.', prep: 'None required.', procedure: 'Blood draw for Karyotyping / Y-Microdeletion.', normal: '46,XY karyotype.', abnormal: 'Klinefelter syndrome, Microdeletions.', time: '2-3 weeks.', doctor: 'Severe oligozoospermia or azoospermia.' }
  ];

  // State for FAQs
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const faqs = [
    { q: "How long does it take for sperm to mature?", a: "The entire process of sperm production and maturation (spermatogenesis) takes approximately 72 to 74 days. This is why lifestyle changes or medical treatments take about 2 to 3 months to show improvements in a semen analysis." },
    { q: "Does age affect male fertility?", a: "Yes. While men continue to produce sperm throughout their lives, semen parameters (especially motility and morphology) and DNA integrity decline gradually after age 40, which can increase the time to conception and the risk of genetic issues." },
    { q: "Is a low sperm count a permanent condition?", a: "Not necessarily. Low sperm count can be caused by reversible factors such as infections, hormonal imbalances, varicoceles, or lifestyle habits. A thorough medical evaluation is required to determine the cause and potential treatments." },
    { q: "What is the difference between IVF and ICSI?", a: "In standard IVF, sperm and eggs are mixed in a dish to allow natural fertilization. In ICSI (Intracytoplasmic Sperm Injection), a single, healthy sperm is meticulously selected and directly injected into the egg. ICSI is highly recommended for severe male factor infertility." }
  ];

  // Lifestyle Checklist
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const toggleCheck = (idx: number) => {
    if (checkedItems.includes(idx)) setCheckedItems(checkedItems.filter(i => i !== idx));
    else setCheckedItems([...checkedItems, idx]);
  };
  const checklist = [
    { title: "Maintain a Healthy Diet", desc: "Focus on antioxidants, fruits, vegetables, and lean proteins." },
    { title: "Regular Exercise", desc: "Engage in moderate physical activity to boost testosterone." },
    { title: "Weight Management", desc: "Maintain a healthy BMI to prevent hormonal imbalances." },
    { title: "Stress Reduction", desc: "Practice mindfulness and relaxation to lower cortisol levels." },
    { title: "Adequate Sleep", desc: "Aim for 7-8 hours of quality sleep per night." },
    { title: "Quit Smoking", desc: "Eliminate tobacco to protect sperm DNA integrity." },
    { title: "Limit Alcohol", desc: "Reduce alcohol consumption to support healthy hormone levels." },
    { title: "Avoid Excessive Heat", desc: "Avoid frequent saunas, hot tubs, and tight-fitting underwear." }
  ];

  return (
    <div className="w-full bg-slate-50 min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-slate-900 text-white">
        {/* Animated Background Elements */}
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

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-900/50 border border-blue-800 text-blue-300 text-sm font-semibold tracking-wide mb-6 backdrop-blur-md">
                <Microscope className="w-4 h-4" /> Comprehensive Medical Resource
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight">
                Male Fertility <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Centre</span>
              </h1>
              <p className="text-xl text-blue-100/80 mb-10 leading-relaxed max-w-2xl">
                Helping men understand fertility through awareness, advanced diagnosis, and cutting-edge reproductive science. Empowering you with knowledge for a successful journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => anatomyRef.current?.scrollIntoView({ behavior: 'smooth' })} className="cursor-pointer bg-white text-slate-900 px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 shadow-xl shadow-white/10">
                  Explore Anatomy <ArrowRight className="w-5 h-5" />
                </button>
                <Link to="/hospital-partnership" className="bg-blue-600/30 hover:bg-blue-600/50 backdrop-blur-md text-white border border-blue-500/50 px-8 py-4 rounded-full text-lg font-bold transition-colors flex items-center justify-center gap-2">
                  <Building2 className="w-5 h-5" /> Hospital Partnership
                </Link>
              </div>
            </motion.div>
          </div>
          
          <div className="flex-1 hidden lg:flex justify-center relative">
             {/* Abstract Hero Illustration */}
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="relative w-full aspect-square max-w-[500px]"
             >
               <div className="absolute inset-0 rounded-full border border-white/10 opacity-20"></div>
               <div className="absolute inset-10 rounded-full border border-dashed border-teal-500/30 opacity-20"></div>
               <div className="absolute inset-20 rounded-full bg-gradient-to-br from-blue-900/50 to-teal-900/50 backdrop-blur-3xl border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden">
                  <Dna className="w-32 h-32 text-teal-400 opacity-80" />
               </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Statistics Section */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100">
            {[
              { value: "15%", label: "Couples affected by infertility globally" },
              { value: "40%", label: "Cases involving a male factor contribution" },
              { value: "Millions", label: "Healthy sperm produced daily" },
              { value: "99.9%", label: "Accuracy of advanced laboratory screening" }
            ].map((stat, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }} className="px-4">
                <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2">{stat.value}</h3>
                <p className="text-sm font-medium text-slate-500 leading-snug max-w-[180px] mx-auto">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Interactive Human Anatomy */}
      <section ref={anatomyRef} className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Interactive Reproductive Anatomy</h2>
            <p className="text-lg text-slate-600">Explore the male reproductive system to understand where sperm is produced, matured, and stored.</p>
          </motion.div>

          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-200">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-2 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                {anatomyParts.map((part, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveAnatomy(i)}
                    className={`cursor-pointer w-full text-left px-6 py-4 rounded-xl font-medium transition-all duration-300 ${activeAnatomy === i ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{part.name}</span>
                      <ChevronDown className={`w-5 h-5 transition-transform ${activeAnatomy === i ? '-rotate-90' : 'opacity-0'}`} />
                    </div>
                  </button>
                ))}
              </div>
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeAnatomy}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-blue-50/50 p-8 md:p-10 rounded-2xl border border-blue-100 h-full"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600">
                        <Activity className="w-8 h-8" />
                      </div>
                      <h3 className="text-3xl font-bold text-slate-900">{anatomyParts[activeAnatomy].name}</h3>
                    </div>
                    <p className="text-slate-700 text-lg mb-8 leading-relaxed">{anatomyParts[activeAnatomy].desc}</p>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                        <strong className="text-slate-900 block mb-2 font-bold text-sm uppercase tracking-wider">Primary Function</strong>
                        <span className="text-slate-600 text-sm leading-relaxed">{anatomyParts[activeAnatomy].function}</span>
                      </div>
                      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                        <strong className="text-slate-900 block mb-2 font-bold text-sm uppercase tracking-wider">Possible Disorders</strong>
                        <span className="text-slate-600 text-sm leading-relaxed">{anatomyParts[activeAnatomy].disorders}</span>
                      </div>
                      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                        <strong className="text-slate-900 block mb-2 font-bold text-sm uppercase tracking-wider">Related Diagnostics</strong>
                        <span className="text-slate-600 text-sm leading-relaxed">{anatomyParts[activeAnatomy].tests}</span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Animated Sperm Journey & Timeline */}
      <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-50 rounded-full blur-[100px] -z-10"></div>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">The Clinical Journey</h2>
            <p className="text-lg text-slate-600">A comprehensive pathway from initial consultation to successful treatment planning.</p>
          </motion.div>

          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut" as any }}
                className="h-full bg-gradient-to-r from-blue-400 to-teal-400"
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4 relative z-10">
              {[
                { icon: Stethoscope, label: "Consultation" },
                { icon: Microscope, label: "Semen Analysis" },
                { icon: Syringe, label: "Blood Panel" },
                { icon: Dna, label: "Genetic Tests" },
                { icon: Target, label: "Treatment Plan" }
              ].map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white border-4 border-slate-50 shadow-xl rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 group-hover:border-blue-100 transition-all duration-300 relative">
                     <step.icon className="w-8 h-8" />
                     {/* Micro-animation pulse */}
                     <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping opacity-0 group-hover:opacity-100"></div>
                  </div>
                  <h4 className="font-bold text-slate-900">{step.label}</h4>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Semen Analysis Dashboard (Visual) */}
      <section className="py-16 lg:py-24 bg-slate-900 text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Understanding Semen Analysis</h2>
            <p className="text-lg text-slate-400">The cornerstone of male fertility testing. Here is what we look for in a healthy sample based on WHO guidelines.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Volume", target: "> 1.5 mL", value: 75, color: "text-blue-400", bg: "stroke-blue-500", desc: "Total fluid amount." },
              { label: "Concentration", target: "> 15 M/mL", value: 85, color: "text-teal-400", bg: "stroke-teal-500", desc: "Sperm density." },
              { label: "Motility", target: "> 40%", value: 60, color: "text-purple-400", bg: "stroke-purple-500", desc: "Moving sperm." },
              { label: "Morphology", target: "> 4%", value: 90, color: "text-amber-400", bg: "stroke-amber-500", desc: "Normal shape." }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-md p-6 rounded-3xl border border-slate-700 hover:bg-slate-800 transition-colors flex flex-col items-center text-center"
              >
                <div className="relative w-32 h-32 mb-6">
                  {/* SVG Circular Progress */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" className="stroke-slate-700" strokeWidth="8" fill="none" />
                    <motion.circle 
                      cx="50" cy="50" r="40" 
                      className={stat.bg} 
                      strokeWidth="8" fill="none" strokeLinecap="round"
                      initial={{ strokeDasharray: "0 251.2" }}
                      whileInView={{ strokeDasharray: `${(stat.value / 100) * 251.2} 251.2` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut" as any, delay: i * 0.2 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-xl font-bold ${stat.color}`}>{stat.target}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{stat.label}</h3>
                <p className="text-slate-400 text-sm">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Male Fertility Testing (Expandable Cards) */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Diagnostic Testing</h2>
            <p className="text-lg text-slate-600">Advanced medical evaluations to pinpoint the exact cause of infertility.</p>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-4">
              {tests.map((test, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTest(activeTest === i ? null : i)}
                  className={`cursor-pointer w-full flex items-center justify-between p-6 rounded-2xl border text-left transition-all duration-300 ${activeTest === i ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white border-slate-200 text-slate-900 hover:border-blue-300'}`}
                >
                  <span className="text-lg font-bold">{test.name}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${activeTest === i ? 'rotate-180 text-white' : 'text-slate-400'}`} />
                </button>
              ))}
            </div>

            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {activeTest !== null ? (
                  <motion.div
                    key={activeTest}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-slate-200 h-full"
                  >
                    <div className="flex items-start gap-6 mb-8 pb-8 border-b border-slate-100">
                      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                        <Activity className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">{tests[activeTest].name}</h3>
                        <p className="text-slate-600 leading-relaxed">{tests[activeTest].purpose}</p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                      <div>
                        <strong className="flex items-center gap-2 text-slate-900 mb-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Normal Results</strong>
                        <p className="text-slate-600 text-sm">{tests[activeTest].normal}</p>
                      </div>
                      <div>
                        <strong className="flex items-center gap-2 text-slate-900 mb-2"><ShieldAlert className="w-4 h-4 text-amber-500" /> Abnormal Indicators</strong>
                        <p className="text-slate-600 text-sm">{tests[activeTest].abnormal}</p>
                      </div>
                      <div>
                        <strong className="flex items-center gap-2 text-slate-900 mb-2"><FileText className="w-4 h-4 text-blue-500" /> Preparation</strong>
                        <p className="text-slate-600 text-sm">{tests[activeTest].prep}</p>
                      </div>
                      <div>
                        <strong className="flex items-center gap-2 text-slate-900 mb-2"><Stethoscope className="w-4 h-4 text-indigo-500" /> Recommendation</strong>
                        <p className="text-slate-600 text-sm">{tests[activeTest].doctor}</p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full bg-white/50 border border-slate-200 border-dashed rounded-3xl flex flex-col items-center justify-center text-slate-400 p-12 min-h-[400px]">
                    <Microscope className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-lg">Select a diagnostic test to view details</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Lifestyle Improvement Checklist */}
      <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Lifestyle & Fertility</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Sperm health is directly linked to your overall health and lifestyle choices. Since it takes about 74 days for new sperm to mature, positive lifestyle changes today will improve your fertility potential in 2.5 months.
              </p>
            </motion.div>
            
            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-[2rem] p-8 lg:p-12 shadow-xl border border-slate-100 mb-12">
                <div className="flex flex-col md:flex-row items-center gap-8 mb-10 pb-10 border-b border-slate-100">
                  <div className="w-32 h-32 relative shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" className="stroke-slate-100" strokeWidth="8" fill="none" />
                      <circle 
                        cx="50" cy="50" r="40" 
                        className="stroke-green-500 transition-all duration-1000 ease-out" 
                        strokeWidth="8" fill="none" strokeLinecap="round"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - ((checkedItems.length / checklist.length) * 251.2)}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-slate-900">
                      {Math.round((checkedItems.length / checklist.length) * 100)}%
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Fertility Habits Score</h3>
                    <p className="text-slate-500 text-lg mb-6">Check the habits you currently maintain to see your score.</p>
                    <button className="bg-blue-600 text-white px-8 py-3.5 rounded-full font-bold hover:bg-blue-700 transition-colors inline-flex items-center gap-2 shadow-lg shadow-blue-600/20">
                      <Download className="w-5 h-5" /> Download Complete Nutrition Guide
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {checklist.map((item, i) => (
                    <button 
                      key={i}
                      onClick={() => toggleCheck(i)}
                      className={`cursor-pointer flex items-start gap-4 p-5 rounded-2xl border text-left transition-all duration-300 ${checkedItems.includes(i) ? 'bg-green-50/50 border-green-200 shadow-sm' : 'bg-slate-50/50 border-slate-200 hover:border-blue-200 hover:bg-blue-50/30'}`}
                    >
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${checkedItems.includes(i) ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 text-transparent bg-white'}`}>
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <strong className={`block mb-1 text-lg ${checkedItems.includes(i) ? 'text-green-900' : 'text-slate-900'}`}>{item.title}</strong>
                        <span className={`text-sm leading-relaxed ${checkedItems.includes(i) ? 'text-green-700' : 'text-slate-500'}`}>{item.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* 8. FAQs */}
      <section className="py-16 lg:py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-600">Expert answers to common queries regarding male fertility.</p>
          </motion.div>

          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1 space-y-4 w-full">
              {faqs.slice(0, Math.ceil(faqs.length / 2)).map((faq, i) => {
                const actualIdx = i;
                return (
                  <motion.div 
                    key={actualIdx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:border-blue-200 transition-colors"
                  >
                    <button 
                      onClick={() => setOpenFaq(openFaq === actualIdx ? null : actualIdx)}
                      className="cursor-pointer w-full flex items-center justify-between p-6 text-left"
                    >
                      <span className="text-lg font-bold text-slate-900">{faq.q}</span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ml-4 ${openFaq === actualIdx ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        {openFaq === actualIdx ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </div>
                    </button>
                    <AnimatePresence>
                      {openFaq === actualIdx && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-6 pb-6 text-slate-600 leading-relaxed"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
            
            <div className="flex-1 space-y-4 w-full">
              {faqs.slice(Math.ceil(faqs.length / 2)).map((faq, i) => {
                const actualIdx = i + Math.ceil(faqs.length / 2);
                return (
                  <motion.div 
                    key={actualIdx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:border-blue-200 transition-colors"
                  >
                    <button 
                      onClick={() => setOpenFaq(openFaq === actualIdx ? null : actualIdx)}
                      className="cursor-pointer w-full flex items-center justify-between p-6 text-left"
                    >
                      <span className="text-lg font-bold text-slate-900">{faq.q}</span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ml-4 ${openFaq === actualIdx ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        {openFaq === actualIdx ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </div>
                    </button>
                    <AnimatePresence>
                      {openFaq === actualIdx && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-6 pb-6 text-slate-600 leading-relaxed"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 9. CTA */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px]"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Need Professional Guidance?</h2>
              <p className="text-xl text-blue-100 mb-10 leading-relaxed">
                Connect with Genes India. Whether you are a patient seeking consultation or an IVF hospital looking to partner for premium donor gametes, our experts are ready to assist.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/contact" className="bg-white text-blue-900 px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                  Contact Genes India
                </Link>
                <a href="tel:+919893312881" className="bg-blue-800/50 backdrop-blur-md text-white border border-blue-700 px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-800 transition-colors flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" /> Call Now
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
