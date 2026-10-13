import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Target, Lightbulb, Heart, ShieldCheck } from 'lucide-react';
import api from '../../lib/api';

export default function About() {
  const [aboutImage, setAboutImage] = useState('');

  useEffect(() => {
    api.get('/settings').then(res => {
      if (res.data?.aboutImageUrl) setAboutImage(res.data.aboutImageUrl);
    }).catch(console.error);
  }, []);

  return (
    <div className="w-full bg-white">
      {/* Intro Section */}
      <section className="pt-32 pb-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 w-full"
            >
              <div className="aspect-[4/3] bg-slate-100 rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 relative">
                {aboutImage ? (
                  <img src={aboutImage} alt="About Us" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium text-lg">
                    [Facility / Team Photograph]
                  </div>
                )}
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">Who We Are</h2>
              <div className="prose prose-lg prose-blue text-slate-600">
                <p className="mb-6 leading-relaxed">
                  Genes India – The ART BANK was established with a clear mandate: to elevate the standards of third-party reproduction and male fertility services in India. We operate exclusively as a B2B partner to certified IVF hospitals, providing them with a reliable, ethically sourced, and scientifically rigorously screened supply of donor gametes.
                </p>
                <p className="leading-relaxed">
                  We understand that the foundation of a successful IVF cycle utilizing donor gametes relies entirely on the quality and integrity of the sample. To ensure absolute transparency and prevent fraud, <strong>we do not conduct online donor registrations</strong>. Every single donor at Genes India undergoes a strict, offline onboarding process involving in-person counseling, identity verification, comprehensive medical evaluation, genetic screening, and legal consent at our facility.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision, Mission, Core Values */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-100"
            >
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
              <p className="text-slate-600 leading-relaxed">
                To provide certified IVF centers with the highest quality, genetically screened, and ethically sourced donor gametes, empowering them to deliver successful fertility treatments.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-blue-600 p-10 rounded-[2rem] shadow-xl text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
              <div className="w-16 h-16 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-8 relative z-10">
                <Lightbulb className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 relative z-10">Our Vision</h3>
              <p className="text-blue-100 leading-relaxed relative z-10">
                To be India's most trusted and technologically advanced ART Bank, setting global benchmarks in donor screening, cryogenic preservation, and ethical healthcare practices.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-100"
            >
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Core Values</h3>
              <ul className="space-y-4 text-slate-600">
                <li className="flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-blue-600" /> Uncompromising Ethics</li>
                <li className="flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-blue-600" /> Scientific Rigor</li>
                <li className="flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-blue-600" /> Absolute Transparency</li>
                <li className="flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-blue-600" /> Regulatory Compliance</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
