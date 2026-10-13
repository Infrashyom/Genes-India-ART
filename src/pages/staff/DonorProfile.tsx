import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
  UserCircle,
  Activity,
  Heart,
  FlaskConical,
  Beaker,
  FileText,
  Phone,
  User,
  ShieldCheck,
  Microscope,
  BrainCircuit,
  Stethoscope,
  Snowflake,
  ArrowLeft,
  UserCheck,
} from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { DonorData, TabItem } from '../../components/donor-edr/types';
import EDRTracker from '../../components/donor-edr/EDRTracker';
import EDRSidebar from '../../components/donor-edr/EDRSidebar';
import EDRTabContent from '../../components/donor-edr/EDRTabContent';

const TAB_ALIAS_MAP: Record<string, string> = {
  '1': 'basic-registration',
  '2': 'personal-details',
  '3': 'identity-docs',
  '4': 'contact-info',
  '5': 'physical-traits',
  '6': 'lifestyle',
  '7': 'family-history',
  '8': 'medical-history',
  m1: 'reproductive-info',
  m2: 'semen-analysis',
  m3: 'male-hormones',
  m4: 'physical-exam',
  m5: 'laboratory-tests',
  m6: 'genetic-screening',
  f1: 'reproductive-history',
  f2: 'menstrual-history',
  f3: 'ovarian-assessment',
  f4: 'female-hormones',
  f5: 'female-laboratory-tests',
  f6: 'female-genetic-screening',
  f7: 'egg-retrieval',
  '10': 'psychological-assessment',
  '11': 'consent-legal',
  '12': 'doctor-review',
  '13': 'sample-collection',
  '14': 'cryobank-inventory',
  '15': 'hospital-allocation',
  '16': 'financial-insurance',
  '20': 'document-generation',
  '21': 'audit-trail',
};

const BASE_TABS: TabItem[] = [
  { id: 'basic-registration', name: 'Basic Registration', icon: User, numericAlias: '1' },
  { id: 'personal-details', name: 'Personal Details', icon: UserCircle, numericAlias: '2' },
  { id: 'identity-docs', name: 'Identity & Docs', icon: ShieldCheck, numericAlias: '3' },
  { id: 'contact-info', name: 'Contact Info', icon: Phone, numericAlias: '4' },
  { id: 'physical-traits', name: 'Physical Traits', icon: UserCircle, numericAlias: '5' },
  { id: 'lifestyle', name: 'Lifestyle', icon: Heart, numericAlias: '6' },
  { id: 'family-history', name: 'Family History', icon: Activity, numericAlias: '7' },
  { id: 'medical-history', name: 'Medical History', icon: Stethoscope, numericAlias: '8' },
];

const MALE_TABS: TabItem[] = [
  { id: 'reproductive-info', name: 'Reproductive Info', icon: Activity, numericAlias: 'm1' },
  { id: 'semen-analysis', name: 'Semen Analysis', icon: Microscope, numericAlias: 'm2' },
  { id: 'male-hormones', name: 'Male Hormones', icon: FlaskConical, numericAlias: 'm3' },
  { id: 'physical-exam', name: 'Physical Exam', icon: Stethoscope, numericAlias: 'm4' },
  { id: 'laboratory-tests', name: 'Laboratory Tests', icon: FlaskConical, numericAlias: 'm5' },
  { id: 'genetic-screening', name: 'Genetic Screening', icon: BrainCircuit, numericAlias: 'm6' },
];

const FEMALE_TABS: TabItem[] = [
  { id: 'reproductive-history', name: 'Reproductive History', icon: Activity, numericAlias: 'f1' },
  { id: 'menstrual-history', name: 'Menstrual History', icon: Heart, numericAlias: 'f2' },
  { id: 'ovarian-assessment', name: 'Ovarian Assessment', icon: Microscope, numericAlias: 'f3' },
  { id: 'female-hormones', name: 'Female Hormones', icon: FlaskConical, numericAlias: 'f4' },
  { id: 'female-laboratory-tests', name: 'Laboratory Tests', icon: FlaskConical, numericAlias: 'f5' },
  { id: 'female-genetic-screening', name: 'Genetic Screening', icon: BrainCircuit, numericAlias: 'f6' },
  { id: 'egg-retrieval', name: 'Egg Retrieval Protocol', icon: Stethoscope, numericAlias: 'f7' },
];

