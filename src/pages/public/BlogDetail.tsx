import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, User, ArrowLeft, Loader2, BookOpen } from 'lucide-react';
import api from '../../lib/api';

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error('Failed to load blog detail', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm text-slate-500 font-medium">Loading article...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
          <BookOpen className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Article Not Found</h2>
        <p className="text-sm text-slate-500 max-w-sm mb-6">
          The requested article may have been moved or is no longer available.
        </p>
        <Link 
          to="/blogs" 
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Articles
        </Link>
      </div>
    );
  }

  const dateDisplay = blog.date || (blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '');
  const authorDisplay = blog.author || 'Clinical Editorial Team';

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-24">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {/* Back Link */}
        <Link 
          to="/blogs" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Articles
        </Link>

        {/* 1. Title at the Top */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6"
        >
          {blog.title}
        </motion.h1>

        {/* 2. Image right after Title */}
        {blog.image && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="w-full h-[320px] sm:h-[420px] md:h-[500px] rounded-3xl overflow-hidden mb-6 shadow-sm border border-slate-200 bg-slate-100"
          >
            <img 
              src={blog.image} 
              alt={blog.title} 
              className="w-full h-full object-cover" 
            />
          </motion.div>
        )}

        {/* 3. Dates and Author */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600 mb-6 pb-6 border-b border-slate-200"
        >
          {dateDisplay && (
            <span className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-xs">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>{dateDisplay}</span>
            </span>
          )}
          <span className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            <User className="w-4 h-4 text-blue-600" />
            <span>{authorDisplay}</span>
          </span>
          {blog.category && (
            <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">
              {blog.category}
            </span>
          )}
        </motion.div>

        {/* 4. Description / Summary */}
        {blog.summary && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 sm:p-6 bg-blue-50/70 border-l-4 border-blue-600 rounded-r-2xl mb-8"
          >
            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1.5">Executive Summary</h4>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              {blog.summary}
            </p>
          </motion.div>
        )}

        {/* 5. Main Body Content */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="prose prose-lg prose-slate prose-blue max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:leading-relaxed prose-a:text-blue-600 prose-img:rounded-2xl bg-white p-6 sm:p-10 md:p-12 rounded-3xl shadow-xs border border-slate-200"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </div>
  );
}
