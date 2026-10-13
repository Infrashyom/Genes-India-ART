import { motion } from 'motion/react';
import { Microscope, Activity, ShieldCheck, HeartHandshake, UserPlus, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ServicesSection() {
  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { staggerChildren: 0.1 }
  };

  return (
    <section className="py-16 lg:py-20 bg-slate-50" id="services">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Core Services</h2>
          <p className="text-lg text-slate-600">Genes India is one of the most equipped ART banks of central INDIA fulfilling all norms of national ART registry.</p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {[
            {
              title: "Donor Sperm Sample",
              desc: "Carefully selected and investigated donors. Evaluated by CASA system, double layer density gradient preparation, uniquely ID'd with color-coded vials.",
              icon: ShieldCheck,
              link: "/services"
            },
            {
              title: "Oocyte Donor",
              desc: "Donors evaluated for AFC, registered after complete documentation. Exhaustive genetic and infectious disease screening panels.",
              icon: UserPlus,
              link: "/services"
            }
          ].map((service, i) => (
            <motion.div key={i} variants={fadeUp} className="bg-white rounded-3xl p-8 border border-slate-200 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all group">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-colors mb-8">
                <service.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{service.title}</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">{service.desc}</p>
              <Link to={service.link} className="text-blue-600 font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                Learn more <HeartHandshake className="w-5 h-5" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
