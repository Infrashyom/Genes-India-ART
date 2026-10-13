import React, { useState } from 'react';
import { FileText, Upload, Check, ExternalLink } from 'lucide-react';
import api from '../../../lib/api';
import { DonorData } from '../types';

interface IdentityDocsTabProps {
  donor: DonorData;
  onSaveSuccess: (updatedDonor: DonorData, nextTabId?: string) => void;
}

export default function IdentityDocsTab({ donor, onSaveSuccess }: IdentityDocsTabProps) {
  const [primaryDocType, setPrimaryDocType] = useState(donor.primaryDocType || 'Aadhaar Card');
  const [primaryDocNumber, setPrimaryDocNumber] = useState(
    donor.primaryDocNumber || donor.aadhaar || ''
  );
  const [primaryDocUrl, setPrimaryDocUrl] = useState(
    donor.primaryDocUrl || donor.aadhaarDoc || ''
  );

  const [secondaryDocType, setSecondaryDocType] = useState(donor.secondaryDocType || 'PAN Card');
  const [secondaryDocNumber, setSecondaryDocNumber] = useState(
    donor.secondaryDocNumber || donor.pan || ''
  );
  const [secondaryDocUrl, setSecondaryDocUrl] = useState(
    donor.secondaryDocUrl || donor.panDoc || ''
  );

  const [uploadingDoc1, setUploadingDoc1] = useState(false);
  const [uploadingDoc2, setUploadingDoc2] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleFileUpload = async (
    file: File | undefined,
    setUrl: (url: string) => void,
    setUploading: (loading: boolean) => void
  ) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Lazy upload API call
      const res = await api.post('/upload', formData);
      setUrl(res.data.secure_url);
    } catch (err) {
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!primaryDocNumber.trim()) {
      alert(`Please enter the ${primaryDocType} number.`);
      return;
    }
    if (!primaryDocUrl) {
      alert(`Please upload the ${primaryDocType} document file.`);
      return;
    }

    setSaving(true);
    try {
      const updatedCompletedTabs = Array.from(
        new Set([...(donor.completedTabs || []), 'identity-docs', '3'])
      );

      const payload = {
        ...donor,
        primaryDocType,
        primaryDocNumber,
        primaryDocUrl,
        secondaryDocType,
        secondaryDocNumber,
        secondaryDocUrl,
        aadhaar: primaryDocType === 'Aadhaar Card' ? primaryDocNumber : donor.aadhaar,
        voterId: primaryDocType === 'Voter ID' ? primaryDocNumber : donor.voterId,
        pan: secondaryDocType === 'PAN Card' ? secondaryDocNumber : donor.pan,
        aadhaarDoc: primaryDocType === 'Aadhaar Card' ? primaryDocUrl : donor.aadhaarDoc,
        panDoc: secondaryDocType === 'PAN Card' ? secondaryDocUrl : donor.panDoc,
        completedTabs: updatedCompletedTabs,
      };

      const donorDbId = donor._id || donor.id;
      const res = await api.put(`/donors/${donorDbId}`, payload);

      const updated: DonorData = {
        ...donor,
        ...payload,
        _id: res.data._id || donorDbId,
        completedTabs: updatedCompletedTabs,
      };

      onSaveSuccess(updated, 'contact-info');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to save identity documents.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center mb-6">
        <div className="w-1.5 h-6 bg-blue-500 rounded-full mr-3"></div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Identity Verification & Documents</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Mandatory primary identification and optional secondary supporting documents.
          </p>
        </div>
      </div>

      {/* Document 1: Primary ID (Mandatory: Aadhaar Card or Voter ID) */}
      <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h4 className="font-bold text-slate-800 text-base">Primary Identity Document</h4>
          </div>
          <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
            Mandatory
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center">
              Select Primary Document <span className="text-red-500 ml-1 text-lg leading-none">*</span>
            </label>
            <div className="relative">
              <select
                required
                value={primaryDocType}
                onChange={(e) => setPrimaryDocType(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm appearance-none font-medium"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                  backgroundPosition: 'right 1rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.25em 1.25em',
                }}
              >
                <option value="Aadhaar Card">Aadhaar Card</option>
                <option value="Voter ID">Voter ID (EPIC Card)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center">
              {primaryDocType === 'Voter ID' ? 'Voter ID Number' : 'Aadhaar Number'}{' '}
              <span className="text-red-500 ml-1 text-lg leading-none">*</span>
            </label>
            <input
              required
              type="text"
              placeholder={
                primaryDocType === 'Voter ID' ? 'e.g. ABC1234567' : 'e.g. 1234 5678 9012'
              }
              className="w-full border border-slate-300 rounded-xl p-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm font-mono text-sm"
              value={primaryDocNumber}
              onChange={(e) => setPrimaryDocNumber(e.target.value)}
            />
          </div>
        </div>

        {/* Primary Document Upload Box */}
        <div className="space-y-2 pt-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center">
            Upload {primaryDocType} File <span className="text-red-500 ml-1 text-lg leading-none">*</span>
          </label>
          <div
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer relative group ${
              primaryDocUrl
                ? 'border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50/70'
                : 'border-slate-300 bg-white hover:bg-slate-50'
            }`}
          >
            <input
              type="file"
              accept="image/*,.pdf"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              disabled={uploadingDoc1}
              onChange={(e) => handleFileUpload(e.target.files?.[0], setPrimaryDocUrl, setUploadingDoc1)}
            />
            {uploadingDoc1 ? (
              <div className="flex flex-col items-center justify-center py-2">
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                <p className="text-sm font-semibold text-slate-700">Uploading document securely...</p>
              </div>
            ) : primaryDocUrl ? (
              <div className="space-y-1.5">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-1">
                  <Check className="w-5 h-5" />
                </div>
                <p className="font-bold text-emerald-800 text-sm">{primaryDocType} Uploaded Successfully</p>
                <div className="flex items-center justify-center gap-3 pt-1">
                  <a
                    href={primaryDocUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    View Uploaded File <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500">Click anywhere to replace</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-1 group-hover:text-blue-500 transition-colors" />
                <p className="font-bold text-slate-700 text-sm">
                  Click to upload {primaryDocType}
                </p>
                <p className="text-xs text-slate-500">Supports PDF or images (JPG, PNG) up to 5MB</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Document 2: Secondary ID (Optional) */}
      <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-slate-500 text-white font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h4 className="font-bold text-slate-800 text-base">Secondary Identity Document</h4>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-200/80 px-2.5 py-0.5 rounded-full">
            Optional
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Select Secondary Document</label>
            <div className="relative">
              <select
                value={secondaryDocType}
                onChange={(e) => setSecondaryDocType(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm appearance-none font-medium"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                  backgroundPosition: 'right 1rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.25em 1.25em',
                }}
              >
                <option value="PAN Card">PAN Card</option>
                <option value="Driving License">Driving License</option>
                <option value="Passport">Passport</option>
                <option value="Ration Card">Ration Card</option>
                <option value="Other Valid Govt ID">Other Valid Govt ID</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              {secondaryDocType} Number <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder={
                secondaryDocType === 'PAN Card'
                  ? 'e.g. ABCDE1234F'
                  : secondaryDocType === 'Driving License'
                  ? 'e.g. DL-1420110012345'
                  : 'Enter document number...'
              }
              className="w-full border border-slate-300 rounded-xl p-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm font-mono text-sm"
              value={secondaryDocNumber}
              onChange={(e) => setSecondaryDocNumber(e.target.value)}
            />
          </div>
        </div>

        {/* Secondary Document Upload Box */}
        <div className="space-y-2 pt-2">
          <label className="text-sm font-semibold text-slate-700">
            Upload {secondaryDocType} File <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer relative group ${
              secondaryDocUrl
                ? 'border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50/70'
                : 'border-slate-300 bg-white hover:bg-slate-50'
            }`}
          >
            <input
              type="file"
              accept="image/*,.pdf"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              disabled={uploadingDoc2}
              onChange={(e) => handleFileUpload(e.target.files?.[0], setSecondaryDocUrl, setUploadingDoc2)}
            />
            {uploadingDoc2 ? (
              <div className="flex flex-col items-center justify-center py-2">
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                <p className="text-sm font-semibold text-slate-700">Uploading document securely...</p>
              </div>
            ) : secondaryDocUrl ? (
              <div className="space-y-1.5">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-1">
                  <Check className="w-5 h-5" />
                </div>
                <p className="font-bold text-emerald-800 text-sm">
                  {secondaryDocType} Uploaded Successfully
                </p>
                <div className="flex items-center justify-center gap-3 pt-1">
                  <a
                    href={secondaryDocUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    View Uploaded File <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSecondaryDocUrl('');
                    }}
                    className="text-xs text-red-600 hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-1 group-hover:text-blue-500 transition-colors" />
                <p className="font-bold text-slate-700 text-sm">
                  Click to upload {secondaryDocType} (Optional)
                </p>
                <p className="text-xs text-slate-500">Supports PDF or images (JPG, PNG) up to 5MB</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-8 mt-6 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all flex items-center justify-center min-w-[160px] disabled:opacity-70 cursor-pointer"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            'Save & Next'
          )}
        </button>
      </div>
    </form>
  );
}
