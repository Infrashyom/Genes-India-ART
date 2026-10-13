import React, { useState } from 'react';
import api from '../../../lib/api';
import { DonorData } from '../types';

interface MedicalHistoryTabProps {
  donor: DonorData;
  isMale: boolean;
  onSaveSuccess: (updatedDonor: DonorData, nextTabId?: string) => void;
}

const CHRONIC_CONDITIONS_OPTIONS = [
  'None / No Chronic Medical Illnesses (NAD)',
  'Hypertension (Controlled)',
  'Type 2 Diabetes Mellitus',
  'Type 1 Diabetes Mellitus',
  'Asthma / Chronic Respiratory Disorder',
  'Thyroid Disorder (Hypothyroidism / Hyperthyroidism)',
  'Epilepsy / Neurological Disorder',
  'Autoimmune / Rheumatologic Condition',
  'Kidney / Renal Condition',
  'Liver / Gastrointestinal Condition',
  'Other Chronic Illness',
];

const PAST_SURGERY_OPTIONS = [
  'None (No Prior Surgeries)',
  'Minor Outpatient / Ambulatory Procedure',
  'Appendectomy / Cholecystectomy',
  'Laparoscopic / Abdominal Surgery',
  'Cesarean Section / Pelvic Surgery',
  'Orthopedic / Fracture Fixation',
  'ENT / Tonsillectomy / Adenoidectomy',
  'Other Major Surgical Procedure',
];

const MEDICATION_OPTIONS = [
  'None / Not Taking Regular Medications',
  'Vitamins / Mineral Supplements Only',
  'Oral Contraceptive Pills (OCPs)',
  'Thyroid Hormone Supplement (Levothyroxine)',
  'Antihypertensive Medication',
  'Antihistamines / Inhalers (As needed)',
  'Other Daily Prescription Medication',
];

const ALLERGY_OPTIONS = [
  'No Known Drug Allergies (NKDA)',
  'Penicillin / Amoxicillin Allergy',
  'Cephalosporin Antibiotics Allergy',
  'Sulfa Drugs (Sulfonamides) Allergy',
  'NSAIDs / Aspirin / Ibuprofen Allergy',
  'Latex / Contact Sensitivity',
  'Severe Food / Environmental Allergies',
  'Multiple Drug Allergies',
];

