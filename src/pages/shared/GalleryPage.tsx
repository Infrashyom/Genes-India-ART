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
        setImages(response.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch gallery images', err);
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

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds the 5MB limit. Please upload a smaller image.');
      if (e.target) e.target.value = '';
      return;
    }

    setUploadingImage(true);
    try {
      const secure_url = await uploadImage(file);
      if (secure_url) {
        setUploadData(prev => ({ ...prev, url: secure_url }));
      }
    } catch (error) {
      alert('Failed to upload image. Please check file format and try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.url) {
      alert('Please upload a photo first.');
      return;
    }
    if (!uploadData.title.trim()) {
      alert('Please enter a photo title or description.');
      return;
    }

    try {
      await api.post('/gallery', uploadData);
      setShowUploadModal(false);
      setUploadData({ title: '', category: 'Laboratory', url: '' });
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchImages(page);
    } catch (err) {
      console.error(err);
      alert('Failed to save image details. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!imageToDelete) return;
    try {
      await api.delete(`/gallery/${imageToDelete}`);
      setImageToDelete(null);
      fetchImages(page);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={isPublic ? "w-full bg-slate-50 min-h-screen pb-16" : ""}>
      {isPublic && (
        <div className="bg-white pt-6 sm:pt-8 pb-6 sm:pb-8 border-b border-slate-100">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 mb-2">
              Facility & Diagnostics
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              Photo Gallery
            </h1>
            <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
              Explore our cryogenic preservation facilities, laboratory diagnostics, and clinical equipment.
            </p>
          </div>
        </div>
      )}

      <div className={isPublic ? "max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8" : "space-y-8"}>
        {!isPublic && (
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Photo Gallery</h1>
              <p className="text-slate-500 mt-1">Manage and view facility, event, and laboratory photos.</p>
            </div>
            <button 
              type="button"
              onClick={() => {
                setUploadData({ title: '', category: 'Laboratory', url: '' });
                if (fileInputRef.current) fileInputRef.current.value = '';
                setShowUploadModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Upload Photo
            </button>
          </div>
        )}

        {/* Categories Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
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
                      type="button"
                      onClick={() => setImageToDelete(img._id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:scale-105 shadow-md cursor-pointer"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {totalPages > 1 && (
          <div className="pt-4 flex justify-center">
            <Pagination 
              currentPage={page} 
              totalPages={totalPages} 
              totalItems={totalItems}
              onPageChange={(p) => setPage(p)} 
            />
          </div>
        )}

        {/* Upload Photo Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h2 className="text-lg font-bold text-slate-900">Upload New Photo</h2>
                <button 
                  type="button"
                  onClick={() => setShowUploadModal(false)} 
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/60 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveImage} className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Photo (JPG, PNG, WEBP, HEIC up to 5MB)
                  </label>
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
                        <span className="text-[11px] text-slate-400">Supports HEIC, JPG, PNG, WEBP</span>
                      </>
                    )}
                    <input 
                      type="file" 
                      accept="image/*,.heic,.HEIC,.heif,.HEIF,image/heic,image/heif" 
                      ref={fileInputRef} 
                      className="hidden" 
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Title / Description
                  </label>
                  <input 
                    type="text" 
                    required
                    value={uploadData.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setUploadData(prev => ({ ...prev, title: newTitle }));
                    }}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                    placeholder="e.g. Advanced Microscope Room"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <select 
                    value={uploadData.category}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      setUploadData(prev => ({ ...prev, category: newCat }));
                    }}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm appearance-none cursor-pointer"
                  >
                    {defaultCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setShowUploadModal(false)} 
                    className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={uploadingImage || !uploadData.url}
                    className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
    </div>
  );
}
