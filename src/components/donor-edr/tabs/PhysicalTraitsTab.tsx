import React, { useState } from 'react';
import api from '../../../lib/api';
import { DonorData } from '../types';

interface PhysicalTraitsTabProps {
  donor: DonorData;
  onSaveSuccess: (updatedDonor: DonorData, nextTabId?: string) => void;
}

const SKIN_TONE_OPTIONS = [
  'Fair',
  'Very Fair',
  'Wheatish',
  'Medium',
  'Wheatish Brown',
  'Dusky',
  'Dark / Deep',
];

const EYE_COLOR_OPTIONS = [
  'Brown',
  'Dark Brown',
  'Black',
  'Hazel',
  'Amber',
  'Green',
  'Grey',
  'Blue',
];

const HAIR_COLOR_OPTIONS = [
  'Black',
  'Dark Brown',
  'Brown',
  'Light Brown',
  'Auburn',
  'Blonde',
  'Grey / Salt & Pepper',
];

const BODY_TYPE_OPTIONS = [
  'Slim / Lean',
  'Athletic / Fit',
  'Average / Medium',
  'Broad / Muscular',
  'Heavy / Solid',
];

export default function PhysicalTraitsTab({ donor, onSaveSuccess }: PhysicalTraitsTabProps) {
  const [height, setHeight] = useState(donor.height ? donor.height.toString() : '');
  const [weight, setWeight] = useState(donor.weight ? donor.weight.toString() : '');
  const [bloodGroup, setBloodGroup] = useState(donor.bloodGroup || 'O+');
  const [skinTone, setSkinTone] = useState(donor.skinTone || '');
  const [eyeColor, setEyeColor] = useState(donor.eyeColor || '');
  const [hairColor, setHairColor] = useState(donor.hairColor || '');
  const [bodyType, setBodyType] = useState(donor.bodyType || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updatedCompletedTabs = Array.from(
        new Set([...(donor.completedTabs || []), 'physical-traits', '5'])
      );

      const payload = {
        ...donor,
        height: height ? Number(height) : 0,
        weight: weight ? Number(weight) : 0,
        bloodGroup,
        skinTone,
        eyeColor,
        hairColor,
        bodyType,
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

      onSaveSuccess(updated, 'lifestyle');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to save physical traits.');
    } finally {
      setSaving(false);
    }
  };

  const selectStyle = {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
    backgroundPosition: 'right 1rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.25em 1.25em',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center mb-6">
        <div className="w-1.5 h-6 bg-blue-500 rounded-full mr-3"></div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Physical Traits</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Donor anthropometric measurements and phenotypic characteristics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Height */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            Height (cm) <span className="text-red-500 ml-1 text-base leading-none">*</span>
          </label>
          <input
            required
            type="number"
            min="100"
            max="230"
            placeholder="Enter height in cm (e.g. 170)"
            className="w-full border border-slate-300 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs text-sm font-normal text-slate-800 placeholder:text-slate-400 placeholder:font-normal placeholder:italic"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>

        {/* Weight */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            Weight (kg) <span className="text-red-500 ml-1 text-base leading-none">*</span>
          </label>
          <input
            required
            type="number"
            min="30"
            max="180"
            placeholder="Enter weight in kg (e.g. 65)"
            className="w-full border border-slate-300 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs text-sm font-normal text-slate-800 placeholder:text-slate-400 placeholder:font-normal placeholder:italic"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>

        {/* Blood Group */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            Blood Group <span className="text-red-500 ml-1 text-base leading-none">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs appearance-none text-sm font-normal text-slate-800"
              style={selectStyle}
            >
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Skin Tone Dropdown */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            Skin Complexion / Tone <span className="text-red-500 ml-1 text-base leading-none">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={skinTone}
              onChange={(e) => setSkinTone(e.target.value)}
              className={`w-full border border-slate-300 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs appearance-none text-sm font-normal ${
                !skinTone ? 'text-slate-400' : 'text-slate-800'
              }`}
              style={selectStyle}
            >
              <option value="" disabled className="text-slate-400">
                Select skin complexion / tone
              </option>
              {SKIN_TONE_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="text-slate-800">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Eye Color Dropdown */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            Eye Color <span className="text-red-500 ml-1 text-base leading-none">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={eyeColor}
              onChange={(e) => setEyeColor(e.target.value)}
              className={`w-full border border-slate-300 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs appearance-none text-sm font-normal ${
                !eyeColor ? 'text-slate-400' : 'text-slate-800'
              }`}
              style={selectStyle}
            >
              <option value="" disabled className="text-slate-400">
                Select eye color
              </option>
              {EYE_COLOR_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="text-slate-800">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hair Color Dropdown */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            Hair Color <span className="text-red-500 ml-1 text-base leading-none">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={hairColor}
              onChange={(e) => setHairColor(e.target.value)}
              className={`w-full border border-slate-300 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs appearance-none text-sm font-normal ${
                !hairColor ? 'text-slate-400' : 'text-slate-800'
              }`}
              style={selectStyle}
            >
              <option value="" disabled className="text-slate-400">
                Select hair color
              </option>
              {HAIR_COLOR_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="text-slate-800">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Body Build / Type (Optional) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">
              Body Build / Type
            </label>
            <span className="text-[11px] font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
              Optional
            </span>
          </div>
          <div className="relative">
            <select
              value={bodyType}
              onChange={(e) => setBodyType(e.target.value)}
              className={`w-full border border-slate-300 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs appearance-none text-sm font-normal ${
                !bodyType ? 'text-slate-400' : 'text-slate-800'
              }`}
              style={selectStyle}
            >
              <option value="" className="text-slate-400">
                Select body type (optional)
              </option>
              {BODY_TYPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="text-slate-800">
                  {opt}
                </option>
              ))}
            </select>
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