export default function MedicalHistoryTab({
  donor,
  isMale,
  onSaveSuccess,
}: MedicalHistoryTabProps) {
  const existingMed = donor.edrData?.medicalHistory || {};
  const [bloodPressure, setBloodPressure] = useState(existingMed.bloodPressure || '');
  const [pulseRate, setPulseRate] = useState(existingMed.pulseRate || '');
  const [chronicConditions, setChronicConditions] = useState(existingMed.chronicConditions || '');
  const [chronicDetails, setChronicDetails] = useState(existingMed.chronicDetails || '');
  const [pastSurgeries, setPastSurgeries] = useState(existingMed.pastSurgeries || '');
  const [surgeryDetails, setSurgeryDetails] = useState(existingMed.surgeryDetails || '');
  const [medications, setMedications] = useState(existingMed.medications || '');
  const [medicationDetails, setMedicationDetails] = useState(existingMed.medicationDetails || '');
  const [allergies, setAllergies] = useState(existingMed.allergies || '');
  const [allergyDetails, setAllergyDetails] = useState(existingMed.allergyDetails || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updatedCompletedTabs = Array.from(
        new Set([...(donor.completedTabs || []), 'medical-history', '8'])
      );
      const updatedEdrData = {
        ...(donor.edrData || {}),
        medicalHistory: {
          bloodPressure,
          pulseRate,
          chronicConditions,
          chronicDetails,
          pastSurgeries,
          surgeryDetails,
          medications,
          medicationDetails,
          allergies,
          allergyDetails,
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

      // Navigate to male or female specific next tab
      const nextTab = isMale ? 'reproductive-info' : 'reproductive-history';
      onSaveSuccess(updated, nextTab);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to save medical history.');
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
          <h3 className="text-2xl font-bold text-slate-900">Personal Medical History</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Vital signs baseline, chronic medical evaluation, surgeries, and drug sensitivities.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Blood Pressure - Mandatory */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            Blood Pressure (mmHg) <span className="text-red-500 ml-1 text-base leading-none">*</span>
          </label>
          <input
            required
            type="text"
            value={bloodPressure}
            onChange={(e) => setBloodPressure(e.target.value)}
            placeholder="Systolic / Diastolic (e.g. 120/80)"
            className="w-full border border-slate-300 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs text-sm font-normal text-slate-800 placeholder:text-slate-400 placeholder:font-normal placeholder:italic font-mono"
          />
        </div>

        {/* Resting Pulse Rate - Mandatory */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            Resting Pulse Rate (bpm) <span className="text-red-500 ml-1 text-base leading-none">*</span>
          </label>
          <input
            required
            type="text"
            value={pulseRate}
            onChange={(e) => setPulseRate(e.target.value)}
            placeholder="Beats per minute (e.g. 72)"
            className="w-full border border-slate-300 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs text-sm font-normal text-slate-800 placeholder:text-slate-400 placeholder:font-normal placeholder:italic font-mono"
          />
        </div>

        {/* Chronic Illnesses / Conditions - Mandatory Dropdown */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            Chronic Illnesses / Conditions <span className="text-red-500 ml-1 text-base leading-none">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={chronicConditions}
              onChange={(e) => setChronicConditions(e.target.value)}
              className={`w-full border border-slate-300 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs appearance-none text-sm font-normal ${
                !chronicConditions ? 'text-slate-400' : 'text-slate-800'
              }`}
              style={selectStyle}
            >
              <option value="" disabled className="text-slate-400">
                Select chronic medical status...
              </option>
              {CHRONIC_CONDITIONS_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="text-slate-800">
                  {opt}
                </option>
              ))}
            </select>
          </div>
          {chronicConditions && !chronicConditions.startsWith('None') && (
            <input
              type="text"
              value={chronicDetails}
              onChange={(e) => setChronicDetails(e.target.value)}
              placeholder="Specify diagnosis year, treatment, or stability status..."
              className="mt-2 w-full border border-slate-300 rounded-xl p-2.5 bg-white text-xs font-normal text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          )}
        </div>

        {/* Past Surgical History - Mandatory Dropdown */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            Past Surgical History <span className="text-red-500 ml-1 text-base leading-none">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={pastSurgeries}
              onChange={(e) => setPastSurgeries(e.target.value)}
              className={`w-full border border-slate-300 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs appearance-none text-sm font-normal ${
                !pastSurgeries ? 'text-slate-400' : 'text-slate-800'
              }`}
              style={selectStyle}
            >
              <option value="" disabled className="text-slate-400">
                Select surgical history...
              </option>
              {PAST_SURGERY_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="text-slate-800">
                  {opt}
                </option>
              ))}
            </select>
          </div>
          {pastSurgeries && !pastSurgeries.startsWith('None') && (
            <input
              type="text"
              value={surgeryDetails}
              onChange={(e) => setSurgeryDetails(e.target.value)}
              placeholder="Specify procedure, approximate year, and recovery outcome..."
              className="mt-2 w-full border border-slate-300 rounded-xl p-2.5 bg-white text-xs font-normal text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          )}
        </div>

        {/* Current Medications & Supplements - Mandatory Dropdown */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            Current Medications & Supplements <span className="text-red-500 ml-1 text-base leading-none">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              className={`w-full border border-slate-300 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs appearance-none text-sm font-normal ${
                !medications ? 'text-slate-400' : 'text-slate-800'
              }`}
              style={selectStyle}
            >
              <option value="" disabled className="text-slate-400">
                Select current medication status...
              </option>
              {MEDICATION_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="text-slate-800">
                  {opt}
                </option>
              ))}
            </select>
          </div>
          {medications && !medications.startsWith('None') && (
            <input
              type="text"
              value={medicationDetails}
              onChange={(e) => setMedicationDetails(e.target.value)}
              placeholder="Specify medication names, dosages, and frequency..."
              className="mt-2 w-full border border-slate-300 rounded-xl p-2.5 bg-white text-xs font-normal text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          )}
        </div>

        {/* Drug & Allergen Sensitivities - Mandatory Dropdown */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center">
            Drug & Allergen Sensitivities <span className="text-red-500 ml-1 text-base leading-none">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className={`w-full border border-slate-300 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs appearance-none text-sm font-normal ${
                !allergies ? 'text-slate-400' : 'text-slate-800'
              }`}
              style={selectStyle}
            >
              <option value="" disabled className="text-slate-400">
                Select allergy / sensitivity status...
              </option>
              {ALLERGY_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="text-slate-800">
                  {opt}
                </option>
              ))}
            </select>
          </div>
          {allergies && !allergies.startsWith('No Known') && (
            <input
              type="text"
              value={allergyDetails}
              onChange={(e) => setAllergyDetails(e.target.value)}
              placeholder="Describe adverse reaction (e.g. urticaria, swelling, anaphylaxis)..."
              className="mt-2 w-full border border-slate-300 rounded-xl p-2.5 bg-white text-xs font-normal text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          )}
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
