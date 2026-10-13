
import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export function FaqsSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  };

  const faqs = [
    {
      q: "Can individuals buy donor sperm directly from Genes India?",
      a: "No. In strict compliance with ICMR guidelines, we operate as a B2B ART Bank. We supply donor gametes exclusively to registered and certified IVF hospitals and fertility clinics. Patients must go through their treating physician to request a sample from us."
    },
    {
      q: "Can a donor register online?",
      a: "No. We have a strict offline-only donor registration policy. This ensures absolute identity verification, comprehensive medical and psychological evaluation, and adherence to legal consent protocols that cannot be verified digitally."
    },
    {
      q: "What screening tests are performed on donors?",
      a: "Our screening exceeds basic regulatory requirements. It includes a full physical examination, extensive semen analysis (including DNA Fragmentation Index), infectious disease screening (HIV, Hepatitis B & C, VDRL, CMV), complete karyotyping, and extended carrier screening for genetic mutations."
    },
    {
      q: "How does the hospital partnership portal work?",
      a: "Once a hospital is verified and signs our B2B agreement, they receive access to our secure portal. Clinicians can search our completely anonymized database, match phenotypical traits (height, blood group, eye color) to their patients, and place secure requests for sample delivery."
    },
    {
      q: "Are the donor details shared with the patients?",
      a: "No. In accordance with the ART (Regulation) Act, all donor identities are kept strictly confidential. Partner clinics are provided only with non-identifying phenotypical characteristics (like height, weight, skin color, education) and medical screening clearances."
    },
    {
      q: "How are donor samples transported to partner clinics?",
      a: "We use strictly monitored, temperature-controlled dry shippers. Each shipment is accompanied by a data logger to ensure the cold chain (-196°C) is maintained from our bank to your lab without any temperature fluctuations."
    },
    {
      q: "How long can donor gametes be cryopreserved?",
      a: "With our advanced vitrification and slow-freezing protocols stored in liquid nitrogen (-196°C), gametes can be preserved indefinitely without losing viability. We routinely test sample viability post-thaw to ensure optimal quality."
    }
  ];

  const mid = Math.ceil(faqs.length / 2);
  const leftFaqs = faqs.slice(0, mid);
  const rightFaqs = faqs.slice(mid);

  return (
    <section className="py-16 lg:py-20 bg-slate-50" id="faqs">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-slate-600">Clear answers about our processes, compliance, and B2B partnership model.</p>
        </motion.div>
        
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1 space-y-6 w-full">
            {leftFaqs.map((faq, i) => {
              const actualIdx = i;
              return (
                <motion.div 
                  key={actualIdx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
                >
                  <button 
                    onClick={() => setOpenIdx(openIdx === actualIdx ? null : actualIdx)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-lg font-bold text-slate-900">{faq.q}</span>
                    <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform shrink-0 ml-4", openIdx === actualIdx ? "rotate-180" : "")} />
                  </button>
                  {openIdx === actualIdx && (
                    <div className="p-6 pt-0 text-slate-600 leading-relaxed bg-white">
                      {faq.a}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
          
          <div className="flex-1 space-y-6 w-full">
            {rightFaqs.map((faq, i) => {
              const actualIdx = i + mid;
              return (
                <motion.div 
                  key={actualIdx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
                >
                  <button 
                    onClick={() => setOpenIdx(openIdx === actualIdx ? null : actualIdx)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-lg font-bold text-slate-900">{faq.q}</span>
                    <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform shrink-0 ml-4", openIdx === actualIdx ? "rotate-180" : "")} />
                  </button>
                  {openIdx === actualIdx && (
                    <div className="p-6 pt-0 text-slate-600 leading-relaxed bg-white">
                      {faq.a}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
