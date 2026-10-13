import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import api from '../../lib/api';
import Pagination from '../../components/Pagination';
import ConfirmModal from '../../components/ConfirmModal';
import BlogCard from '../../components/blog/BlogCard';
import BlogEditor from '../../components/blog/BlogEditor';

export default function BlogManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // States for Modals
  const [editingBlog, setEditingBlog] = useState<any | 'new' | null>(null);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);

  const fetchBlogs = async (currentPage = page, search = searchTerm) => {
    setLoading(true);
    try {
      const response = await api.get(`/blogs?page=${currentPage}&limit=10&search=${search}`);
      if (response.data && response.data.data) {
        setBlogs(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.total);
      } else {
        setBlogs(response.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchBlogs(page, searchTerm);
    }, 300);
    return () => clearTimeout(delay);
  }, [page, searchTerm]);

  const handleSaveBlog = async (formData: any) => {
    try {
      if (editingBlog === 'new') {
        const today = new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
        await api.post('/blogs', { 
          ...formData,
          date: today
        });
      } else {
        await api.put(`/blogs/${formData._id}`, formData);
      }
      setEditingBlog(null);
      fetchBlogs();
    } catch (err) {
      console.error(err);
      alert('Failed to save blog');
    }
  };

  const confirmDelete = async () => {
    if (!blogToDelete) return;
    try {
      await api.delete(`/blogs/${blogToDelete}`);
      setBlogToDelete(null);
      fetchBlogs();
    } catch (err) {
      console.error(err);
      alert('Failed to delete blog');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Blog Manager</h1>
          <p className="text-slate-500 text-sm">Write and manage health articles with rich content.</p>
        </div>
        <button 
          onClick={() => setEditingBlog('new')} 
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm shadow-blue-600/20 transition-all"
        >
          <Plus className="w-5 h-5" /> Write Article
        </button>
      </div>

      <div className="space-y-4">
        {blogs.map((blog, i) => (
          <BlogCard 
            key={blog._id || blog.id}
            blog={blog}
            index={i}
            onEdit={(b) => setEditingBlog(b)}
            onDelete={(id) => setBlogToDelete(id)}
          />
        ))}

        {blogs.length === 0 && !loading && (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-1">No articles found</h3>
            <p className="text-slate-500">Get started by writing your first blog post.</p>
          </div>
        )}
      </div>
      
      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} totalItems={totalItems} onPageChange={setPage} />
      )}

      {/* Edit/Add Article Modal */}
      {editingBlog && (
        <BlogEditor 
          initialData={editingBlog === 'new' ? null : editingBlog} 
          onSave={handleSaveBlog}
          onCancel={() => setEditingBlog(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!blogToDelete}
        onClose={() => setBlogToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Article"
        message="Are you sure you want to delete this article? This action cannot be undone and will permanently remove it from the system."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}
