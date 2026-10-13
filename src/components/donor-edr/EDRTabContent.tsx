import React, { Suspense, lazy } from 'react';
import { DonorData, TabItem } from './types';
import { CLINICAL_TAB_CONFIGS } from './tabConfigs';

// Lazy loaded tab components so bundles are small and loaded only when needed
const BasicRegistrationTab = lazy(() => import('./tabs/BasicRegistrationTab'));
const PersonalDetailsTab = lazy(() => import('./tabs/PersonalDetailsTab'));
const IdentityDocsTab = lazy(() => import('./tabs/IdentityDocsTab'));
const ContactInfoTab = lazy(() => import('./tabs/ContactInfoTab'));
const PhysicalTraitsTab = lazy(() => import('./tabs/PhysicalTraitsTab'));
const LifestyleTab = lazy(() => import('./tabs/LifestyleTab'));
const FamilyHistoryTab = lazy(() => import('./tabs/FamilyHistoryTab'));
const MedicalHistoryTab = lazy(() => import('./tabs/MedicalHistoryTab'));
const DynamicFormTab = lazy(() => import('./tabs/DynamicFormTab'));
const AuditTrailTab = lazy(() => import('./tabs/AuditTrailTab'));
const DocumentGenerator = lazy(() => import('../staff/DocumentGenerator'));

interface EDRTabContentProps {
  activeTab: string;
  donor: DonorData;
  isNew: boolean;
  isMale: boolean;
  onSaveSuccess: (updatedDonor: DonorData, nextTabId?: string) => void;
}

export default function EDRTabContent({
  activeTab,
  donor,
  isNew,
  isMale,
  onSaveSuccess,
}: EDRTabContentProps) {
  const renderTab = () => {
    switch (activeTab) {
      case '1':
      case 'basic-registration':
        return (
          <BasicRegistrationTab
            donor={donor}
            isNew={isNew}
            onSaveSuccess={onSaveSuccess}
          />
        );
      case '2':
      case 'personal-details':
        return (
          <PersonalDetailsTab
            donor={donor}
            onSaveSuccess={onSaveSuccess}
          />
        );
      case '3':
      case 'identity-docs':
        return (
          <IdentityDocsTab
            donor={donor}
            onSaveSuccess={onSaveSuccess}
          />
        );
      case '4':
      case 'contact-info':
        return (
          <ContactInfoTab
            donor={donor}
            onSaveSuccess={onSaveSuccess}
          />
        );
      case '5':
      case 'physical-traits':
        return (
          <PhysicalTraitsTab
            donor={donor}
            onSaveSuccess={onSaveSuccess}
          />
        );
      case '6':
      case 'lifestyle':
        return (
          <LifestyleTab
            donor={donor}
            onSaveSuccess={onSaveSuccess}
          />
        );
      case '7':
      case 'family-history':
        return (
          <FamilyHistoryTab
            donor={donor}
            onSaveSuccess={onSaveSuccess}
          />
        );
      case '8':
      case 'medical-history':
        return (
          <MedicalHistoryTab
            donor={donor}
            isMale={isMale}
            onSaveSuccess={onSaveSuccess}
          />
        );
      case '20':
      case 'document-generation':
        return (
          <div className="space-y-6">
            <DocumentGenerator donor={donor as any} />
          </div>
        );
      case '21':
      case 'audit-trail':
        return (
          <AuditTrailTab
            donor={donor}
            onSaveSuccess={onSaveSuccess}
          />
        );
      default: {
        const config = CLINICAL_TAB_CONFIGS[activeTab];
        if (config) {
          return (
            <DynamicFormTab
              tabId={activeTab}
              title={config.title}
              description={config.description}
              fields={config.fields}
              nextTabId={config.nextTabId}
              donor={donor}
              onSaveSuccess={onSaveSuccess}
            />
          );
        }
        return (
          <div className="p-8 text-center text-slate-500">
            <p>Section configuration under preparation.</p>
          </div>
        );
      }
    }
  };

  return (
    <Suspense
      fallback={
        <div className="min-h-[360px] flex flex-col items-center justify-center p-8 text-slate-400">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-xs font-semibold text-slate-500">Loading section details...</p>
        </div>
      }
    >
      {renderTab()}
    </Suspense>
  );
}
