import React, { useState } from 'react';
import api from '../../../lib/api';
import { DonorData } from '../types';

interface LifestyleTabProps {
  donor: DonorData;
  onSaveSuccess: (updatedDonor: DonorData, nextTabId?: string) => void;
}

const SMOKING_OPTIONS = [
  'Non-smoker / Never smoked',
  'Former smoker (Quit > 1 year ago)',
  'Former smoker (Quit < 1 year ago)',
  'Occasional / Social smoker',
  'Regular smoker (Daily)',
];

const ALCOHOL_OPTIONS = [
  'Non-drinker / Abstinent / Teetotaler',
  'Occasional / Social (1-2 units/month)',
  'Moderate drinker (1-2 units/week)',
  'Regular drinker (> 3 units/week)',
  'History of heavy drinking (Currently abstinent)',
];

const DIETARY_OPTIONS = [
  'Vegetarian',
  'Non-Vegetarian',
  'Eggetarian (Lacto-ovo vegetarian)',
  'Vegan',
  'Jain / Strict Vegetarian',
];

const EXERCISE_OPTIONS = [
  'Sedentary (Little or no regular exercise)',
  'Light exercise (1-2 times per week)',
  'Moderate exercise (3-4 times per week)',
  'Active / Vigorous fitness (5+ times per week)',
  'Competitive Athlete / Heavy Training',
];

const SLEEP_OPTIONS = [
  '7 - 8 hours per night (Optimal)',
  '6 - 7 hours per night',
  '8 - 9 hours per night',
  'Less than 6 hours (Chronic sleep deficit)',
  'Irregular sleep / Rotating shift worker',
];

const OCCUPATIONAL_OPTIONS = [
  'None / No hazardous occupational exposure',
  'Radiation / X-Ray / Radioisotope exposure',
  'Chemical / Organic solvents / Paints exposure',
  'Heavy metals / Welding / Lead exposure',
  'High temperature / Heat exposure / Furnace work',
  'Agricultural pesticides / Fertilizers',
  'Other occupational hazard',
];

export default function LifestyleTab({ donor, onSaveSuccess }: LifestyleTabProps) {
  const existingLifestyle = donor.edrData?.lifestyle || {};
  const [smoking, setSmoking] = useState(existingLifestyle.smoking || '');
  const [alcohol, setAlcohol] = useState(existingLifestyle.alcohol || '');
  const [diet, setDiet] = useState(existingLifestyle.diet || '');
  const [exercise, setExercise] = useState(existingLifestyle.exercise || '');
  const [sleep, setSleep] = useState(existingLifestyle.sleep || '7 - 8 hours per night (Optimal)');
  const [occupationalHazards, setOccupationalHazards] = useState(
    existingLifestyle.occupationalHazards || 'None / No hazardous occupational exposure'
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updatedCompletedTabs = Array.from(
        new Set([...(donor.completedTabs || []), 'lifestyle', '6'])
      );
      const updatedEdrData = {
        ...(donor.edrData || {}),
        lifestyle: {
          smoking,
          alcohol,
          diet,
          exercise,
          sleep,
          occupationalHazards,
        },
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

      onSaveSuccess(updated, 'family-history');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to save lifestyle details.');
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
          <h3 className="text-2xl font-bold text-slate-900">Lifestyle & Habits</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Behavioral and environmental factors impacting gamete quality and donor eligibility.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Smoking History - Mandatory */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            Smoking History <span className="text-red-500 ml-1 text-base leading-none">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={smoking}
              onChange={(e) => setSmoking(e.target.value)}
              className={`w-full border border-slate-300 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs appearance-none text-sm font-normal ${
                !smoking ? 'text-slate-400' : 'text-slate-800'
              }`}
              style={selectStyle}
            >
              <option value="" disabled className="text-slate-400">
                Select smoking history...
              </option>
              {SMOKING_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="text-slate-800">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Alcohol Consumption - Mandatory */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            Alcohol Consumption <span className="text-red-500 ml-1 text-base leading-none">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={alcohol}
              onChange={(e) => setAlcohol(e.target.value)}
              className={`w-full border border-slate-300 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs appearance-none text-sm font-normal ${
                !alcohol ? 'text-slate-400' : 'text-slate-800'
              }`}
              style={selectStyle}
            >
              <option value="" disabled className="text-slate-400">
                Select alcohol consumption...
              </option>
              {ALCOHOL_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="text-slate-800">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dietary Habits - Mandatory */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            Dietary Habits <span className="text-red-500 ml-1 text-base leading-none">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
              className={`w-full border border-slate-300 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs appearance-none text-sm font-normal ${
                !diet ? 'text-slate-400' : 'text-slate-800'
              }`}
              style={selectStyle}
            >
              <option value="" disabled className="text-slate-400">
                Select dietary habits...
              </option>
              {DIETARY_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="text-slate-800">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Physical Activity / Exercise - Mandatory */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            Physical Activity / Exercise <span className="text-red-500 ml-1 text-base leading-none">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              className={`w-full border border-slate-300 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs appearance-none text-sm font-normal ${
                !exercise ? 'text-slate-400' : 'text-slate-800'
              }`}
              style={selectStyle}
            >
              <option value="" disabled className="text-slate-400">
                Select physical activity level...
              </option>
              {EXERCISE_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="text-slate-800">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Average Daily Sleep */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            Average Daily Sleep
          </label>
          <div className="relative">
            <select
              value={sleep}
              onChange={(e) => setSleep(e.target.value)}
              className={`w-full border border-slate-300 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs appearance-none text-sm font-normal ${
                !sleep ? 'text-slate-400' : 'text-slate-800'
              }`}
              style={selectStyle}
            >
              {SLEEP_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="text-slate-800">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Occupational Hazards Exposure */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            Occupational Radiation / Chemical Exposure
          </label>
          <div className="relative">
            <select
              value={occupationalHazards}
              onChange={(e) => setOccupationalHazards(e.target.value)}
              className={`w-full border border-slate-300 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs appearance-none text-sm font-normal ${
                !occupationalHazards ? 'text-slate-400' : 'text-slate-800'
              }`}
              style={selectStyle}
            >
              {OCCUPATIONAL_OPTIONS.map((opt) => (
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
