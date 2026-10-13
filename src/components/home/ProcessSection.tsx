
import { motion } from 'motion/react';
import { Building2, ShieldCheck, CheckCircle2, Stethoscope, Activity, TestTube2 } from 'lucide-react';

export function ProcessSection() {
  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  };

  return (
    <section className="py-16 lg:py-20 bg-white" id="process">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works for Hospitals</h2>
          <p className="text-lg text-slate-600">A seamless, compliant process designed for IVF clinics to source premium donor gametes.</p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-slate-200"></div>
          
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-8">
            {[
              { title: "Hospital Enquiry", icon: Building2 },
              { title: "Verification", icon: ShieldCheck },
              { title: "Hospital Approval", icon: CheckCircle2 },
              { title: "Portal Access", icon: Stethoscope },
              { title: "Search Database", icon: Activity },
              { title: "Reserve Sample", icon: TestTube2 },
            ].map((step, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center mb-6 text-blue-600 relative">
                  <step.icon className="w-8 h-8" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold border-4 border-slate-50">
                    {idx + 1}
                  </div>
                </div>
                <h3 className="font-bold text-slate-900">{step.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
