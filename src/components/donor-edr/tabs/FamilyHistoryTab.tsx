import React, { useState } from 'react';
import api from '../../../lib/api';
import { DonorData } from '../types';

interface FamilyHistoryTabProps {
  donor: DonorData;
  onSaveSuccess: (updatedDonor: DonorData, nextTabId?: string) => void;
}

const FATHER_HEALTH_OPTIONS = [
  'Alive & In Good Health',
  'Deceased - Old Age / Natural Causes',
  'Deceased - Medical Condition / Disease',
  'Chronic Illness (Hypertension / Type 2 Diabetes)',
  'Cardiovascular Disease (Heart Attack / CAD)',
  'Malignancy / Cancer History',
  'Unknown / Estranged',
];

const MOTHER_HEALTH_OPTIONS = [
  'Alive & In Good Health',
  'Deceased - Old Age / Natural Causes',
  'Deceased - Medical Condition / Disease',
  'Chronic Illness (Hypertension / Type 2 Diabetes)',
  'Cardiovascular Disease (Heart Attack / CAD)',
  'Malignancy / Cancer History',
  'Unknown / Estranged',
];

const SIBLINGS_HEALTH_OPTIONS = [
  'All Siblings Alive & In Good Health',
  'Only Child (No Siblings)',
  'Sibling with Chronic Medical Condition',
  'Deceased Sibling',
  'Unknown / Estranged',
];

const CANCER_HISTORY_OPTIONS = [
  'None (No Known Family History of Cancer)',
  'Breast or Ovarian Cancer (1st or 2nd Degree Relative)',
  'Colorectal / Gastrointestinal Cancer',
  'Lung / Respiratory Cancer',
  'Prostate Cancer',
  'Hematologic / Leukemia / Lymphoma',
  'Other Malignancy in Family',
];

const HEART_DISEASE_OPTIONS = [
  'None (No Known Family History of Early Cardiac Disease)',
  'Hypertension (High Blood Pressure)',
  'Early Heart Attack / Myocardial Infarction (< 55 years)',
  'Coronary Artery Disease / Stenting / Bypass',
  'Stroke / Cerebrovascular Disease',
  'Cardiomyopathy / Arrhythmia',
];

const GENETIC_DISORDER_OPTIONS = [
  'None (No Known Inherited or Genetic Disorders)',
  'Thalassemia (Major, Intermedia, or Minor Trait)',
  'Sickle Cell Disease or Carrier Trait',
  'Hemophilia / Bleeding Disorder',
  'Spinal Muscular Atrophy (SMA)',
  'Cystic Fibrosis',
  'Chromosomal Abnormality / Syndromic Condition',
  'Other Monogenic / Inherited Disorder',
];

