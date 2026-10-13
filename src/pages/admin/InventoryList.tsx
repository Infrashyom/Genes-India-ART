import { useState, useEffect, useMemo } from 'react';
import { 
  Snowflake, 
  Search, 
  Filter, 
  AlertTriangle, 
  Loader2, 
  X, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw, 
  CheckCircle2, 
  ShieldCheck, 
  Eye, 
  Building2, 
  UserCheck, 
  Layers,
  Sparkles,
  ExternalLink,
  SlidersHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../lib/api';
import Pagination from '../../components/Pagination';

interface InventoryItem {
  _id: string;
  vialId: string;
  tank: string;
  canister: string;
  cane: string;
  colorCode?: string;
  donor?: {
    _id: string;
    donorCode: string;
    donorType?: string;
    bloodGroup: string;
    age?: number;
    height?: number;
    weight?: number;
    eyeColor?: string;
    hairColor?: string;
    complexion?: string;
    skinTone?: string;
    branch?: string;
    education?: string;
    profession?: string;
    medicalClearance?: boolean;
    geneticClearance?: boolean;
    status?: string;
  };
  status: string;
  freezeDate: string;
}

interface FilterState {
  bloodGroup: string;
  donorType: string;
  status: string;
  tank: string;
  skinTone: string;
  eyeColor: string;
  hairColor: string;
  ageRange: string;
  medicalClearance: string;
  geneticClearance: string;
  branch: string;
}

const INITIAL_FILTERS: FilterState = {
  bloodGroup: '',
  donorType: '',
  status: '',
  tank: '',
  skinTone: '',
  eyeColor: '',
  hairColor: '',
  ageRange: '',
  medicalClearance: '',
  geneticClearance: '',
  branch: '',
};

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const SKIN_TONES = ['Fair', 'Wheatish', 'Medium', 'Dusky', 'Dark'];
const EYE_COLORS = ['Brown', 'Black', 'Blue', 'Hazel', 'Green', 'Grey'];
const HAIR_COLORS = ['Black', 'Dark Brown', 'Brown', 'Light Brown'];
const TANKS = ['A1', 'B2', 'CryoTank-01', 'CryoTank-02', 'CryoTank-03', 'CryoTank-04'];
const BRANCHES = ['Indore', 'Bhopal', 'Mumbai', 'Delhi', 'Bangalore'];

export default function InventoryList() {
  const location = useLocation();
  const isStaff = location.pathname.startsWith('/staff');

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch inventory from API with server-side query params
  const fetchInventory = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '25');
      if (searchTerm) params.append('search', searchTerm);
      if (filters.bloodGroup) params.append('bloodGroup', filters.bloodGroup);
      if (filters.donorType) params.append('donorType', filters.donorType);
      if (filters.status) params.append('status', filters.status);
      if (filters.tank) params.append('tank', filters.tank);
      if (filters.skinTone) params.append('skinTone', filters.skinTone);
      if (filters.eyeColor) params.append('eyeColor', filters.eyeColor);
      if (filters.hairColor) params.append('hairColor', filters.hairColor);
      if (filters.branch) params.append('branch', filters.branch);
      if (filters.medicalClearance) params.append('medicalClearance', filters.medicalClearance);
      if (filters.geneticClearance) params.append('geneticClearance', filters.geneticClearance);

      if (filters.ageRange) {
        if (filters.ageRange === '21-25') {
          params.append('ageMin', '21');
          params.append('ageMax', '25');
        } else if (filters.ageRange === '26-30') {
          params.append('ageMin', '26');
          params.append('ageMax', '30');
        } else if (filters.ageRange === '31-35') {
          params.append('ageMin', '31');
          params.append('ageMax', '35');
        } else if (filters.ageRange === '36+') {
          params.append('ageMin', '36');
        }
      }

      const response = await api.get(`/inventory?${params.toString()}`);
      if (response.data && Array.isArray(response.data.data)) {
        setInventory(response.data.data);
        setTotalPages(response.data.totalPages || 1);
        setTotalItems(response.data.total || 0);
      } else if (Array.isArray(response.data)) {
        setInventory(response.data);
        setTotalPages(1);
        setTotalItems(response.data.length);
      }
    } catch (err: any) {
      setError('Failed to fetch inventory.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [page, searchTerm, filters]);

  // Client-side filtering guarantee
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      // Search term
      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        const matchesVial = item.vialId?.toLowerCase().includes(s);
        const matchesTank = item.tank?.toLowerCase().includes(s);
        const matchesCanister = item.canister?.toLowerCase().includes(s);
        const matchesCane = item.cane?.toLowerCase().includes(s);
        const matchesDonorCode = item.donor?.donorCode?.toLowerCase().includes(s);
        const matchesBg = item.donor?.bloodGroup?.toLowerCase().includes(s);
        if (!matchesVial && !matchesTank && !matchesCanister && !matchesCane && !matchesDonorCode && !matchesBg) {
          return false;
        }
      }

      // Blood Group filter
      if (filters.bloodGroup && item.donor?.bloodGroup !== filters.bloodGroup) {
        return false;
      }

      // Donor Type filter
      if (filters.donorType) {
        const dType = item.donor?.donorType;
        if (dType && dType.toLowerCase() !== filters.donorType.toLowerCase()) {
          return false;
        }
      }

      // Status filter
      if (filters.status && item.status.toLowerCase() !== filters.status.toLowerCase()) {
        return false;
      }

      // Tank filter
      if (filters.tank && item.tank.toLowerCase() !== filters.tank.toLowerCase()) {
        return false;
      }

      // Skin Tone filter
      if (filters.skinTone) {
        const tone = item.donor?.skinTone || item.donor?.complexion;
        if (tone && tone.toLowerCase() !== filters.skinTone.toLowerCase()) {
          return false;
        }
      }

      // Eye Color filter
      if (filters.eyeColor && item.donor?.eyeColor && item.donor.eyeColor.toLowerCase() !== filters.eyeColor.toLowerCase()) {
        return false;
      }

      // Hair Color filter
      if (filters.hairColor && item.donor?.hairColor && item.donor.hairColor.toLowerCase() !== filters.hairColor.toLowerCase()) {
        return false;
      }

      // Branch filter
      if (filters.branch && item.donor?.branch && item.donor.branch.toLowerCase() !== filters.branch.toLowerCase()) {
        return false;
      }

      // Medical clearance filter
      if (filters.medicalClearance) {
        const expected = filters.medicalClearance === 'true';
        if (item.donor?.medicalClearance !== undefined && item.donor.medicalClearance !== expected) {
          return false;
        }
      }

      // Genetic clearance filter
      if (filters.geneticClearance) {
        const expected = filters.geneticClearance === 'true';
        if (item.donor?.geneticClearance !== undefined && item.donor.geneticClearance !== expected) {
          return false;
        }
      }

      // Age range filter
      if (filters.ageRange && item.donor?.age) {
        const age = item.donor.age;
        if (filters.ageRange === '21-25' && (age < 21 || age > 25)) return false;
        if (filters.ageRange === '26-30' && (age < 26 || age > 30)) return false;
        if (filters.ageRange === '31-35' && (age < 31 || age > 35)) return false;
        if (filters.ageRange === '36+' && age < 36) return false;
      }

      return true;
    });
  }, [inventory, searchTerm, filters]);

  const updateFilter = (key: keyof FilterState, val: string) => {
    setFilters(prev => ({ ...prev, [key]: val }));
    setPage(1);
  };

  const clearAllFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSearchTerm('');
    setPage(1);
  };

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(Boolean).length;
  }, [filters]);

  // Active filter badges for display
  const activeFilterList = useMemo(() => {
    const list: { key: keyof FilterState; label: string; value: string }[] = [];
    if (filters.bloodGroup) list.push({ key: 'bloodGroup', label: 'Blood Group', value: filters.bloodGroup });
    if (filters.donorType) list.push({ key: 'donorType', label: 'Type', value: `${filters.donorType} Donor` });
    if (filters.status) list.push({ key: 'status', label: 'Status', value: filters.status });
    if (filters.tank) list.push({ key: 'tank', label: 'Storage Tank', value: filters.tank });
    if (filters.skinTone) list.push({ key: 'skinTone', label: 'Skin Tone', value: filters.skinTone });
    if (filters.eyeColor) list.push({ key: 'eyeColor', label: 'Eye Color', value: filters.eyeColor });
    if (filters.hairColor) list.push({ key: 'hairColor', label: 'Hair Color', value: filters.hairColor });
    if (filters.ageRange) list.push({ key: 'ageRange', label: 'Age', value: `${filters.ageRange} yrs` });
    if (filters.branch) list.push({ key: 'branch', label: 'Branch', value: filters.branch });
    if (filters.medicalClearance) list.push({ key: 'medicalClearance', label: 'Medical Clearance', value: filters.medicalClearance === 'true' ? 'Cleared' : 'Pending' });
    if (filters.geneticClearance) list.push({ key: 'geneticClearance', label: 'Genetic Clearance', value: filters.geneticClearance === 'true' ? 'Cleared' : 'Pending' });
    return list;
  }, [filters]);

  // Inventory stats
  const stats = useMemo(() => {
    return {
      total: inventory.length,
      available: inventory.filter(i => i.status === 'Available').length,
      reserved: inventory.filter(i => i.status === 'Reserved').length,
      quarantine: inventory.filter(i => i.status === 'Quarantine').length,
      dispatched: inventory.filter(i => i.status === 'Dispatched').length,
    };
  }, [inventory]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900">Donor Cryobank Inventory</h1>
            {isStaff ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                Staff Portal
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                Admin Portal
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Browse, filter, and track all cryopreserved gametes and vials with mandatory screening criteria.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total In View', val: filteredInventory.length, color: 'text-blue-700', bg: 'bg-blue-50/50', border: 'border-blue-200' },
          { label: 'Available Vials', val: stats.available, color: 'text-emerald-700', bg: 'bg-emerald-50/50', border: 'border-emerald-200' },
          { label: 'Reserved Vials', val: stats.reserved, color: 'text-amber-700', bg: 'bg-amber-50/50', border: 'border-amber-200' },
          { label: 'In Quarantine', val: stats.quarantine, color: 'text-orange-700', bg: 'bg-orange-50/50', border: 'border-orange-200' },
          { label: 'Dispatched', val: stats.dispatched, color: 'text-purple-700', bg: 'bg-purple-50/50', border: 'border-purple-200' }
        ].map((stat, i) => (
          <div key={i} className={`p-4 rounded-xl shadow-xs border ${stat.border} ${stat.bg} transition-all`}>
            <p className="text-xs font-medium text-slate-500 mb-1">{stat.label}</p>
            <h3 className={`text-2xl font-bold ${stat.color}`}>{stat.val}</h3>
          </div>
        ))}
      </div>

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
      >
        {/* Search & Quick Controls Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search Vial ID, Tank, Donor ID, Blood Group..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-xs"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Gamete Type Filter */}
            <div className="flex bg-slate-200/70 p-1 rounded-lg text-xs font-semibold shrink-0">
              <button
                onClick={() => updateFilter('donorType', '')}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${filters.donorType === '' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                All Gametes
              </button>
              <button
                onClick={() => updateFilter('donorType', 'Sperm')}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${filters.donorType === 'Sperm' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Sperm
              </button>
              <button
                onClick={() => updateFilter('donorType', 'Egg')}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${filters.donorType === 'Egg' ? 'bg-white text-purple-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Egg
              </button>
            </div>

            {/* Filter Toggle Button */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3.5 py-2 border rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                showFilters || activeFiltersCount > 0 
                  ? 'bg-blue-50 border-blue-300 text-blue-700' 
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
              {showFilters ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
            </button>
          </div>

          {/* Quick Blood Group Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1 shrink-0">Blood Group:</span>
            <button
              onClick={() => updateFilter('bloodGroup', '')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer shrink-0 font-medium ${
                filters.bloodGroup === '' 
                  ? 'bg-blue-600 text-white font-bold' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              All BG
            </button>
            {BLOOD_GROUPS.map((bg) => (
              <button
                key={bg}
                onClick={() => updateFilter('bloodGroup', filters.bloodGroup === bg ? '' : bg)}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer shrink-0 font-semibold ${
                  filters.bloodGroup === bg
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-rose-300 hover:text-rose-700'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>

          {/* Expandable Comprehensive Filter Drawer */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden pt-3 border-t border-slate-200/80"
              >
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Filter className="w-3.5 h-3.5 text-blue-600" />
                      Mandatory & Clinical Donor Screening Filters
                    </span>
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={clearAllFilters}
                        className="text-xs text-rose-600 hover:text-rose-800 font-medium hover:underline cursor-pointer"
                      >
                        Reset All Filters ({activeFiltersCount})
                      </button>
                    )}
                  </div>

                  {/* Filter Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
                    {/* 1. Blood Group */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Blood Group (Mandatory)</label>
                      <select 
                        value={filters.bloodGroup} 
                        onChange={(e) => updateFilter('bloodGroup', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">All Blood Groups</option>
                        {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                      </select>
                    </div>

                    {/* 2. Donor Type */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Donor Type</label>
                      <select 
                        value={filters.donorType} 
                        onChange={(e) => updateFilter('donorType', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">All Gamete Types</option>
                        <option value="Sperm">Sperm Donor (Male)</option>
                        <option value="Egg">Egg Donor (Female)</option>
                      </select>
                    </div>

                    {/* 3. Inventory Status */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Vial Status</label>
                      <select 
                        value={filters.status} 
                        onChange={(e) => updateFilter('status', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">All Statuses</option>
                        <option value="Available">Available</option>
                        <option value="Reserved">Reserved</option>
                        <option value="Quarantine">Quarantine</option>
                        <option value="Dispatched">Dispatched</option>
                      </select>
                    </div>

                    {/* 4. Storage Tank */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Storage Tank</label>
                      <select 
                        value={filters.tank} 
                        onChange={(e) => updateFilter('tank', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">All Tanks</option>
                        {TANKS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>

                    {/* 5. Complexion / Skin Tone */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Complexion / Skin Tone</label>
                      <select 
                        value={filters.skinTone} 
                        onChange={(e) => updateFilter('skinTone', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">All Skin Tones</option>
                        {SKIN_TONES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>

                    {/* 6. Eye Color */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Eye Color</label>
                      <select 
                        value={filters.eyeColor} 
                        onChange={(e) => updateFilter('eyeColor', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">All Eye Colors</option>
                        {EYE_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    {/* 7. Hair Color */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Hair Color</label>
                      <select 
                        value={filters.hairColor} 
                        onChange={(e) => updateFilter('hairColor', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">All Hair Colors</option>
                        {HAIR_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    {/* 8. Age Range */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Age Range</label>
                      <select 
                        value={filters.ageRange} 
                        onChange={(e) => updateFilter('ageRange', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">All Ages (18-40)</option>
                        <option value="21-25">21 - 25 years</option>
                        <option value="26-30">26 - 30 years</option>
                        <option value="31-35">31 - 35 years</option>
                        <option value="36+">36+ years</option>
                      </select>
                    </div>

                    {/* 9. Medical Clearance */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Medical Clearance</label>
                      <select 
                        value={filters.medicalClearance} 
                        onChange={(e) => updateFilter('medicalClearance', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">All Statuses</option>
                        <option value="true">Cleared (Fit)</option>
                        <option value="false">Pending / Deferred</option>
                      </select>
                    </div>

                    {/* 10. Genetic Clearance */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Genetic Screening</label>
                      <select 
                        value={filters.geneticClearance} 
                        onChange={(e) => updateFilter('geneticClearance', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">All Statuses</option>
                        <option value="true">Cleared (Normal)</option>
                        <option value="false">Pending / Testing</option>
                      </select>
                    </div>

                    {/* 11. Branch */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Facility Branch</label>
                      <select 
                        value={filters.branch} 
                        onChange={(e) => updateFilter('branch', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">All Branches</option>
                        {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filter Pills Row */}
          {activeFilterList.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-[11px] text-slate-500 font-semibold">Active Filters ({activeFilterList.length}):</span>
              {activeFilterList.map((item) => (
                <span 
                  key={item.key}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-100/70 text-blue-800 font-medium text-xs border border-blue-200"
                >
                  <span className="text-blue-600 text-[10px] font-bold">{item.label}:</span>
                  <span>{item.value}</span>
                  <button 
                    onClick={() => updateFilter(item.key, '')}
                    className="hover:text-blue-950 p-0.5 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={clearAllFilters}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold underline cursor-pointer ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results Count Banner */}
        <div className="px-6 py-2.5 bg-slate-100/60 border-b border-slate-200 flex justify-between items-center text-xs text-slate-600">
          <div>
            Showing <span className="font-bold text-slate-900">{filteredInventory.length}</span> cryopreserved sample vial(s)
            {activeFilterList.length > 0 && <span className="text-slate-500"> matching selected criteria</span>}
          </div>
          <div className="text-slate-500">
            Storage Standard: Liquid Nitrogen (-196°C)
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-xs text-slate-500 font-medium">Filtering cryobank inventory...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500 text-sm">{error}</div>
          ) : filteredInventory.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <Snowflake className="w-12 h-12 mx-auto text-slate-300 animate-pulse" />
              <p className="font-bold text-slate-700">No inventory matches your active filter criteria.</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Try clearing some filters (such as blood group, donor type, or physical traits) to see more stored vials.
              </p>
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3.5">Vial ID & Location</th>
                    <th className="px-6 py-3.5">Donor Code & Type</th>
                    <th className="px-6 py-3.5">Blood Group</th>
                    <th className="px-6 py-3.5">Phenotype & Traits</th>
                    <th className="px-6 py-3.5">Screening Clearance</th>
                    <th className="px-6 py-3.5">Freeze Date</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInventory.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/80 transition-colors group">
                      {/* Vial ID & Location */}
                      <td className="px-6 py-4 font-medium text-slate-900">
                        <div className="flex items-center gap-2">
                          <Snowflake className="w-4 h-4 text-blue-500 shrink-0" />
                          <span className="font-mono font-bold text-slate-900">{item.vialId}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <span className="font-medium text-slate-600">{item.tank}</span>
                          <span className="text-slate-400">&rsaquo;</span>
                          <span>Canister {item.canister}</span>
                          <span className="text-slate-400">&rsaquo;</span>
                          <span>Cane {item.cane}</span>
                        </div>
                      </td>

                      {/* Donor Code & Type */}
                      <td className="px-6 py-4">
                        {item.donor ? (
                          <div>
                            <Link 
                              to={isStaff ? `/staff/donors/${item.donor._id}` : `/admin/donors/${item.donor._id}`}
                              className="font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                            >
                              <span>{item.donor.donorCode}</span>
                              <ExternalLink className="w-3 h-3 opacity-60" />
                            </Link>
                            <div className="mt-1">
                              {item.donor.donorType === 'Egg' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-700">
                                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Egg Donor
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-700">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Sperm Donor
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-xs">Unassigned</span>
                        )}
                      </td>

                      {/* Blood Group Badge */}
                      <td className="px-6 py-4">
                        {item.donor?.bloodGroup ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
                            {item.donor.bloodGroup}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">N/A</span>
                        )}
                      </td>

                      {/* Phenotype & Traits */}
                      <td className="px-6 py-4 text-xs text-slate-600">
                        {item.donor ? (
                          <div className="space-y-0.5">
                            <div>
                              <span className="font-semibold text-slate-800">{item.donor.age ? `${item.donor.age} yrs` : 'Age N/A'}</span>
                              {item.donor.complexion || item.donor.skinTone ? (
                                <span> • {item.donor.complexion || item.donor.skinTone}</span>
                              ) : null}
                            </div>
                            <div className="text-slate-500 text-[11px]">
                              {item.donor.eyeColor && `${item.donor.eyeColor} Eyes`}
                              {item.donor.eyeColor && item.donor.hairColor && ' • '}
                              {item.donor.hairColor && `${item.donor.hairColor} Hair`}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No traits</span>
                        )}
                      </td>

                      {/* Screening Clearance */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="text-slate-500 text-[10px]">Medical:</span>
                            {item.donor?.medicalClearance ? (
                              <span className="inline-flex items-center gap-0.5 text-emerald-700 font-semibold text-[11px]">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Cleared
                              </span>
                            ) : (
                              <span className="text-amber-700 text-[11px] font-medium">Pending</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="text-slate-500 text-[10px]">Genetic:</span>
                            {item.donor?.geneticClearance ? (
                              <span className="inline-flex items-center gap-0.5 text-emerald-700 font-semibold text-[11px]">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Cleared
                              </span>
                            ) : (
                              <span className="text-slate-500 text-[11px]">Standard</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Freeze Date */}
                      <td className="px-6 py-4 text-xs text-slate-600">
                        {item.freezeDate ? new Date(item.freezeDate).toLocaleDateString() : 'N/A'}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          item.status === 'Available' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 
                          item.status === 'Reserved' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 
                          item.status === 'Quarantine' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 
                          'bg-purple-100 text-purple-700 border border-purple-200'
                        }`}>
                          {item.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">
                        {item.donor?._id ? (
                          <Link
                            to={isStaff ? `/staff/donors/${item.donor._id}` : `/admin/donors/${item.donor._id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View Donor</span>
                          </Link>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="p-4 border-t border-slate-200">
                <Pagination currentPage={page} totalPages={totalPages} totalItems={totalItems} onPageChange={setPage} />
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
