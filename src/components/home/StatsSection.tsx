
import { motion } from 'motion/react';

export function StatsSection() {
  return (
    <section className="py-16 lg:py-20 bg-blue-600 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-700/20"></div>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {[
            { label: "Associated Centers", value: "70+" },
            { label: "Donors Screened", value: "5000+" },
            { label: "Years Experience", value: "7+" },
            { label: "ART Professionals Exp.", value: "30+ Yrs" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-4xl md:text-5xl font-extrabold mb-2">{stat.value}</div>
              <div className="text-blue-100 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