export default function FamilyHistoryTab({ donor, onSaveSuccess }: FamilyHistoryTabProps) {
  const existingFamily = donor.edrData?.familyHistory || {};
  const [fatherStatus, setFatherStatus] = useState(existingFamily.fatherStatus || '');
  const [motherStatus, setMotherStatus] = useState(existingFamily.motherStatus || '');
  const [siblingsStatus, setSiblingsStatus] = useState(existingFamily.siblingsStatus || '');
  const [cancerHistory, setCancerHistory] = useState(existingFamily.cancerHistory || '');
  const [heartDiseaseHistory, setHeartDiseaseHistory] = useState(
    existingFamily.heartDiseaseHistory || ''
  );
  const [geneticDisorders, setGeneticDisorders] = useState(
    existingFamily.geneticDisorders || ''
  );
  const [additionalNotes, setAdditionalNotes] = useState(
    existingFamily.additionalNotes || ''
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updatedCompletedTabs = Array.from(
        new Set([...(donor.completedTabs || []), 'family-history', '7'])
      );
      const updatedEdrData = {
        ...(donor.edrData || {}),
        familyHistory: {
          fatherStatus,
          motherStatus,
          siblingsStatus,
          cancerHistory,
          heartDiseaseHistory,
          geneticDisorders,
          additionalNotes,
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

      onSaveSuccess(updated, 'medical-history');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to save family history.');
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
          <h3 className="text-2xl font-bold text-slate-900">Family Medical History</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Three-generation pedigree screening and familial genetic predispositions under ART Act rules.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Father's Health Status */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            Father's Health Status <span className="text-red-500 ml-1 text-base leading-none">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={fatherStatus}
              onChange={(e) => setFatherStatus(e.target.value)}
              className={`w-full border border-slate-300 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs appearance-none text-sm font-normal ${
                !fatherStatus ? 'text-slate-400' : 'text-slate-800'
              }`}
              style={selectStyle}
            >
              <option value="" disabled className="text-slate-400">
                Select father's health status...
              </option>
              {FATHER_HEALTH_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="text-slate-800">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mother's Health Status */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            Mother's Health Status <span className="text-red-500 ml-1 text-base leading-none">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={motherStatus}
              onChange={(e) => setMotherStatus(e.target.value)}
              className={`w-full border border-slate-300 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs appearance-none text-sm font-normal ${
                !motherStatus ? 'text-slate-400' : 'text-slate-800'
              }`}
              style={selectStyle}
            >
              <option value="" disabled className="text-slate-400">
                Select mother's health status...
              </option>
              {MOTHER_HEALTH_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="text-slate-800">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Siblings Health Status */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            Siblings Health Status <span className="text-red-500 ml-1 text-base leading-none">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={siblingsStatus}
              onChange={(e) => setSiblingsStatus(e.target.value)}
              className={`w-full border border-slate-300 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs appearance-none text-sm font-normal ${
                !siblingsStatus ? 'text-slate-400' : 'text-slate-800'
              }`}
              style={selectStyle}
            >
              <option value="" disabled className="text-slate-400">
                Select siblings health status...
              </option>
              {SIBLINGS_HEALTH_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="text-slate-800">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Familial Cancer History */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            Familial Cancer History <span className="text-red-500 ml-1 text-base leading-none">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={cancerHistory}
              onChange={(e) => setCancerHistory(e.target.value)}
              className={`w-full border border-slate-300 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs appearance-none text-sm font-normal ${
                !cancerHistory ? 'text-slate-400' : 'text-slate-800'
              }`}
              style={selectStyle}
            >
              <option value="" disabled className="text-slate-400">
                Select cancer history...
              </option>
              {CANCER_HISTORY_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="text-slate-800">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cardiovascular / Heart Disease */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            Cardiovascular / Heart Disease <span className="text-red-500 ml-1 text-base leading-none">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={heartDiseaseHistory}
              onChange={(e) => setHeartDiseaseHistory(e.target.value)}
              className={`w-full border border-slate-300 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs appearance-none text-sm font-normal ${
                !heartDiseaseHistory ? 'text-slate-400' : 'text-slate-800'
              }`}
              style={selectStyle}
            >
              <option value="" disabled className="text-slate-400">
                Select cardiovascular history...
              </option>
              {HEART_DISEASE_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="text-slate-800">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Known Hereditary / Genetic Disorders */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            Known Hereditary / Genetic Disorders <span className="text-red-500 ml-1 text-base leading-none">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={geneticDisorders}
              onChange={(e) => setGeneticDisorders(e.target.value)}
              className={`w-full border border-slate-300 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs appearance-none text-sm font-normal ${
                !geneticDisorders ? 'text-slate-400' : 'text-slate-800'
              }`}
              style={selectStyle}
            >
              <option value="" disabled className="text-slate-400">
                Select genetic disorder history...
              </option>
              {GENETIC_DISORDER_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="text-slate-800">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Additional Pedigree Notes (Optional) */}
        <div className="space-y-1.5 md:col-span-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">
              Additional Pedigree / Family History Notes
            </label>
            <span className="text-[11px] font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
              Optional
            </span>
          </div>
          <textarea
            rows={2}
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Specify any relevant ages of relatives, specific medical diagnoses, or pedigree details..."
            className="w-full border border-slate-300 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs text-sm font-normal text-slate-800 placeholder:text-slate-400 placeholder:font-normal"
          />
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
