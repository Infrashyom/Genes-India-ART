import React, { useState } from 'react';
import api from '../../../lib/api';
import { DonorData } from '../types';

interface ContactInfoTabProps {
  donor: DonorData;
  onSaveSuccess: (updatedDonor: DonorData, nextTabId?: string) => void;
}

export default function ContactInfoTab({ donor, onSaveSuccess }: ContactInfoTabProps) {
  const [phone, setPhone] = useState(donor.phone || '');
  const [alternatePhone, setAlternatePhone] = useState(donor.alternatePhone || donor.edrData?.alternatePhone || '');
  const [address, setAddress] = useState(donor.address || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updatedCompletedTabs = Array.from(
        new Set([...(donor.completedTabs || []), 'contact-info', '4'])
      );

      const payload = {
        ...donor,
        phone,
        alternatePhone,
        address,
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

      onSaveSuccess(updated, 'physical-traits');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to save contact information.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center mb-6">
        <div className="w-1.5 h-6 bg-blue-500 rounded-full mr-3"></div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Contact Information</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Primary communication details and residential address.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Phone Number */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            Primary Phone Number <span className="text-red-500 ml-1 text-base leading-none">*</span>
          </label>
          <input
            required
            type="tel"
            placeholder="e.g. +91 98765 43210"
            className="w-full border border-slate-300 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs text-sm font-normal text-slate-800 placeholder:text-slate-400 placeholder:font-normal"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <p className="text-xs text-slate-500">
            Primary contact number for clinical communication and verification.
          </p>
        </div>

        {/* Alternate Phone Number (Optional) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">
              Alternate Phone Number
            </label>
            <span className="text-[11px] font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
              Optional
            </span>
          </div>
          <input
            type="tel"
            placeholder="e.g. +91 98765 01234"
            className="w-full border border-slate-300 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs text-sm font-normal text-slate-800 placeholder:text-slate-400 placeholder:font-normal"
            value={alternatePhone}
            onChange={(e) => setAlternatePhone(e.target.value)}
          />
          <p className="text-xs text-slate-500">
            Secondary contact number in case primary is unreachable.
          </p>
        </div>

        {/* Residential Address */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            Residential Address <span className="text-red-500 ml-1 text-base leading-none">*</span>
          </label>
          <textarea
            required
            rows={4}
            placeholder="Enter complete house no., street, locality, city, district, state, and pincode..."
            className="w-full border border-slate-300 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs text-sm font-normal text-slate-800 placeholder:text-slate-400 placeholder:font-normal leading-relaxed"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <p className="text-xs text-slate-500">
            Current living address as per government identity records.
          </p>
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
