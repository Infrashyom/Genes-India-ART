import React, { useState, useEffect } from 'react';
import { Save, Globe, Users, Image as ImageIcon, Link2, Layout, Video, UploadCloud, Trash2, CheckCircle2 } from 'lucide-react';
import api from '../../lib/api';
import { uploadImage } from '../../lib/upload';
import { useBrand } from '../../context/BrandContext';

export default function Settings() {
  const { reloadBrand, updateLogo } = useBrand();
  const [activeTab, setActiveTab] = useState('branding');
  const [founders, setFounders] = useState<any[]>([]);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [settings, setSettings] = useState<Record<string, any>>({
    logoUrl: '',
    platformName: 'Genes India',
    platformTagline: 'ART Bank & Cryo-Repository',
    supportEmail: 'support@genesindia.com',
    timezone: 'Asia/Kolkata (IST)',
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
    homeVideoUrl: '',
    aboutImageUrl: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Fetch founders if tab is founders
    if (activeTab === 'founders' && founders.length === 0) {
      api.get('/founders').then(res => setFounders(res.data)).catch(console.error);
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

  const handlePhotoUpload = async (id: string, file: File) => {
    setUploadingId(id);
    try {
      const url = await uploadImage(file);
      if (url) {
        await api.put(`/founders/${id}`, { image: url });
        setFounders(founders.map(f => f._id === id ? { ...f, image: url } : f));
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
    if (activeTab === 'founders') return; // Handled inline
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
    { id: 'founders', name: 'Founder Photos', icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
        <p className="text-slate-500 mt-1">Configure platform-wide preferences, branding logo, content, and portal policies.</p>
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
              </div>
              
              <div className="space-y-6 max-w-2xl">
                {activeTab === 'branding' && (
                  <div className="space-y-5">
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Upload your official logo here. This logo will automatically be rendered across the public website header, footer, staff and hospital portals, login page, and the browser favicon.
                    </p>

                    {/* Logo Preview Cards */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                        Current Application Logo
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Light Background Preview */}
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

                        {/* Dark Background Preview */}
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
                        <span className="text-[11px] text-slate-400 block">PNG, SVG, or JPG (strict 5MB limit, transparent background recommended)</span>
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

                    {/* Direct URL input fallback */}
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

                    {/* Platform Tagline */}
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
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-900">Platform Name</label>
                      <input 
                        type="text" 
                        value={settings.platformName}
                        onChange={(e) => handleSettingChange('platformName', e.target.value)}
                        className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-900">Support Email</label>
                      <input 
                        type="email" 
                        value={settings.supportEmail}
                        onChange={(e) => handleSettingChange('supportEmail', e.target.value)}
                        className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-900">Default Timezone</label>
                      <select 
                        value={settings.timezone}
                        onChange={(e) => handleSettingChange('timezone', e.target.value)}
                        className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST)</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                  </>
                )}

                {activeTab === 'social' && (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500 mb-4">Update the social media links shown in the public portal footer.</p>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-900">Facebook URL</label>
                      <input 
                        type="url" placeholder="https://facebook.com/..."
                        value={settings.facebookUrl}
                        onChange={(e) => handleSettingChange('facebookUrl', e.target.value)}
                        className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-900">Instagram URL</label>
                      <input 
                        type="url" placeholder="https://instagram.com/..."
                        value={settings.instagramUrl}
                        onChange={(e) => handleSettingChange('instagramUrl', e.target.value)}
                        className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-900">Twitter (X) URL</label>
                      <input 
                        type="url" placeholder="https://twitter.com/..."
                        value={settings.twitterUrl}
                        onChange={(e) => handleSettingChange('twitterUrl', e.target.value)}
                        className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-900">LinkedIn URL</label>
                      <input 
                        type="url" placeholder="https://linkedin.com/..."
                        value={settings.linkedinUrl}
                        onChange={(e) => handleSettingChange('linkedinUrl', e.target.value)}
                        className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'content' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <Video className="w-4 h-4 text-slate-400" />
                        Home Page Background Video URL
                      </label>
                      <p className="text-xs text-slate-500">Provide an MP4 URL for the hero section background.</p>
                      <input 
                        type="url" placeholder="https://example.com/video.mp4"
                        value={settings.homeVideoUrl}
                        onChange={(e) => handleSettingChange('homeVideoUrl', e.target.value)}
                        className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                    
                    <hr className="border-slate-100" />

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-900">About Page Hero Image</label>
                      <p className="text-xs text-slate-500 mb-2">Upload the main image shown on the About Us page.</p>
                      
                      <div className="w-full aspect-video bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center relative overflow-hidden group">
                        {settings.aboutImageUrl ? (
                          <img src={settings.aboutImageUrl} alt="About" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center text-slate-400 p-4 text-center">
                            <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                            <span className="text-sm font-medium">No Image Uploaded</span>
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-lg font-medium text-sm hover:bg-slate-50 transition-colors shadow-sm">
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
                  <div className="space-y-6">
                    <p className="text-sm text-slate-500 mb-4">Upload the display photos for the founders shown on the public portal. Photos save automatically upon upload.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {founders.map(founder => (
                        <div key={founder._id} className="border border-slate-200 rounded-xl p-6 bg-slate-50">
                          <h3 className="font-bold text-slate-900">{founder.name}</h3>
                          <p className="text-sm text-slate-500 mb-4">{founder.title}</p>
                          
                          <div className="w-full aspect-[4/5] bg-white rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center relative overflow-hidden group">
                            {founder.image ? (
                              <img src={founder.image} alt={founder.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="flex flex-col items-center text-slate-400 p-4 text-center">
                                <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                                <span className="text-sm font-medium">No Photo</span>
                              </div>
                            )}
                            
                            <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-lg font-medium text-sm hover:bg-slate-50 transition-colors shadow-sm">
                                {uploadingId === founder._id ? 'Uploading...' : 'Change Photo'}
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handlePhotoUpload(founder._id, file);
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {founders.length === 0 && (
                      <div className="text-center py-8 text-slate-500 text-sm">No founder profiles found in database.</div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {activeTab !== 'founders' && (
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button 
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm shadow-blue-600/20 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