const COMMON_TABS: TabItem[] = [
  { id: 'psychological-assessment', name: 'Psychological Assessment', icon: Activity, numericAlias: '10' },
  { id: 'consent-legal', name: 'Consent & Legal Documents', icon: FileText, numericAlias: '11' },
  { id: 'doctor-review', name: 'Doctor Review & Decision', icon: Stethoscope, numericAlias: '12' },
  { id: 'sample-collection', name: 'Sample Collection Protocol', icon: Beaker, numericAlias: '13' },
  { id: 'cryobank-inventory', name: 'Cryobank Inventory & Storage', icon: Snowflake, numericAlias: '14' },
  { id: 'hospital-allocation', name: 'Hospital Allocation', icon: Activity, numericAlias: '15' },
  { id: 'financial-insurance', name: 'Financial & Insurance Record', icon: FileText, numericAlias: '16' },
  { id: 'document-generation', name: 'Document Generation', icon: FileText, numericAlias: '20' },
  { id: 'audit-trail', name: 'Audit Trail & Compliance Log', icon: Activity, numericAlias: '21' },
];

export default function DonorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const basePath = location.pathname.startsWith('/admin') ? '/admin/donors' : '/staff/donors';

  const [activeTab, setActiveTab] = useState('basic-registration');
  const [selectedGenderForNew, setSelectedGenderForNew] = useState<'Male' | 'Female' | null>(null);
  const [donor, setDonor] = useState<DonorData | null>(null);
  const [loading, setLoading] = useState(true);

  const isNew = id === 'new';

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      const resolved = TAB_ALIAS_MAP[tabParam] || tabParam;
      setActiveTab(resolved);
      if (tabParam !== resolved) {
        setSearchParams({ tab: resolved }, { replace: true });
      }
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (isNew) {
      if (!selectedGenderForNew) {
        setLoading(false);
        return;
      }

      const initialRegistrar = user?.name || 'Staff Registrar';

      setDonor({
        id: '',
        registrationDate: new Date().toISOString().split('T')[0],
        staffAssigned: initialRegistrar,
        branch: 'Indore',
        status: 'Active',
        photoUrl: '',
        firstName: '',
        lastName: '',
        donorType: selectedGenderForNew === 'Male' ? 'Sperm' : 'Egg',
        gender: selectedGenderForNew,
        dob: '',
        age: 25,
        nationality: 'Indian',
        occupation: 'Employed (Private Sector)',
        education: "Graduate / Bachelor's Degree",
        primaryDocType: 'Aadhaar Card',
        primaryDocNumber: '',
        primaryDocUrl: '',
        secondaryDocType: 'PAN Card',
        secondaryDocNumber: '',
        secondaryDocUrl: '',
        phone: '',
        address: '',
        height: undefined,
        weight: undefined,
        bloodGroup: 'O+',
        skinTone: '',
        eyeColor: '',
        hairColor: '',
        bodyType: '',
        completedTabs: [], // Starts with 0 completed tabs until saved to database
      });
      setLoading(false);
    } else if (id) {
      // Lazy fetch donor details by ID only when this page is loaded
      setLoading(true);
      api
        .get(`/donors/${id}`)
        .then((res) => {
          const d = res.data;
          const code = d.donorCode || d._id;

          // Determine completed tabs from DB or infer for legacy records
          let completed = d.completedTabs;
          if (!completed || !Array.isArray(completed)) {
            completed = ['1', '2', '3', '4', '5'];
          }

          setDonor({
            _id: d._id,
            id: code,
            registrationDate:
              d.registrationDate ||
              (d.createdAt
                ? new Date(d.createdAt).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0]),
            staffAssigned: d.staffAssigned || user?.name || 'Staff Registrar',
            branch: d.branch || 'Indore',
            status: d.status || 'Active',
            photoUrl: d.photoUrl || '',
            firstName: d.firstName || code,
            lastName: d.lastName || '',
            donorType: d.donorType || 'Sperm',
            gender: d.gender || (d.donorType === 'Sperm' ? 'Male' : 'Female'),
            dob: d.dob || '',
            age: d.age || 25,
            nationality: d.nationality || 'Indian',
            occupation: d.profession || d.occupation || 'Employed (Private Sector)',
            education: d.education || "Graduate / Bachelor's Degree",
            primaryDocType: d.primaryDocType || (d.voterId ? 'Voter ID' : 'Aadhaar Card'),
            primaryDocNumber: d.primaryDocNumber || d.aadhaar || d.voterId || '',
            primaryDocUrl: d.primaryDocUrl || d.aadhaarDoc || '',
            secondaryDocType: d.secondaryDocType || 'PAN Card',
            secondaryDocNumber: d.secondaryDocNumber || d.pan || '',
            secondaryDocUrl: d.secondaryDocUrl || d.panDoc || '',
            phone: d.phone || '',
            address: d.address || '',
            height: d.height || 172,
            weight: d.weight || 68,
            bloodGroup: d.bloodGroup || 'O+',
            skinTone: d.complexion || d.skinTone || 'Fair',
            eyeColor: d.eyeColor || 'Brown',
            completedTabs: completed,
            edrData: d.edrData || {},
          });
        })
        .catch((err) => {
          console.error('Failed to load donor record:', err);
        })
        .finally(() => setLoading(false));
    }
  }, [id, isNew, selectedGenderForNew, user]);

  const isMale =
    donor?.gender === 'Male' ||
    donor?.donorType === 'Sperm' ||
    donor?.donorType === 'Male' ||
    selectedGenderForNew === 'Male';

  const tabs: TabItem[] = [
    ...BASE_TABS,
    ...(isMale ? MALE_TABS : FEMALE_TABS),
    ...COMMON_TABS,
  ];

  const handleSaveSuccess = (updatedDonor: DonorData, nextTabId?: string) => {
    setDonor(updatedDonor);

    const resolvedNextTab = nextTabId
      ? TAB_ALIAS_MAP[nextTabId] || nextTabId
      : 'personal-details';

    if (isNew && (updatedDonor._id || updatedDonor.id)) {
      const destinationId = updatedDonor._id || updatedDonor.id;
      navigate(`${basePath}/${destinationId}?tab=${resolvedNextTab}`, {
        replace: true,
      });
      setActiveTab(resolvedNextTab);
    } else if (nextTabId) {
      setActiveTab(resolvedNextTab);
      setSearchParams({ tab: resolvedNextTab });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-600">Loading Donor EDR System...</p>
        </div>
      </div>
    );
  }

  // Gender selection modal for new registration
  if (isNew && !selectedGenderForNew) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <button
          onClick={() => navigate(basePath)}
          className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Donors List
        </button>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center max-w-2xl mx-auto">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Select Donor Category</h2>
          <p className="text-slate-500 text-sm mt-1 mb-8">
            Choose the clinical gamete donor profile type to initiate the Electronic Donor Record (EDR).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setSelectedGenderForNew('Male')}
              className="p-6 rounded-2xl border-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50/50 transition-all text-left flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Semen Bank
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1 group-hover:text-blue-600 transition-colors">
                  Male (Sperm Donor)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Semen analysis, andrological screening, cryopreservation quarantine.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold text-blue-600">
                Register Sperm Donor →
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedGenderForNew('Female')}
              className="p-6 rounded-2xl border-2 border-slate-200 hover:border-pink-600 hover:bg-pink-50/50 transition-all text-left flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-pink-600">
                  Oocyte Bank
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1 group-hover:text-pink-600 transition-colors">
                  Female (Egg Donor)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  AFC ovarian reserve, hormonal evaluation, stimulation & retrieval protocol.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold text-pink-600">
                Register Egg Donor →
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!donor) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>Donor profile record could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={() => navigate(basePath)}
            className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Donors List
          </button>

          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border ${
                donor.status === 'Active'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              Status: {donor.status || 'Active'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* EDR Completion Tracker Component */}
        <EDRTracker donor={donor} tabs={tabs} />

        {/* Two column layout: Sidebar + Active Tab Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Record Sections Sidebar Component */}
          <EDRSidebar
            tabs={tabs}
            activeTab={activeTab}
            completedTabs={donor.completedTabs || []}
            onSelectTab={(tabId) => {
              setActiveTab(tabId);
              setSearchParams({ tab: tabId });
            }}
          />

          {/* Active Tab Content Component */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 min-w-0">
            <EDRTabContent
              activeTab={activeTab}
              donor={donor}
              isNew={isNew}
              isMale={isMale}
              onSaveSuccess={handleSaveSuccess}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
