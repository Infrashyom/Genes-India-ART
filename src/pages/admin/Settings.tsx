import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Globe, 
  Users, 
  Image as ImageIcon, 
  Link2, 
  Layout, 
  Video, 
  UploadCloud, 
  Trash2, 
  CheckCircle2, 
  Plus, 
  X, 
  Phone, 
  MapPin, 
  AlertCircle,
  Clock,
  BookOpen,
  ArrowUpDown
} from 'lucide-react';
import api from '../../lib/api';
import { uploadImage } from '../../lib/upload';
import { useBrand } from '../../context/BrandContext';

interface FounderData {
  _id?: string;
  name: string;
  title: string;
  qualifications: string;
  experience: string;
  description: string;
  image: string;
  displayOrder: number;
}

export default function Settings() {
  const { reloadBrand, updateLogo } = useBrand();
  const [activeTab, setActiveTab] = useState('branding');
  const [founders, setFounders] = useState<FounderData[]>([]);
  const [loadingFounders, setLoadingFounders] = useState(false);
  const [savingFounderId, setSavingFounderId] = useState<string | null>(null);
  const [founderSaveSuccessId, setFounderSaveSuccessId] = useState<string | null>(null);
  
  // New founder modal state
  const [isAddFounderOpen, setIsAddFounderOpen] = useState(false);
  const [newFounder, setNewFounder] = useState<FounderData>({
    name: '',
    title: '',
    qualifications: '',
    experience: '',
    description: '',
    image: '',
    displayOrder: 1
  });
  const [addingFounder, setAddingFounder] = useState(false);

  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [settings, setSettings] = useState<Record<string, any>>({
    logoUrl: '',
    platformName: 'Genes India',
    platformTagline: 'ART Bank & Cryo-Repository',
    supportEmail: 'support@genesindia.com',
    supportPhone: '+91 9425318361',
    officeAddress: '402 A - 402 B, 4th floor, Industry house, 15 A B Road, Indore 452010 (MP)',
    timezone: 'Asia/Kolkata (IST)',
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
    whatsappNumber: '+91 9425318361',
    homeVideoUrl: '',
    aboutImageUrl: ''
  });
  const [saving, setSaving] = useState(false);

  const fetchFounders = async () => {
    setLoadingFounders(true);
    try {
      const res = await api.get('/founders');
      setFounders(res.data || []);
    } catch (err) {
      console.error('Failed to load founders', err);
    } finally {
      setLoadingFounders(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'founders') {
      fetchFounders();
    }
  }, [activeTab]);

  useEffect(() => {
    // Fetch all global settings
    api.get('/settings').then(res => {
      if (res.data) {
        setSettings(prev => ({ ...prev, ...res.data }));
      }
    }).catch(console.error);
  }, []);

  const handleFounderFieldChange = (id: string, field: keyof FounderData, value: any) => {
    setFounders(prev => prev.map(f => f._id === id ? { ...f, [field]: value } : f));
  };

  const handleSaveFounder = async (id: string) => {
    const founder = founders.find(f => f._id === id);
    if (!founder) return;

    if (!founder.name.trim() || !founder.title.trim()) {
      alert('Founder Name and Title are required.');
      return;
    }

    setSavingFounderId(id);
    try {
      await api.put(`/founders/${id}`, founder);
      setFounderSaveSuccessId(id);
      setTimeout(() => setFounderSaveSuccessId(null), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to save founder details. Please try again.');
    } finally {
      setSavingFounderId(null);
    }
  };

  const handleDeleteFounder = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete profile for "${name}"? This cannot be undone.`)) {
      return;
    }
    try {
      await api.delete(`/founders/${id}`);
      setFounders(prev => prev.filter(f => f._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete founder.');
    }
  };

  const handleAddFounderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFounder.name.trim() || !newFounder.title.trim() || !newFounder.description.trim()) {
      alert('Please fill in Name, Title, and Bio/Description.');
      return;
    }

    setAddingFounder(true);
    try {
      const res = await api.post('/founders', newFounder);
      setFounders(prev => [...prev, res.data]);
      setIsAddFounderOpen(false);
      setNewFounder({
        name: '',
        title: '',
        qualifications: '',
        experience: '',
        description: '',
        image: '',
        displayOrder: (founders.length + 1)
      });
    } catch (err) {
      console.error(err);
      alert('Failed to add founder profile.');
    } finally {
      setAddingFounder(false);
    }
  };

  const handlePhotoUpload = async (id: string, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('Photo exceeds the 5MB limit.');
      return;
    }
    setUploadingId(id);
    try {
      const url = await uploadImage(file);
      if (url) {
        await api.put(`/founders/${id}`, { image: url });
        setFounders(prev => prev.map(f => f._id === id ? { ...f, image: url } : f));
      }
    } catch (e) {
      console.error(e);
      alert('Upload failed');
    } finally {
      setUploadingId(null);
    }
  };

  const handleNewFounderPhotoUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('Photo exceeds the 5MB limit.');
      return;
    }
    setUploadingId('newFounder');
    try {
      const url = await uploadImage(file);
      if (url) {
        setNewFounder(prev => ({ ...prev, image: url }));
      }
    } catch (e) {
      console.error(e);
      alert('Upload failed');
    } finally {
      setUploadingId(null);
    }
  };

  const handleLogoUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('Logo file size exceeds the 5MB limit. Please upload a file smaller than 5MB.');
      return;
    }
    setUploadingId('logo');
    try {
      const url = await uploadImage(file);
      if (url) {
        handleSettingChange('logoUrl', url);
        updateLogo(url);
      }
    } catch (e: any) {
      console.error(e);
      alert(e.response?.data?.error || 'Logo upload failed');
    } finally {
      setUploadingId(null);
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    if (activeTab === 'founders') return;
    setSaving(true);
    setSaveSuccess(false);
    try {
      await api.put('/settings', settings);
      if (settings.logoUrl) {
        updateLogo(settings.logoUrl);
      }
      await reloadBrand();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAboutImageUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('Image exceeds 5MB limit.');
      return;
    }
    setUploadingId('aboutImage');
    try {
      const url = await uploadImage(file);
      if (url) {
        handleSettingChange('aboutImageUrl', url);
      }
    } catch (e) {
      console.error(e);
      alert('Upload failed');
    } finally {
      setUploadingId(null);
    }
  };

  const tabs = [
    { id: 'branding', name: 'Branding & Logo', icon: ImageIcon },
    { id: 'general', name: 'General Settings', icon: Globe },
    { id: 'social', name: 'Social Media', icon: Link2 },
    { id: 'content', name: 'Content Management', icon: Layout },
    { id: 'founders', name: 'Founders & Promoters', icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
        <p className="text-slate-500 mt-1">Configure platform-wide preferences, branding logo, founders profile, and portal content.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors cursor-pointer ${
                activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-xs' 
                : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.name}
            </button>
          ))}
        </div>

        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="p-6 md:p-7">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  {tabs.find(t => t.id === activeTab)?.name}
                </h2>
                {saveSuccess && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full animate-in fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Saved & Updated Everywhere
                  </span>
                )}
                {activeTab === 'founders' && (
                  <button
                    onClick={() => {
                      setNewFounder({
                        name: '',
                        title: '',
                        qualifications: '',
                        experience: '',
                        description: '',
                        image: '',
                        displayOrder: (founders.length + 1)
                      });
                      setIsAddFounderOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Promoter / Founder
                  </button>
                )}
              </div>
              
              <div className="space-y-6 max-w-4xl">
                {activeTab === 'branding' && (
                  <div className="space-y-5 max-w-2xl">
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Upload your official logo here. Stored in Cloudinary and rendered across public header, footer, staff and hospital portals, login page, and favicon.
                    </p>

                    {/* Logo Preview Cards */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                        Current Application Logo
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center min-h-[140px] text-center">
                          <span className="text-[11px] font-medium text-slate-400 mb-2">Preview on Light Header</span>
                          {settings.logoUrl ? (
                            <img 
                              src={settings.logoUrl} 
                              alt="Brand Logo" 
                              className="h-10 max-w-[200px] object-contain" 
                            />
                          ) : (
                            <div className="flex items-center gap-2 text-slate-400 text-xs">
                              <ImageIcon className="w-6 h-6" /> No custom logo uploaded yet
                            </div>
                          )}
                        </div>

                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center min-h-[140px] text-center">
                          <span className="text-[11px] font-medium text-slate-400 mb-2">Preview on Dark Sidebar / Footer</span>
                          {settings.logoUrl ? (
                            <img 
                              src={settings.logoUrl} 
                              alt="Brand Logo" 
                              className="h-10 max-w-[200px] object-contain brightness-105" 
                            />
                          ) : (
                            <div className="flex items-center gap-2 text-slate-500 text-xs">
                              <ImageIcon className="w-6 h-6" /> Default SVG icon active
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Upload Controls */}
                    <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="space-y-0.5 text-center sm:text-left">
                        <span className="text-xs font-semibold text-slate-800 block">Upload Logo File</span>
                        <span className="text-[11px] text-slate-400 block">PNG, SVG, or JPG (Cloudinary-backed, 5MB max, transparent recommended)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl cursor-pointer transition-colors shadow-xs">
                          <UploadCloud className="w-4 h-4" />
                          <span>{uploadingId === 'logo' ? 'Uploading...' : 'Choose File'}</span>
                          <input 
                            type="file" 
                            accept="image/png,image/svg+xml,image/jpeg,image/webp" 
                            className="hidden" 
                            disabled={uploadingId === 'logo'}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleLogoUpload(file);
                            }} 
                          />
                        </label>
                        {settings.logoUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              handleSettingChange('logoUrl', '');
                              updateLogo('');
                            }}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors cursor-pointer"
                            title="Remove custom logo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Or Paste Direct Logo URL</label>
                      <input 
                        type="url" 
                        placeholder="https://example.com/logo.png"
                        value={settings.logoUrl || ''}
                        onChange={(e) => {
                          handleSettingChange('logoUrl', e.target.value);
                          updateLogo(e.target.value);
                        }}
                        className="w-full px-3.5 py-2 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Brand Tagline</label>
                      <input 
                        type="text" 
                        value={settings.platformTagline || ''}
                        onChange={(e) => handleSettingChange('platformTagline', e.target.value)}
                        className="w-full px-3.5 py-2 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'general' && (
                  <div className="space-y-4 max-w-2xl">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-900">Platform Name</label>
                      <input 
                        type="text" 
                        value={settings.platformName || ''}
                        onChange={(e) => handleSettingChange('platformName', e.target.value)}
                        className="w-full px-3.5 py-2 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-900">Support Email</label>
                        <input 
                          type="email" 
                          value={settings.supportEmail || ''}
                          onChange={(e) => handleSettingChange('supportEmail', e.target.value)}
                          className="w-full px-3.5 py-2 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-900">Support Phone / Mobile</label>
                        <input 
                          type="text" 
                          placeholder="+91 9425318361"
                          value={settings.supportPhone || ''}
                          onChange={(e) => handleSettingChange('supportPhone', e.target.value)}
                          className="w-full px-3.5 py-2 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-900">Central ART Bank Address</label>
                      <input 
                        type="text" 
                        value={settings.officeAddress || ''}
                        onChange={(e) => handleSettingChange('officeAddress', e.target.value)}
                        className="w-full px-3.5 py-2 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-900">Default Timezone</label>
                      <select 
                        value={settings.timezone || 'Asia/Kolkata (IST)'}
                        onChange={(e) => handleSettingChange('timezone', e.target.value)}
                        className="w-full px-3.5 py-2 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST)</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === 'social' && (
                  <div className="space-y-4 max-w-2xl">
                    <p className="text-sm text-slate-500 mb-2">Only populated links will appear as icons in the website footer.</p>
                    
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-900">Facebook Page URL</label>
                      <input 
                        type="url" placeholder="https://facebook.com/genesindia"
                        value={settings.facebookUrl || ''}
                        onChange={(e) => handleSettingChange('facebookUrl', e.target.value)}
                        className="w-full px-3.5 py-2 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-900">Instagram Profile URL</label>
                      <input 
                        type="url" placeholder="https://instagram.com/genesindia"
                        value={settings.instagramUrl || ''}
                        onChange={(e) => handleSettingChange('instagramUrl', e.target.value)}
                        className="w-full px-3.5 py-2 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-900">Twitter (X) Profile URL</label>
                      <input 
                        type="url" placeholder="https://twitter.com/genesindia"
                        value={settings.twitterUrl || ''}
                        onChange={(e) => handleSettingChange('twitterUrl', e.target.value)}
                        className="w-full px-3.5 py-2 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-900">LinkedIn Company URL</label>
                      <input 
                        type="url" placeholder="https://linkedin.com/company/genesindia"
                        value={settings.linkedinUrl || ''}
                        onChange={(e) => handleSettingChange('linkedinUrl', e.target.value)}
                        className="w-full px-3.5 py-2 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-900">WhatsApp Floating Number</label>
                      <input 
                        type="text" placeholder="+91 9425318361"
                        value={settings.whatsappNumber || ''}
                        onChange={(e) => handleSettingChange('whatsappNumber', e.target.value)}
                        className="w-full px-3.5 py-2 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'content' && (
                  <div className="space-y-6 max-w-2xl">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <Video className="w-4 h-4 text-slate-400" />
                        Home Page Background Video URL
                      </label>
                      <p className="text-xs text-slate-500">Provide an MP4 direct link for the hero background loop.</p>
                      <input 
                        type="url" placeholder="https://example.com/video.mp4"
                        value={settings.homeVideoUrl || ''}
                        onChange={(e) => handleSettingChange('homeVideoUrl', e.target.value)}
                        className="w-full px-3.5 py-2 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                    
                    <hr className="border-slate-100" />

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-900">About Page Hero Image</label>
                      <p className="text-xs text-slate-500 mb-2">Upload the main banner displayed on the About Us page (saved in Cloudinary).</p>
                      
                      <div className="w-full aspect-video bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group">
                        {settings.aboutImageUrl ? (
                          <img src={settings.aboutImageUrl} alt="About" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center text-slate-400 p-4 text-center">
                            <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                            <span className="text-xs font-medium">No Image Uploaded</span>
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-xl font-medium text-xs hover:bg-slate-50 transition-colors shadow-xs">
                            {uploadingId === 'aboutImage' ? 'Uploading...' : 'Change Image'}
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleAboutImageUpload(file);
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'founders' && (
                  <div className="space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-blue-50/60 border border-blue-100 p-4 rounded-xl text-blue-900 text-xs">
                      <div className="flex items-start gap-2.5">
                        <Users className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-semibold text-blue-950">Promoters & Founders Full Editor</p>
                          <p className="text-blue-700/90 mt-0.5">
                            Manage the full biography, designations, medical qualifications, experience years, and Cloudinary photos shown on the public <span className="font-semibold">/founder</span> page.
                          </p>
                        </div>
                      </div>
                    </div>

                    {loadingFounders && (
                      <div className="text-center py-12 text-slate-400 text-sm">Loading founder profiles...</div>
                    )}

                    {!loadingFounders && founders.length === 0 && (
                      <div className="text-center py-12 bg-slate-50 border border-slate-200 rounded-2xl p-8">
                        <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-sm font-semibold text-slate-800">No founder profiles in database</h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Click "Add Promoter / Founder" above to add your first director or promoter profile.</p>
                      </div>
                    )}

                    <div className="space-y-8">
                      {founders.map((founder, idx) => (
                        <div 
                          key={founder._id} 
                          className="border border-slate-200 rounded-2xl p-5 md:p-6 bg-slate-50/50 shadow-xs space-y-6"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
                            <div className="flex items-center gap-2.5">
                              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <h3 className="font-bold text-slate-900 text-base">{founder.name || 'Untitled Founder'}</h3>
                              <span className="text-xs text-slate-500 font-medium hidden sm:inline">({founder.title || 'Role not specified'})</span>
                            </div>

                            <div className="flex items-center gap-2">
                              {founderSaveSuccessId === founder._id && (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg animate-in fade-in">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Saved
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => handleSaveFounder(founder._id!)}
                                disabled={savingFounderId === founder._id}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                              >
                                <Save className="w-3.5 h-3.5" />
                                {savingFounderId === founder._id ? 'Saving...' : 'Save Profile'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteFounder(founder._id!, founder.name)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-rose-200"
                                title="Delete founder profile"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                            {/* Photo & Display Order */}
                            <div className="md:col-span-4 flex flex-col items-center">
                              <div className="w-full max-w-[220px] aspect-[4/5] bg-white rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center relative overflow-hidden group shadow-xs">
                                {founder.image ? (
                                  <img 
                                    src={founder.image} 
                                    alt={founder.name} 
                                    className="w-full h-full object-cover" 
                                  />
                                ) : (
                                  <div className="flex flex-col items-center text-slate-400 p-4 text-center">
                                    <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                                    <span className="text-xs font-medium">No Photograph</span>
                                  </div>
                                )}

                                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                                  <label className="cursor-pointer bg-white text-slate-900 px-3 py-1.5 rounded-xl font-medium text-xs hover:bg-slate-50 transition-colors shadow-sm text-center">
                                    {uploadingId === founder._id ? 'Uploading...' : 'Upload Cloudinary Photo'}
                                    <input 
                                      type="file" 
                                      className="hidden" 
                                      accept="image/*"
                                      disabled={uploadingId === founder._id}
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handlePhotoUpload(founder._id!, file);
                                      }}
                                    />
                                  </label>
                                  {founder.image && (
                                    <button
                                      type="button"
                                      onClick={() => handleFounderFieldChange(founder._id!, 'image', '')}
                                      className="text-xs text-rose-300 hover:text-white underline cursor-pointer"
                                    >
                                      Remove Photo
                                    </button>
                                  )}
                                </div>
                              </div>
                              <span className="text-[11px] text-slate-400 mt-2 text-center">Cloudinary 4:5 Portrait recommended</span>

                              <div className="w-full max-w-[220px] mt-4 space-y-1">
                                <label className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                                  <ArrowUpDown className="w-3 h-3 text-slate-400" /> Display Sequence
                                </label>
                                <input 
                                  type="number"
                                  min="1"
                                  value={founder.displayOrder || 1}
                                  onChange={(e) => handleFounderFieldChange(founder._id!, 'displayOrder', parseInt(e.target.value) || 1)}
                                  className="w-full px-3 py-1.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                />
                              </div>
                            </div>

                            {/* Text inputs */}
                            <div className="md:col-span-8 space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                                  <input 
                                    type="text" 
                                    placeholder="e.g. Dr. Rajesh Sharma"
                                    value={founder.name || ''}
                                    onChange={(e) => handleFounderFieldChange(founder._id!, 'name', e.target.value)}
                                    className="w-full px-3.5 py-2 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                  />
                                </div>

                                <div className="space-y-1.5">
                                  <label className="text-xs font-semibold text-slate-700">Designation / Role *</label>
                                  <input 
                                    type="text" 
                                    placeholder="e.g. Founder & Clinical Director"
                                    value={founder.title || ''}
                                    onChange={(e) => handleFounderFieldChange(founder._id!, 'title', e.target.value)}
                                    className="w-full px-3.5 py-2 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                    <BookOpen className="w-3.5 h-3.5 text-slate-400" /> Qualifications
                                  </label>
                                  <input 
                                    type="text" 
                                    placeholder="e.g. MBBS, MD, Fellowship in Reproductive Medicine"
                                    value={founder.qualifications || ''}
                                    onChange={(e) => handleFounderFieldChange(founder._id!, 'qualifications', e.target.value)}
                                    className="w-full px-3.5 py-2 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                  />
                                </div>

                                <div className="space-y-1.5">
                                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Experience
                                  </label>
                                  <input 
                                    type="text" 
                                    placeholder="e.g. 25+ Years in Clinical Embryology"
                                    value={founder.experience || ''}
                                    onChange={(e) => handleFounderFieldChange(founder._id!, 'experience', e.target.value)}
                                    className="w-full px-3.5 py-2 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                  />
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">Biography / Clinical Overview *</label>
                                <textarea 
                                  rows={5}
                                  placeholder="Detailed bio, academic career, leadership at Genes India, and clinical milestones..."
                                  value={founder.description || ''}
                                  onChange={(e) => handleFounderFieldChange(founder._id!, 'description', e.target.value)}
                                  className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y leading-relaxed font-sans" 
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {activeTab !== 'founders' && (
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button 
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 flex items-center gap-2 shadow-xs shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add New Founder Modal */}
      {isAddFounderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add Promoter / Founder</h3>
                <p className="text-xs text-slate-500 mt-0.5">Create a new promoter profile for Genes India ART Bank.</p>
              </div>
              <button 
                onClick={() => setIsAddFounderOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFounderSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Dr. Rajesh Sharma"
                    value={newFounder.name}
                    onChange={(e) => setNewFounder(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3.5 py-2 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Designation / Role *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Founder & Clinical Director"
                    value={newFounder.title}
                    onChange={(e) => setNewFounder(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3.5 py-2 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Qualifications</label>
                  <input 
                    type="text" 
                    placeholder="e.g. MBBS, MD, Fellowship"
                    value={newFounder.qualifications}
                    onChange={(e) => setNewFounder(prev => ({ ...prev, qualifications: e.target.value }))}
                    className="w-full px-3.5 py-2 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Experience</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 30+ Years Experience"
                    value={newFounder.experience}
                    onChange={(e) => setNewFounder(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full px-3.5 py-2 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>

              {/* Photo Upload */}
              <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {newFounder.image ? (
                    <img src={newFounder.image} alt="Preview" className="w-12 h-14 object-cover rounded-lg border border-slate-200" />
                  ) : (
                    <div className="w-12 h-14 rounded-lg bg-slate-200 flex items-center justify-center text-slate-400">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">Portrait Photo</span>
                    <span className="text-[11px] text-slate-400 block">Uploaded to Cloudinary</span>
                  </div>
                </div>

                <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl cursor-pointer transition-colors border border-blue-200">
                  <UploadCloud className="w-4 h-4" />
                  <span>{uploadingId === 'newFounder' ? 'Uploading...' : 'Upload Image'}</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    disabled={uploadingId === 'newFounder'}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleNewFounderPhotoUpload(file);
                    }} 
                  />
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Biography / Clinical Overview *</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Comprehensive profile background..."
                  value={newFounder.description}
                  onChange={(e) => setNewFounder(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" 
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddFounderOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingFounder}
                  className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {addingFounder ? 'Saving...' : 'Create Founder Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
