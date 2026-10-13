import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Quote, Star } from 'lucide-react';
import api from '../../lib/api';

export function SuccessStories() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    api.get('/reviews').then(res => setReviews(res.data.data || res.data)).catch(console.error);
  }, []);

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  };

  if (reviews.length === 0) return null;

  return (
    <section className="py-16 lg:py-20 bg-white" id="success-stories">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Success Stories</h2>
          <p className="text-lg text-slate-600">Hear directly from the families and partners we have had the privilege to help.</p>
        </motion.div>
        
        <div className="relative w-full overflow-hidden flex -mx-4 px-4 sm:mx-0 sm:px-0 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex gap-8 whitespace-nowrap w-max py-4 animate-marquee hover:[animation-play-state:paused]">
            {[...reviews, ...reviews, ...reviews, ...reviews, ...reviews].map((review, idx) => (
              <div 
                key={`${review._id}-${idx}`}
                className="bg-slate-50 p-8 rounded-3xl border border-slate-100 relative flex flex-col hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 group whitespace-normal w-[350px] shrink-0"
              >
                <div className="absolute top-6 right-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote className="w-12 h-12 text-blue-600" />
                </div>
                
                <div className="flex gap-1 mb-6">
                  {[...Array(review.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-slate-700 leading-relaxed mb-8 flex-1 relative z-10 italic line-clamp-6">
                  "{review.reviewText}"
                </p>

                <div className="mt-auto">
                  <h4 className="font-bold text-slate-900 truncate max-w-[300px]">- {review.patientName}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
