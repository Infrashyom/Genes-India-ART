import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import api from '../../lib/api';

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/blogs`);
        const found = (response.data.data || response.data).find((b: any) => b._id === id);
        if (found) {
          setBlog(found);
        } else {
          // If not found in first page, we should ideally fetch by ID but for now we try to find it
          // Let's create an api route for fetching a single blog or just use the current one
          // Let's assume we can fetch by ID
          try {
            const singleResponse = await api.get(`/blogs/${id}`);
            if (singleResponse.data) setBlog(singleResponse.data);
          } catch(e) {}
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBlog();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>;
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Article Not Found</h2>
        <Link to="/blogs" className="text-blue-600 hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <section className="bg-white py-12 border-b border-slate-100">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/blogs" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Articles
          </Link>
          
          <div className="flex gap-4 text-sm font-medium text-slate-500 mb-4">
            <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              <Calendar className="w-4 h-4" /> {blog.date}
            </span>
            <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              <User className="w-4 h-4" /> {blog.author}
            </span>
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight"
          >
            {blog.title}
          </motion.h1>
          
          {blog.summary && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-600 leading-relaxed italic border-l-4 border-blue-500 pl-4"
            >
              {blog.summary}
            </motion.p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          {blog.image && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-12 shadow-sm border border-slate-200"
            >
              <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
            </motion.div>
          )}
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose prose-lg prose-slate prose-blue max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-img:rounded-2xl bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </section>
    </div>
  );
}
