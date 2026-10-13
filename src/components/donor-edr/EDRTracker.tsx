import React from 'react';
import { User, CheckCircle2 } from 'lucide-react';
import { DonorData, TabItem } from './types';

interface EDRTrackerProps {
  donor: DonorData;
  tabs: TabItem[];
}

export default function EDRTracker({ donor, tabs }: EDRTrackerProps) {
  const completedTabsList = donor.completedTabs || [];
  const completedCount = tabs.filter(
    (tab) =>
      completedTabsList.includes(tab.id) ||
      (!!tab.numericAlias && completedTabsList.includes(tab.numericAlias))
  ).length;
  const totalTabs = tabs.length || 1;
  const percentage = Math.min(100, Math.round((completedCount / totalTabs) * 100));

  const isMale = donor.donorType === 'Sperm' || donor.donorType === 'Male' || donor.gender === 'Male';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-3.5 flex-wrap">
          {/* Avatar / Passport photo thumbnail */}
          <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
            {donor.photoUrl ? (
              <img src={donor.photoUrl} alt="Donor thumbnail" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-slate-400" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-bold text-slate-800 tracking-wide uppercase">
                EDR Completion Tracker
              </h4>
              {donor.id && (
                <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-md">
                  ID: {donor.id}
                </span>
              )}
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {isMale ? 'Male (Sperm Donor)' : 'Female (Egg Donor)'}
              </span>
              {donor.branch && (
                <span className="text-xs font-medium text-slate-500">
                  Branch: <span className="font-semibold text-slate-700">{donor.branch}</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {completedCount} of {totalTabs} sections verified & saved to database
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {percentage === 100 && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          <span className="text-base font-extrabold text-blue-600 font-mono">
            {percentage}% Complete
          </span>
        </div>
      </div>

      {/* Progress track */}
      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
        <div 
          className={`h-full transition-all duration-500 rounded-full ${
            percentage === 100 ? 'bg-emerald-500' : 'bg-blue-600'
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
