import { motion } from 'motion/react';
import { Calendar, User, ArrowRight } from 'lucide-react';

export default function Blogs() {
  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const blogs = [
    {
      title: "Understanding DNA Fragmentation in Sperm",
      category: "Male Fertility",
      date: "Oct 15, 2024",
      author: "Medical Team",
      desc: "An in-depth look at what DFI means for IVF success rates and how lifestyle choices impact sperm DNA integrity.",
      image: "bg-blue-100"
    },
    {
      title: "The Importance of Extended Carrier Screening",
      category: "Genetics",
      date: "Sep 28, 2024",
      author: "Genetics Dept",
      desc: "Why testing for over 100 recessive genetic mutations is becoming the gold standard in third-party reproduction.",
      image: "bg-indigo-100"
    },
    {
      title: "Navigating ICMR Guidelines for ART Clinics",
      category: "Compliance",
      date: "Sep 10, 2024",
      author: "Legal Team",
      desc: "A comprehensive summary of the latest regulatory requirements for sourcing and utilizing donor gametes in India.",
      image: "bg-slate-200"
    }
  ];

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <section className="bg-white py-20 border-b border-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 {...fadeUp} className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Insights & Education</motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
          >
            Latest articles on male fertility, reproductive genetics, and advancements in cryogenic preservation.
          </motion.p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, i) => (
              <motion.article 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all group flex flex-col"
              >
                <div className={`w-full aspect-[16/9] ${blog.image} relative overflow-hidden flex items-center justify-center`}>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-700 uppercase tracking-wider">
                    {blog.category}
                  </div>
                  <span className="text-slate-400 font-medium">Article Illustration</span>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {blog.date}</span>
                    <span className="flex items-center gap-1"><User className="w-4 h-4" /> {blog.author}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{blog.title}</h3>
                  <p className="text-slate-600 mb-6 flex-1">{blog.desc}</p>
                  <button className="text-blue-600 font-semibold flex items-center gap-2 group/btn mt-auto">
                    Read Article <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}