import { FaqsSection } from '../../components/home/FaqsSection';
import { motion } from 'motion/react';

export default function FaqsPage() {
  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <section className="bg-white pt-32 pb-20 border-b border-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 {...fadeUp} className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Frequently Asked Questions</motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
          >
            Find answers to common queries about our processes, compliance, and partnership model.
          </motion.p>
        </div>
      </section>

      <div className="-mt-16">
        <FaqsSection />
      </div>
    </div>
  );
}
