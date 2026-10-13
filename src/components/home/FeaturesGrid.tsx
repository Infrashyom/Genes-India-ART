
import { motion } from 'motion/react';
import { ShieldCheck, Stethoscope, Microscope, ClipboardCheck } from 'lucide-react';

export function FeaturesGrid() {
  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { staggerChildren: 0.1 }
  };

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  };

  const features = [
    {
      title: "ICMR & ART Act Compliant",
      description: "Strict adherence to all regulatory frameworks, ensuring complete legal and ethical compliance for partner hospitals.",
      icon: ShieldCheck
    },
    {
      title: "Advanced Donor Screening",
      description: "Comprehensive medical, genetic, and psychological screening exceeding standard industry protocols.",
      icon: Microscope
    },
    {
      title: "B2B Digital Portal",
      description: "Secure, real-time access to our anonymized donor database for authorized IVF clinicians.",
      icon: Stethoscope
    },
    {
      title: "Quality Assurance",
      description: "State-of-the-art cryopreservation and strict quality control protocols for optimal sample viability.",
      icon: ClipboardCheck
    }
  ];

  return (
    <section className="py-16 bg-white relative -mt-16 z-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              variants={fadeUp}
              className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
