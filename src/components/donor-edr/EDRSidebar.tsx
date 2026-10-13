import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { TabItem } from './types';

interface EDRSidebarProps {
  tabs: TabItem[];
  activeTab: string;
  completedTabs: string[];
  onSelectTab: (tabId: string) => void;
}

export default function EDRSidebar({
  tabs,
  activeTab,
  completedTabs = [],
  onSelectTab,
}: EDRSidebarProps) {
  const completedCount = tabs.filter(
    (t) =>
      completedTabs.includes(t.id) ||
      (!!t.numericAlias && completedTabs.includes(t.numericAlias))
  ).length;

  return (
    <div className="w-full lg:w-72 shrink-0">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-6">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Record Sections</h4>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {completedCount}/{tabs.length} Saved
          </span>
        </div>

        <div className="p-2 space-y-1 max-h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id || (!!tab.numericAlias && activeTab === tab.numericAlias);
            const isSaved =
              completedTabs.includes(tab.id) ||
              (!!tab.numericAlias && completedTabs.includes(tab.numericAlias));

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  onSelectTab(tab.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold'
                    : isSaved
                    ? 'text-slate-800 hover:bg-slate-50 font-medium'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <tab.icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : isSaved ? 'text-emerald-500' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{tab.name}</span>
                </div>

                {/* Checkmark appears ONLY when details are saved to database */}
                {isSaved && (
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ml-1 ${
                      isActive ? 'text-white' : 'text-emerald-500'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
