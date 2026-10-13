import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Globe, Tag, Clock, Eye, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import TiptapEditor from './TiptapEditor';
import { uploadImage } from '../../lib/upload';

interface BlogEditorProps {
  initialData: any;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
}

const CATEGORIES = [
  'Clinical ART Guidelines',
  'ICMR Regulations & Legal',
  'Donor Screening & Karyotype',
  'Cryopreservation & LN2 Logistics',
  'Male Fertility & Andrology',
  'Embryology Laboratory Protocols',
  'Patient Care & Counseling'
];

export default function BlogEditor({ initialData, onSave, onCancel }: BlogEditorProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    summary: initialData?.summary || '',
    author: initialData?.author || '',
    category: initialData?.category || 'Clinical ART Guidelines',
    status: initialData?.status || 'Published',
    tags: Array.isArray(initialData?.tags) ? initialData.tags.join(', ') : (initialData?.tags || 'ART Act, Cryobank, Embryology'),
    readTime: initialData?.readTime || '4 min read',
    metaDescription: initialData?.metaDescription || initialData?.summary || '',
    date: initialData?.date || '',
    image: initialData?.image || ''
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Cover image exceeds 5MB limit. Please upload a file smaller than 5MB.');
      return;
    }

    setUploadingImage(true);
    try {
      const secure_url = await uploadImage(file);
      if (secure_url) {
        setFormData(prev => ({ ...prev, image: secure_url }));
      }
    } catch (error) {
      console.error('Upload error', error);
      const objectUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image: objectUrl }));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleContentChange = (content: string) => {
    // Estimate read time: ~200 words per minute
    const textOnly = content.replace(/<[^>]+>/g, ' ');
    const wordCount = textOnly.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    const estimated = `${minutes} min read`;

    setFormData(prev => ({
      ...prev,
      content,
      readTime: estimated
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    await onSave({
      ...formData,
      tags: tagArray,
      metaDescription: formData.metaDescription || formData.summary
    });
  };

  const generatedSlug = formData.title
    ? formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : 'article-headline';

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-100"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {initialData ? 'Edit Article' : 'Compose New Article'}
            </h2>
            <p className="text-xs text-slate-500">
              Publish medical content with SEO metadata and rich formatting.
            </p>
          </div>
          <button 
            onClick={onCancel} 
            className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-full hover:bg-slate-200/50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Metadata & Media */}
            <div className="space-y-4">
              {/* Cover Image */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Cover Image</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-[16/10] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-100 transition-colors relative overflow-hidden"
                >
                  {formData.image ? (
                    <img src={formData.image} alt="Cover Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImageIcon className="w-7 h-7 text-slate-300 mb-0.5" />
                      <span className="text-xs font-medium text-slate-500">
                        {uploadingImage ? 'Uploading...' : 'Click to Upload Cover'}
                      </span>
                      <span className="text-[10px] text-slate-400">Max 5MB (PNG, JPG)</span>
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

              {/* Category */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-xs text-slate-800"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Status & Read Time in Row */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Publish Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-xs font-medium text-slate-800"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Read Time
                  </label>
                  <input 
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-xs text-slate-800" 
                    placeholder="e.g. 5 min read"
                  />
                </div>
              </div>

              {/* Author Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Author / Contributor</label>
                <input 
                  type="text" required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-xs font-medium text-slate-800" 
                  placeholder="e.g. Dr. Rajesh Sharma, Lead Embryologist"
                />
              </div>

              {/* Tags / Keywords */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400" /> Tags / Keywords
                </label>
                <input 
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-xs text-slate-800" 
                  placeholder="Separated by commas (e.g. ICMR 2021, Cryobank)"
                />
              </div>

              {/* SEO Google Snippet Preview Box */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 uppercase tracking-wider">
                  <Globe className="w-3.5 h-3.5 text-blue-600" /> Google Search Preview
                </span>
                <div className="text-xs font-semibold text-blue-800 truncate">
                  {formData.title || 'Your Article Headline'} - Genes India ART Bank
                </div>
                <div className="text-[11px] text-emerald-700 truncate font-mono">
                  https://genesindia.com/blogs/{generatedSlug}
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {formData.metaDescription || formData.summary || 'Summary description will appear in search engine snippet cards.'}
                </div>
              </div>
            </div>

            {/* Right Column: Title, Summary, and Full Body Content */}
            <div className="lg:col-span-2 space-y-4 flex flex-col">
              {/* Article Headline */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Article Title</label>
                <input 
                  type="text" required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-base font-semibold text-slate-900 placeholder:text-slate-400" 
                  placeholder="e.g. Clinical Protocols for 180-Day Gamete Quarantine Verification"
                />
              </div>

              {/* Short Summary */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Executive Summary / Excerpt</label>
                <textarea 
                  required rows={2}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value, metaDescription: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-xs text-slate-800 resize-none placeholder:text-slate-400 leading-relaxed" 
                  placeholder="Concise 1-2 sentence overview of the article..."
                />
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col min-h-[300px]">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Main Content</label>
                <div className="flex-1 flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <TiptapEditor 
                    value={formData.content} 
                    onChange={handleContentChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onCancel} 
              className="px-5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={uploadingImage}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{uploadingImage ? 'Uploading Image...' : (initialData ? 'Save Article Changes' : 'Publish Article')}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
