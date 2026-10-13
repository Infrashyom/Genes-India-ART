import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import api from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { DonorData } from '../types';

interface BasicRegistrationTabProps {
  donor: DonorData;
  isNew: boolean;
  onSaveSuccess: (updatedDonor: DonorData, nextTabId?: string) => void;
}

export default function BasicRegistrationTab({
  donor,
  isNew,
  onSaveSuccess,
}: BasicRegistrationTabProps) {
  const { user } = useAuth();
  const [donorIdNumber, setDonorIdNumber] = useState(
    donor.id ? donor.id.replace(/^D-?/i, '') : ''
  );
  const [registrationDate, setRegistrationDate] = useState(
    donor.registrationDate || new Date().toISOString().split('T')[0]
  );
  const [branch, setBranch] = useState(donor.branch || 'Indore');
  const [idError, setIdError] = useState('');
  const [saving, setSaving] = useState(false);

  // Registrar name from logged in user or saved donor record (greyed view, ineditable)
  const registrarName = donor.staffAssigned || user?.name || 'Staff Registrar';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIdError('');

    const numPart = donorIdNumber.trim().replace(/^D-?/i, '');
    if (!numPart) {
      setIdError('Please enter a Donor ID number (e.g. 1024 for D-1024).');
      return;
    }

    const fullCode = `D-${numPart}`;
    setSaving(true);

    try {
      // Lazy API check for duplicate donor code
      const checkRes = await api.get(
        `/donors/check-code/${encodeURIComponent(fullCode)}?excludeId=${isNew ? '' : donor._id || donor.id}`
      );
      if (checkRes.data?.exists) {
        setIdError(`Donor ID "${fullCode}" already exists. Please choose a different number.`);
        setSaving(false);
        return;
      }

      // Mark tab 'basic-registration' as completed
      const updatedCompletedTabs = Array.from(
        new Set([...(donor.completedTabs || []), 'basic-registration', '1'])
      );

      const payload = {
        ...donor,
        donorCode: fullCode,
        id: fullCode,
        registrationDate,
        staffAssigned: registrarName,
        branch,
        completedTabs: updatedCompletedTabs,
      };

      if (isNew) {
        const res = await api.post('/donors', payload);
        const createdDonor: DonorData = {
          ...payload,
          _id: res.data._id,
          id: fullCode,
          completedTabs: updatedCompletedTabs,
        };
        onSaveSuccess(createdDonor, 'personal-details');
      } else {
        const donorDbId = donor._id || donor.id;
        const res = await api.put(`/donors/${donorDbId}`, payload);
        const updated: DonorData = {
          ...donor,
          ...payload,
          _id: res.data._id || donorDbId,
          id: fullCode,
          completedTabs: updatedCompletedTabs,
        };
        onSaveSuccess(updated, 'personal-details');
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to save basic registration details.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center mb-6">
        <div className="w-1.5 h-6 bg-blue-500 rounded-full mr-3"></div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Basic Registration</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Initial institutional registration and donor identification.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Donor ID with fixed D- prefix badge */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center">
            Donor ID <span className="text-red-500 ml-1 text-lg leading-none" title="Required">*</span>
          </label>
          <div
            className={`flex rounded-xl shadow-sm overflow-hidden border transition-all ${
              idError
                ? 'border-red-400 ring-2 ring-red-400'
                : 'border-slate-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500'
            }`}
          >
            <span className="inline-flex items-center px-4 bg-slate-100 border-r border-slate-300 text-slate-700 font-mono font-bold text-base select-none">
              D-
            </span>
            <input
              type="text"
              required
              value={donorIdNumber}
              onChange={(e) => {
                const val = e.target.value.replace(/^D-?/i, '');
                setDonorIdNumber(val);
                setIdError('');
              }}
              placeholder="Enter donor number e.g. 1024"
              className="w-full p-3 bg-slate-50 focus:bg-white transition-all outline-none font-mono text-sm"
            />
          </div>
          {idError ? (
            <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-1">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {idError}
            </p>
          ) : (
            <p className="text-xs text-slate-500">
              Staff entered ID starting with "D-" (e.g. D-{donorIdNumber || '1024'})
            </p>
          )}
        </div>

        {/* Registration Date */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center">
            Registration Date <span className="text-red-500 ml-1 text-lg leading-none" title="Required">*</span>
          </label>
          <input
            type="date"
            required
            value={registrationDate}
            onChange={(e) => setRegistrationDate(e.target.value)}
            className="w-full border border-slate-300 rounded-xl p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>

        {/* Assigned Staff (Registrar) - Ineditable, greyed view as requested */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center justify-between">
            <span>Registering Staff (Registrar)</span>
            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Auto-logged
            </span>
          </label>
          <input
            type="text"
            readOnly
            disabled
            value={registrarName}
            className="w-full border border-slate-200 rounded-xl p-3 bg-slate-100 text-slate-600 font-medium cursor-not-allowed shadow-inner select-none"
            placeholder="Staff Registrar"
          />
          <p className="text-xs text-slate-400">
            Recorded staff registrar creating this donor record.
          </p>
        </div>

        {/* Branch Selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center">
            Branch <span className="text-red-500 ml-1 text-lg leading-none" title="Required">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm appearance-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                backgroundPosition: 'right 1rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.25em 1.25em',
              }}
            >
              <option value="">Select Branch...</option>
              {['Banaras', 'Ghorakhpur', 'Lukhnow', 'Bhopal', 'Indore'].map((b) => (
                <option key={b} value={b}>
                  {b}
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
