import React, { useState } from 'react';
import api from '../../../lib/api';
import { DonorData } from '../types';

export interface DynamicFormField {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'select' | 'textarea' | 'date';
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

interface DynamicFormTabProps {
  tabId: string;
  title: string;
  description: string;
  fields: DynamicFormField[];
  nextTabId?: string;
  donor: DonorData;
  onSaveSuccess: (updatedDonor: DonorData, nextTabId?: string) => void;
}

export default function DynamicFormTab({
  tabId,
  title,
  description,
  fields,
  nextTabId,
  donor,
  onSaveSuccess,
}: DynamicFormTabProps) {
  const existingData = donor.edrData?.[tabId] || {};
  const [formData, setFormData] = useState<Record<string, any>>(existingData);
  const [saving, setSaving] = useState(false);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updatedCompletedTabs = Array.from(new Set([...(donor.completedTabs || []), tabId]));
      const updatedEdrData = {
        ...(donor.edrData || {}),
        [tabId]: formData,
      };

      const payload = {
        ...donor,
        edrData: updatedEdrData,
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

      onSaveSuccess(updated, nextTabId);
    } catch (err: any) {
      alert(err.response?.data?.error || `Failed to save ${title}.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center mb-6">
        <div className="w-1.5 h-6 bg-blue-500 rounded-full mr-3"></div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => {
          const value = formData[field.name] !== undefined ? formData[field.name] : '';

          if (field.type === 'select') {
            return (
              <div key={field.name} className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1 text-base leading-none">*</span>}
                </label>
                <div className="relative">
                  <select
                    required={field.required}
                    value={value}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className={`w-full border border-slate-300 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs appearance-none text-sm font-normal ${
                      !value ? 'text-slate-400' : 'text-slate-800'
                    }`}
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                      backgroundPosition: 'right 1rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.25em 1.25em',
                    }}
                  >
                    <option value="" className="text-slate-400">
                      Select option...
                    </option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt} className="text-slate-800">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          }

          if (field.type === 'textarea') {
            return (
              <div key={field.name} className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium text-slate-700 flex items-center">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1 text-base leading-none">*</span>}
                </label>
                <textarea
                  rows={3}
                  required={field.required}
                  placeholder={field.placeholder}
                  value={value}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs text-sm font-normal text-slate-800 placeholder:text-slate-400 placeholder:font-normal"
                />
              </div>
            );
          }

          return (
            <div key={field.name} className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 flex items-center">
                {field.label}
                {field.required && <span className="text-red-500 ml-1 text-base leading-none">*</span>}
              </label>
              <input
                type={field.type || 'text'}
                required={field.required}
                placeholder={field.placeholder}
                value={value}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs text-sm font-normal text-slate-800 placeholder:text-slate-400 placeholder:font-normal"
              />
            </div>
          );
        })}
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
