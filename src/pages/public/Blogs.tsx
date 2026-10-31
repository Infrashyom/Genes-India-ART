import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight, BookOpen, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';

export default function Blogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await api.get('/blogs?limit=50');
        const list = res.data?.data || res.data || [];
        setBlogs(list);
      } catch (err) {
        console.error('Failed to load published blogs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <section className="bg-white py-20 border-b border-slate-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-4">
            Clinical Insights & Education
          </span>
          <motion.h1 {...fadeUp} className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Articles & Updates
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
          >
            Insights on reproductive genetics, male fertility diagnostics, and regulatory ART bank operations.
          </motion.p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-sm font-medium">Loading published articles...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="max-w-xl mx-auto text-center py-20 px-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">No Articles Published Yet</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
                Clinical research publications, educational articles, and guidelines published from the administrative portal will appear here.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, i) => {
                const dateDisplay = blog.date || (blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '');
                const authorDisplay = blog.author || 'Clinical Editorial Team';
                const summaryDisplay = blog.summary || (blog.content ? blog.content.replace(/<[^>]+>/g, '').slice(0, 140) + '...' : '');

                return (
                  <motion.article 
                    key={blog._id || i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-3xl overflow-hidden shadow-xs border border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all group flex flex-col"
                  >
                    <div className="w-full aspect-[16/9] bg-slate-100 relative overflow-hidden flex items-center justify-center">
                      {blog.image ? (
                        <img 
                          src={blog.image} 
                          alt={blog.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 gap-2 p-6 text-center">
                          <BookOpen className="w-8 h-8 text-blue-400" />
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Clinical Article</span>
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-700 uppercase tracking-wider shadow-xs border border-blue-100">
                        {blog.category || 'Clinical Article'}
                      </div>
                    </div>

                    <div className="p-7 flex flex-col flex-1">
                      <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-3">
                        {dateDisplay && (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-blue-500" /> {dateDisplay}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-blue-500" /> {authorDisplay}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {blog.title}
                      </h3>

                      {summaryDisplay && (
                        <p className="text-sm text-slate-600 mb-6 flex-1 line-clamp-3 leading-relaxed">
                          {summaryDisplay}
                        </p>
                      )}

                      <Link 
                        to={`/blogs/${blog.slug || blog._id}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 group/btn mt-auto pt-2"
                      >
                        Read Article <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}