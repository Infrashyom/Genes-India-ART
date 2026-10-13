import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, Image as ImageIcon, Trash2 } from 'lucide-react';
import api from '../../lib/api';
import { uploadImage } from '../../lib/upload';
import ConfirmModal from '../../components/ConfirmModal';
import Pagination from '../../components/Pagination';

const defaultCategories = ['Laboratory', 'Hospital Events', 'Our Team', 'Facilities'];

export default function GalleryPage({ isPublic = false }: { isPublic?: boolean }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  // Upload state
  const [uploadData, setUploadData] = useState({ title: '', category: 'Laboratory', url: '' });
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = async (currentPage = page) => {
    try {
      setLoading(true);
      const response = await api.get(`/gallery?page=${currentPage}&limit=12`);
      if (response.data && response.data.data) {
        setImages(response.data.data);
        setTotalPages(response.data.totalPages || 1);
        setTotalItems(response.data.total || 0);
      } else {
        setImages(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch gallery images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(page);
  }, [page]);

  const categories = ['All', ...defaultCategories];

  const filteredImages = images.filter(img => activeCategory === 'All' || img.category === activeCategory);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;


    setUploadingImage(true);
    try {
      const secure_url = await uploadImage(file);
      if (secure_url) {
        setUploadData({ ...uploadData, url: secure_url });
      }
    } catch (error) {
      alert('Failed to upload image. Check server console.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.url) return;
    try {
      await api.post('/gallery', uploadData);
      setShowUploadModal(false);
      setUploadData({ title: '', category: 'Laboratory', url: '' });
      fetchImages();
    } catch (err) {
      console.error(err);
      alert('Failed to save image details');
    }
  };

  const handleDelete = async () => {
    if (!imageToDelete) return;
    try {
      await api.delete(`/gallery/${imageToDelete}`);
      setImageToDelete(null);
      fetchImages();
    } catch (err) {
      console.error(err);
    }
  };

  const InnerContent = () => (
    <div className="space-y-8">
      {!isPublic && (
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Photo Gallery</h1>
            <p className="text-slate-500 mt-1">Manage and view facility, event, and laboratory photos.</p>
          </div>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" /> Upload Photo
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Image Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500">Loading gallery...</div>
      ) : filteredImages.length === 0 ? (
        <div className="py-20 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
          No images found in this category.
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredImages.map((img) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                key={img._id || img.id}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200"
              >
                <img 
                  src={img.url} 
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <span className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">{img.category}</span>
                  <h3 className="text-white font-medium leading-snug">{img.title}</h3>
                </div>
                {!isPublic && (
                  <button
                    onClick={() => setImageToDelete(img._id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:scale-105 shadow-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modals */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900">Upload New Photo</h2>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveImage} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Photo</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-video bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-100 transition-colors relative overflow-hidden"
                >
                  {uploadData.url ? (
                    <img src={uploadData.url} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-slate-300 mb-1" />
                      <span className="text-sm font-medium text-slate-400">
                        {uploadingImage ? 'Uploading...' : 'Click to Upload'}
                      </span>
                    </>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Title / Description</label>
                <input 
                  type="text" required
                  value={uploadData.title}
                  onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                  placeholder="e.g. Advanced Microscope Room"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                <select 
                  value={uploadData.category}
                  onChange={(e) => setUploadData({...uploadData, category: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm appearance-none"
                >
                  {defaultCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowUploadModal(false)} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={uploadingImage || !uploadData.url}
                  className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingImage ? 'Uploading...' : 'Save Photo'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {imageToDelete && (
        <ConfirmModal
          isOpen={!!imageToDelete}
          onClose={() => setImageToDelete(null)}
          onConfirm={handleDelete}
          title="Delete Photo"
          message="Are you sure you want to delete this photo from the gallery? This action cannot be undone."
          confirmText="Delete Photo"
        />
      )}
    </div>
  );

  if (isPublic) {
    return (
      <div>
        <div className="bg-blue-600 py-16 lg:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent"></div>
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">Gallery</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Explore our world-class facilities, advanced laboratory equipment, and dedicated team of specialists.
            </p>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <InnerContent />
        </div>
      </div>
    );
  }

  return <InnerContent />;
}
