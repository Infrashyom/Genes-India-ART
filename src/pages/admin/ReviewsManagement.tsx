import React, { useState, useEffect } from 'react';
import { Star, Edit2, Trash2, Plus, X, Check } from 'lucide-react';
import { motion } from 'motion/react';
import api from '../../lib/api';
import ConfirmModal from '../../components/ConfirmModal';
import Pagination from '../../components/Pagination';

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    patientName: '',
    reviewText: '',
    rating: 5
  });

  const fetchReviews = async (currentPage = page) => {
    try {
      setLoading(true);
      const response = await api.get(`/reviews?page=${currentPage}&limit=10`);
      if (response.data && response.data.data) {
        setReviews(response.data.data);
        setTotalPages(response.data.totalPages || 1);
        setTotalItems(response.data.total || 0);
      } else {
        setReviews(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(page);
  }, [page]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingReview) {
        await api.put(`/reviews/${editingReview._id}`, formData);
      } else {
        await api.post('/reviews', formData);
      }
      setShowModal(false);
      fetchReviews();
    } catch (error) {
      alert('Failed to save review');
    }
  };

  const handleDelete = async () => {
    if (!reviewToDelete) return;
    try {
      await api.delete(`/reviews/${reviewToDelete}`);
      setReviewToDelete(null);
      fetchReviews();
    } catch (error) {
      console.error(error);
    }
  };

  const openNewModal = () => {
    setEditingReview(null);
    setFormData({ patientName: '', reviewText: '', rating: 5 });
    setShowModal(true);
  };

  const openEditModal = (review: any) => {
    setEditingReview(review);
    setFormData({ patientName: review.patientName, reviewText: review.reviewText, rating: review.rating });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Testimonials</h1>
          <p className="text-slate-500 mt-1">Manage patient reviews and testimonials.</p>
        </div>
        <button 
          onClick={openNewModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500">Loading testimonials...</div>
      ) : reviews.length === 0 ? (
        <div className="py-20 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
          No testimonials added yet.
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={review._id} 
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-6 justify-between items-start"
            >
              <div className="flex-1 space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className={`w-4 h-4 ${idx < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                  ))}
                </div>
                <p className="text-slate-600 italic">
                  "{review.reviewText}"
                </p>
                <div className="font-bold text-slate-900 text-sm">
                  - {review.patientName}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={() => openEditModal(review)}
                  className="w-10 h-10 border border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 rounded-lg flex items-center justify-center transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setReviewToDelete(review._id)}
                  className="w-10 h-10 border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 rounded-lg flex items-center justify-center transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">{editingReview ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <input 
                  type="text" required
                  value={formData.patientName}
                  onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm"
                  placeholder="Patient Name"
                />
              </div>
              <div>
                <textarea 
                  required rows={5}
                  value={formData.reviewText}
                  onChange={(e) => setFormData({...formData, reviewText: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm resize-none"
                  placeholder="Review Text"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-700">Rating:</span>
                <input 
                  type="number" required min="1" max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                  className="w-20 px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm"
                />
              </div>

              <div className="pt-4 mt-6">
                <button 
                  type="submit" 
                  className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" /> Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {reviewToDelete && (
        <ConfirmModal
          isOpen={!!reviewToDelete}
          onClose={() => setReviewToDelete(null)}
          onConfirm={handleDelete}
          title="Delete Testimonial"
          message="Are you sure you want to delete this testimonial? This action cannot be undone."
          confirmText="Delete"
        />
      )}
    </div>
  );
}
