import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';

export function HeroBanner() {
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    api.get('/settings').then(res => {
      if (res.data?.homeVideoUrl) setVideoUrl(res.data.homeVideoUrl);
    }).catch(console.error);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center" id="home">
      {/* Background Video */}
      {videoUrl ? (
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-slate-900">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover opacity-50"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
          {/* Overlay gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
        </div>
      ) : (
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-slate-50">
          <div className="absolute -top-[10%] -right-[5%] w-[50%] h-[70%] rounded-full bg-blue-100/50 blur-[120px]"></div>
          <div className="absolute top-[20%] -left-[10%] w-[40%] h-[60%] rounded-full bg-indigo-100/40 blur-[100px]"></div>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 flex flex-col lg:flex-row items-center gap-12 w-full">
        <div className="max-w-3xl flex-1">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold tracking-wide mb-8 ${videoUrl ? 'bg-white/10 border-white/20 text-blue-300' : 'bg-blue-50 border-blue-100 text-blue-700'}`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Ethical ART Services & Sperm Banking</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-8 leading-[1.1] ${videoUrl ? 'text-white' : 'text-slate-900'}`}
          >
            <span className={`block ${videoUrl ? 'text-slate-100' : 'text-slate-800'}`}>Excellence in</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 block mt-2">Male Fertility & ART Banking.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`text-2xl max-w-2xl mb-10 leading-relaxed font-medium ${videoUrl ? 'text-slate-300' : 'text-slate-600'}`}
          >
            Genes India is one of the most equipped ART banks of central INDIA, fulfilling all norms of the national ART registry with ethically sourced donor gametes.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/hospital-partnership" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group">
              Partner With Us 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/contact" className={`px-8 py-4 rounded-full text-lg font-semibold transition-all border flex items-center justify-center gap-2 ${videoUrl ? 'bg-white/10 hover:bg-white/20 text-white border-white/20' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'}`}>
              Contact Us
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
