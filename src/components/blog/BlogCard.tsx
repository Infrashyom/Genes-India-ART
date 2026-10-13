import React from 'react';
import { motion } from 'motion/react';
import { Eye, Edit2, Trash2, Image as ImageIcon, Clock } from 'lucide-react';

interface Blog {
  _id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  category?: string;
  status?: string;
  readTime?: string;
  tags?: string[];
  date: string;
  image: string;
}

interface BlogCardProps {
  key?: React.Key;
  blog: Blog;
  index: number;
  onEdit: (blog: Blog) => void;
  onDelete: (id: string) => void;
}

export default function BlogCard({ blog, index, onEdit, onDelete }: BlogCardProps) {
  const isDraft = blog.status === 'Draft';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex flex-col md:flex-row gap-5 hover:border-slate-300 transition-all"
    >
      <div className="w-full md:w-[240px] h-[160px] shrink-0 rounded-xl overflow-hidden bg-slate-100">
        {blog.image ? (
          <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
            <ImageIcon className="w-8 h-8 opacity-40" />
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col pt-1 pb-1 relative pr-28">
        <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
          {blog.category && (
            <span className="text-[11px] font-medium text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              {blog.category}
            </span>
          )}
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
            isDraft ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            {blog.status || 'Published'}
          </span>
          <span className="text-slate-400 text-[11px]">
            {blog.date || 'Recent'} • {blog.author || 'Author'}
          </span>
          {blog.readTime && (
            <span className="text-slate-400 text-[11px] flex items-center gap-1">
              <Clock className="w-3 h-3" /> {blog.readTime}
            </span>
          )}
        </div>

        <h2 className="text-lg font-bold text-slate-900 mb-1.5 leading-snug">
          {blog.title}
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 leading-relaxed">
          {blog.summary || blog.content?.replace(/<[^>]+>/g, '').substring(0, 150) + '...'}
        </p>
        
        <div className="absolute top-2 right-2 flex items-center gap-1.5">
          <a 
            href={`/blogs/${blog._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors" 
            title="Preview on Public Website"
          >
            <Eye className="w-4 h-4" />
          </a>
          <button 
            onClick={() => onEdit(blog)}
            className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors cursor-pointer" 
            title="Edit Article"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(blog._id)}
            className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors cursor-pointer" 
            title="Delete Article"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
