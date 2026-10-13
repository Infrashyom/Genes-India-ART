import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Award, BookOpen, Clock } from 'lucide-react';
import api from '../../lib/api';

export default function Founder() {
  const [founders, setFounders] = useState<any[]>([]);

  useEffect(() => {
    api.get('/founders').then(res => setFounders(res.data)).catch(console.error);
  }, []);

  return (
    <div className="w-full bg-slate-50 min-h-screen pt-32 pb-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Our Promoters</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Genes India is a professionally managed ART bank run by experienced ART professionals having experience of more than 30 years in the field of Assisted Reproduction.
          </p>
        </motion.div>

        {founders.length === 0 ? (
          <div className="text-center text-slate-500 py-10">Loading profiles...</div>
        ) : (
          <div className="space-y-24">
            {founders.map((founder, index) => (
              <div key={founder._id} className={`flex flex-col ${index % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-20 items-start`}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="w-full lg:w-1/3"
                >
                  <div className="aspect-[4/5] max-w-sm mx-auto bg-white rounded-3xl overflow-hidden relative shadow-2xl border border-slate-100">
                    {founder.image ? (
                      <img src={founder.image} alt={founder.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-slate-200 flex items-center justify-center text-slate-400 font-medium text-sm">
                        [No Photograph]
                      </div>
                    )}
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 -mt-8 relative z-10 mx-6 sm:mx-12 lg:mx-4 text-center">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{founder.name}</h3>
                    <p className="text-blue-600 font-medium text-sm mb-4">{founder.title}</p>
                    
                    <div className="space-y-2 text-sm text-left pl-2">
                      {founder.qualifications && (
                        <div className="flex items-center gap-3 text-slate-600">
                          <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>{founder.qualifications}</span>
                        </div>
                      )}
                      {founder.experience && (
                        <div className="flex items-center gap-3 text-slate-600">
                          <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>{founder.experience}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-full lg:w-2/3 prose prose-lg prose-blue text-slate-600"
                >
                  <div className="whitespace-pre-line">{founder.description}</div>
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
