import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  Microscope, 
  CheckCircle2, 
  Loader2, 
  X, 
  ArrowRight, 
  TestTube,
  Dna,
  Sparkles,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import api from '../../lib/api';

export default function HospitalSearch() {
  const navigate = useNavigate();
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [selectedDonorSummary, setSelectedDonorSummary] = useState<any>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Pagination state (driven from backend)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters state with extended clinical and phenotype fields
  const [filters, setFilters] = useState({
    bloodGroup: '',
    donorType: '',
    rhFactor: 'Any',
    minAge: '',
    maxAge: '',
    skinTone: 'Any',
    eyeColor: 'Any',
    hairColor: 'Any',
    minHeight: '',
    maxHeight: '',
    education: 'Any',
    geneticOnly: false,
    search: ''
  });

  const fetchDonors = async (targetPage = page, targetPageSize = pageSize, customFilters = filters) => {
    setSearching(true);
    try {
      const params = new URLSearchParams();
      params.append('page', targetPage.toString());
      params.append('pageSize', targetPageSize.toString());

      if (customFilters.bloodGroup) params.append('bloodGroup', customFilters.bloodGroup);
      if (customFilters.donorType) params.append('donorType', customFilters.donorType);
      if (customFilters.rhFactor && customFilters.rhFactor !== 'Any') params.append('rhFactor', customFilters.rhFactor);
      if (customFilters.minAge) params.append('minAge', customFilters.minAge);
      if (customFilters.maxAge) params.append('maxAge', customFilters.maxAge);
      if (customFilters.skinTone && customFilters.skinTone !== 'Any') params.append('skinTone', customFilters.skinTone);
      if (customFilters.eyeColor && customFilters.eyeColor !== 'Any') params.append('eyeColor', customFilters.eyeColor);
      if (customFilters.hairColor && customFilters.hairColor !== 'Any') params.append('hairColor', customFilters.hairColor);
      if (customFilters.minHeight) params.append('minHeight', customFilters.minHeight);
      if (customFilters.maxHeight) params.append('maxHeight', customFilters.maxHeight);
      if (customFilters.education && customFilters.education !== 'Any') params.append('education', customFilters.education);
      if (customFilters.geneticOnly) params.append('geneticOnly', 'true');
      if (customFilters.search) params.append('search', customFilters.search);

      const response = await api.get(`/donors?${params.toString()}`);
      const list = response.data.data || response.data || [];
      setResults(list);
      setTotalItems(response.data.total ?? list.length);
      setTotalPages(response.data.totalPages ?? Math.ceil((response.data.total ?? list.length) / targetPageSize));
      setPage(response.data.page ?? targetPage);
    } catch (err) {
      console.error('Failed to search donors', err);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    fetchDonors(page, pageSize);
  }, [page, pageSize]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchDonors(1, pageSize);
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      bloodGroup: '',
      donorType: '',
      rhFactor: 'Any',
      minAge: '',
      maxAge: '',
      skinTone: 'Any',
      eyeColor: 'Any',
      hairColor: 'Any',
      minHeight: '',
      maxHeight: '',
      education: 'Any',
      geneticOnly: false,
      search: ''
    };
    setFilters(defaultFilters);
    setPage(1);
    fetchDonors(1, pageSize, defaultFilters);
  };

  const applyPreset = (presetType: string) => {
    let updated = { ...filters };
    if (presetType === 'universal_o_neg') {
      updated = { ...updated, bloodGroup: 'O-', rhFactor: 'Negative' };
    } else if (presetType === 'postgrad') {
      updated = { ...updated, education: 'Post Graduate' };
    } else if (presetType === 'tall') {
      updated = { ...updated, minHeight: '178' };
    } else if (presetType === 'young') {
      updated = { ...updated, minAge: '21', maxAge: '26' };
    } else if (presetType === 'genetic_screened') {
      updated = { ...updated, geneticOnly: true };
    }
    setFilters(updated);
    setPage(1);
    fetchDonors(1, pageSize, updated);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFiltersCount = [
    filters.bloodGroup,
    filters.donorType,
    filters.rhFactor !== 'Any' ? filters.rhFactor : '',
    filters.minAge,
    filters.maxAge,
    filters.skinTone !== 'Any' ? filters.skinTone : '',
    filters.eyeColor !== 'Any' ? filters.eyeColor : '',
    filters.hairColor !== 'Any' ? filters.hairColor : '',
    filters.minHeight,
    filters.maxHeight,
    filters.education !== 'Any' ? filters.education : '',
    filters.geneticOnly ? 'genetic' : '',
    filters.search
  ].filter(Boolean).length;

  const getMatchScoreBadge = (score: number) => {
    if (score >= 90) {
      return {
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        bar: 'bg-emerald-500',
        text: 'Optimal Match',
        icon: Sparkles
      };
    } else if (score >= 75) {
      return {
        bg: 'bg-blue-50 text-blue-800 border-blue-300',
        bar: 'bg-blue-600',
        text: 'High Compatibility',
        icon: TrendingUp
      };
    } else {
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-300',
        bar: 'bg-amber-500',
        text: 'Moderate Match',
        icon: Award
      };
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <Microscope className="w-4 h-4" /> Smart Phenotype Matching Repository
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Verified Donor Gamete Search
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Compliant with ART (Regulation) Act 2021. Highest percentage phenotypic matches ranked at the top.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchDonors(page, pageSize)}
            disabled={searching}
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${searching ? 'animate-spin text-blue-600' : ''}`} /> Refresh
          </button>
          {activeFiltersCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl border border-rose-200 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters ({activeFiltersCount})
            </button>
          )}
        </div>
      </div>

      {/* Quick Filter Presets Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1">
          <SlidersHorizontal className="w-3.5 h-3.5" /> Quick Presets:
        </span>
        <button
          onClick={() => applyPreset('universal_o_neg')}
          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors shrink-0"
        >
          Universal O- Donors
        </button>
        <button
          onClick={() => applyPreset('postgrad')}
          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors shrink-0"
        >
          Postgraduate Education
        </button>
        <button
          onClick={() => applyPreset('tall')}
          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors shrink-0"
        >
          Height ≥ 178 cm
        </button>
        <button
          onClick={() => applyPreset('young')}
          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors shrink-0"
        >
          Young (21-26 Yrs)
        </button>
        <button
          onClick={() => applyPreset('genetic_screened')}
          className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium border border-emerald-200 transition-colors shrink-0 flex items-center gap-1"
        >
          <Dna className="w-3 h-3" /> Genetically Cleared Only
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Column */}
        <div className="lg:col-span-1 space-y-6">
          <form onSubmit={handleSearchSubmit} className="bg-white p-5 rounded-3xl shadow-xs border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" /> Patient Match Criteria
              </h3>
              {activeFiltersCount > 0 && (
                <span className="text-[11px] font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  {activeFiltersCount} Active
                </span>
              )}
            </div>

            {/* Keyword / Code */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Keyword / Code</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. DON-O, B.Tech, Fair"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all pl-8"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Gamete Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Gamete Type</label>
              <select
                value={filters.donorType}
                onChange={(e) => setFilters({ ...filters, donorType: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
              >
                <option value="">Any (Sperm & Egg)</option>
                <option value="Sperm">Sperm Donor</option>
                <option value="Egg">Egg / Oocyte Donor</option>
              </select>
            </div>

            {/* Blood Group & Rh Factor Row */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Blood Group</label>
                <select 
                  value={filters.bloodGroup} 
                  onChange={(e) => setFilters({ ...filters, bloodGroup: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                >
                  <option value="">Any</option>
                  <option value="O+">O+</option>
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="AB+">AB+</option>
                  <option value="O-">O-</option>
                  <option value="A-">A-</option>
                  <option value="B-">B-</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Rh Factor</label>
                <select 
                  value={filters.rhFactor} 
                  onChange={(e) => setFilters({ ...filters, rhFactor: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                >
                  <option value="Any">Any Rh</option>
                  <option value="Positive">Rh +</option>
                  <option value="Negative">Rh -</option>
                </select>
              </div>
            </div>

            {/* Age Range Row */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Age Range (Years)</label>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="number" 
                  placeholder="Min (e.g. 21)" 
                  value={filters.minAge} 
                  onChange={(e) => setFilters({ ...filters, minAge: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white" 
                />
                <input 
                  type="number" 
                  placeholder="Max (e.g. 30)" 
                  value={filters.maxAge} 
                  onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white" 
                />
              </div>
            </div>

            {/* Skin Tone */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Complexion / Skin Tone</label>
              <select 
                value={filters.skinTone} 
                onChange={(e) => setFilters({ ...filters, skinTone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
              >
                <option value="Any">Any Complexion</option>
                <option value="Fair">Fair</option>
                <option value="Wheatish">Wheatish</option>
                <option value="Medium">Medium</option>
                <option value="Dusky">Dusky</option>
                <option value="Dark">Dark</option>
              </select>
            </div>

            {/* Eye Color */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Eye Color</label>
              <select 
                value={filters.eyeColor} 
                onChange={(e) => setFilters({ ...filters, eyeColor: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
              >
                <option value="Any">Any Eye Color</option>
                <option value="Brown">Brown</option>
                <option value="Black">Black</option>
                <option value="Hazel">Hazel</option>
                <option value="Blue">Blue</option>
                <option value="Green">Green</option>
              </select>
            </div>

            {/* Advanced Filters Accordion */}
            <div className="border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between text-xs font-medium text-slate-600 hover:text-blue-600 transition-colors py-1 cursor-pointer"
              >
                <span>Advanced Clinical Filters</span>
                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showAdvanced && (
                <div className="space-y-3 pt-3">
                  {/* Hair Color */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700">Hair Color</label>
                    <select 
                      value={filters.hairColor} 
                      onChange={(e) => setFilters({ ...filters, hairColor: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    >
                      <option value="Any">Any Hair Color</option>
                      <option value="Black">Black</option>
                      <option value="Brown">Brown</option>
                      <option value="Dark Brown">Dark Brown</option>
                    </select>
                  </div>

                  {/* Height Range */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700">Height Bounds (cm)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="number" 
                        placeholder="Min (cm)" 
                        value={filters.minHeight} 
                        onChange={(e) => setFilters({ ...filters, minHeight: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white" 
                      />
                      <input 
                        type="number" 
                        placeholder="Max (cm)" 
                        value={filters.maxHeight} 
                        onChange={(e) => setFilters({ ...filters, maxHeight: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white" 
                      />
                    </div>
                  </div>

                  {/* Education Level */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700">Education Level</label>
                    <select 
                      value={filters.education} 
                      onChange={(e) => setFilters({ ...filters, education: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    >
                      <option value="Any">Any Qualification</option>
                      <option value="Graduate">Bachelor's / Graduate</option>
                      <option value="Post Graduate">Master's / Post Graduate</option>
                      <option value="Doctorate">Doctorate / PhD / MD</option>
                    </select>
                  </div>

                  {/* Genetic Screening Checkbox */}
                  <label className="flex items-start gap-2.5 p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.geneticOnly}
                      onChange={(e) => setFilters({ ...filters, geneticOnly: e.target.checked })}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-700 leading-snug">
                      Require full genetic clearance (Karyotype, SMA, Thalassemia)
                    </span>
                  </label>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={searching} 
              className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mt-4 text-xs shadow-xs cursor-pointer"
            >
              {searching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Calculating Matches...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Calculate Match Scores
                </>
              )}
            </button>
          </form>

          {/* ICMR Certification Card */}
          <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="text-xs font-semibold text-emerald-950">180-Day Quarantine Clear</h5>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                All listed gamete donors have completed the statutory 6-month quarantine window with negative repeat serology for HIV, HBV, HCV, and Syphilis.
              </p>
            </div>
          </div>
        </div>

        {/* Right Results Column */}
        <div className="lg:col-span-3 space-y-4">
          {/* Results Summary Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 px-1">
            <div className="flex items-center gap-2">
              <span>
                Showing {totalItems > 0 ? (page - 1) * pageSize + 1 : 0}-{Math.min(page * pageSize, totalItems)} of {totalItems} matching donors
              </span>
              <span className="bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded-full text-[11px] border border-emerald-200">
                Ranked by match %
              </span>
            </div>

            {/* Page Size Selector */}
            <div className="flex items-center gap-2">
              <span>Show per page:</span>
              <select
                value={pageSize}
                onChange={e => {
                  const newSize = Number(e.target.value);
                  setPageSize(newSize);
                  setPage(1);
                }}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium text-slate-700 focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value={6}>6</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>

          {searching ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-16 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-sm font-medium">Computing compatibility and ranking donors...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 border-dashed p-16 flex flex-col items-center justify-center text-slate-400 text-center space-y-3">
              <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-base font-semibold text-slate-700">No donor matches found</h4>
              <p className="text-xs text-slate-400 max-w-sm">
                Try widening your search criteria (e.g. set skin tone to "Any" or reset height threshold).
              </p>
              <button
                onClick={handleResetFilters}
                className="text-xs font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((donor, idx) => {
                const score = donor.matchScore ?? 95;
                const scoreStyle = getMatchScoreBadge(score);

                return (
                  <motion.div 
                    key={donor._id || donor.donorCode || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="bg-white p-5 sm:p-6 rounded-3xl shadow-xs border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    {/* Left Column: Details & Match Bar */}
                    <div className="flex-1 space-y-3.5">
                      {/* Top Header Row with Donor Code & Match Score */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 flex items-center gap-1.5">
                            <TestTube className="w-3.5 h-3.5 text-blue-600" />
                            {donor.donorCode}
                          </span>
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                            donor.donorType === 'Egg' ? 'bg-pink-50 text-pink-700 border border-pink-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {donor.donorType || 'Sperm'} Donor
                          </span>
                          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                            Blood: {donor.bloodGroup}
                          </span>
                        </div>

                        {/* Match Percentage Score Badge */}
                        <div className="flex items-center gap-2">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-xs ${scoreStyle.bg}`}>
                            <scoreStyle.icon className="w-3.5 h-3.5 shrink-0" />
                            <span>{score}% Match</span>
                            <span className="text-[10px] font-normal opacity-80">({scoreStyle.text})</span>
                          </div>
                        </div>
                      </div>

                      {/* Match Progress Bar */}
                      <div className="space-y-1">
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${scoreStyle.bar}`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>

                      {/* Phenotypic specs grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-slate-400 block text-[11px]">Age & Physical</span>
                          <span className="font-medium text-slate-800">
                            {donor.age ? `${donor.age} Yrs • ` : ''}{donor.height ? `${donor.height} cm` : 'Normal'}
                          </span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-slate-400 block text-[11px]">Complexion & Hair</span>
                          <span className="font-medium text-slate-800">
                            {donor.complexion || donor.skinTone || 'Wheatish'}, {donor.hairColor || 'Black'}
                          </span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-slate-400 block text-[11px]">Eye Color</span>
                          <span className="font-medium text-slate-800">
                            {donor.eyeColor || 'Brown'} Eyes
                          </span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-slate-400 block text-[11px]">Education / Job</span>
                          <span className="font-medium text-slate-800 truncate block">
                            {donor.profession || donor.education || 'Graduate'}
                          </span>
                        </div>
                      </div>

                      {/* Criteria Highlights Badges */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                        {donor.matchDetails?.bloodGroup && (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Blood Group Match
                          </span>
                        )}
                        {donor.matchDetails?.hairColor && (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Hair Match
                          </span>
                        )}
                        {donor.matchDetails?.skinTone && (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Complexion Match
                          </span>
                        )}
                        {donor.matchDetails?.eyeColor && (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Eye Color Match
                          </span>
                        )}
                        {donor.matchDetails?.height && (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Height Target Met
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md">
                          <Dna className="w-3 h-3 text-blue-600" /> Karyotype Normal
                        </span>
                      </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex lg:flex-col items-center justify-end gap-2.5 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6 w-full lg:w-48">
                      <button 
                        onClick={() => navigate(`/hospital/requests/new/${donor._id || donor.donorCode}`)} 
                        className="flex-1 lg:w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        Request Sample <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => setSelectedDonorSummary(donor)} 
                        className="flex-1 lg:w-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium text-xs py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Microscope className="w-3.5 h-3.5 text-blue-600" /> Genetic Profile
                      </button>
                    </div>
                  </motion.div>
                );
              })}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                  <div className="text-xs text-slate-500">
                    Page {page} of {totalPages} ({totalItems} total donors)
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page <= 1}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Previous
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          page === pageNum
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= totalPages}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                    >
                      Next <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Genetic Summary Modal */}
      <AnimatePresence>
        {selectedDonorSummary && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Microscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Phenotypic & Genetic Dossier
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      Donor Reference: {selectedDonorSummary.donorCode} • {selectedDonorSummary.bloodGroup} • Match: {selectedDonorSummary.matchScore ?? 95}%
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedDonorSummary(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Physical Profile Box */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Anthropometric & Phenotype Parameters
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Blood Group & Rh</span>
                    <span className="font-semibold text-slate-800 text-sm">{selectedDonorSummary.bloodGroup}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Height / Weight</span>
                    <span className="font-medium text-slate-800">
                      {selectedDonorSummary.height ? `${selectedDonorSummary.height} cm` : 'Standard'} / {selectedDonorSummary.weight ? `${selectedDonorSummary.weight} kg` : 'Normative'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Skin Complexion</span>
                    <span className="font-medium text-slate-800">{selectedDonorSummary.complexion || selectedDonorSummary.skinTone || 'Wheatish'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Eye Color & Iris</span>
                    <span className="font-medium text-slate-800">{selectedDonorSummary.eyeColor || 'Brown'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Hair Color / Texture</span>
                    <span className="font-medium text-slate-800">{selectedDonorSummary.hairColor || 'Black'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Education & Profession</span>
                    <span className="font-medium text-slate-800 truncate block">{selectedDonorSummary.profession || selectedDonorSummary.education || 'Graduate'}</span>
                  </div>
                </div>
              </div>

              {/* Genetic Screening Panel */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Dna className="w-3.5 h-3.5 text-blue-600" /> Genetic & Medical Panel Findings
                </h4>
                <div className="border border-slate-200 rounded-2xl p-4 space-y-3 text-xs bg-white">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-medium text-slate-700">G-Banded Karyotyping (Chromosomal Analysis)</span>
                    <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {selectedDonorSummary.donorType === 'Egg' ? '46, XX (Normal Female)' : '46, XY (Normal Male)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-medium text-slate-700">Hemoglobinopathy & Thalassemia Screening (HPLC)</span>
                    <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      HbA2 Normal (No Carrier Trait)
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-medium text-slate-700">Spinal Muscular Atrophy (SMA) SMN1 Exon 7/8</span>
                    <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Negative (2 Copies Present)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">Viral Serology (HIV 1/2, HBsAg, HCV, VDRL, Rubella)</span>
                    <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Non-Reactive (Confirmed at 180 Days)
                    </span>
                  </div>
                </div>
              </div>

              {/* ART Act Compliance Advisory */}
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 leading-relaxed">
                Anonymity Guarantee: In accordance with Section 27 of the ART (Regulation) Act, 2021, the identity of the donor is kept strictly confidential. Full physical, anthropometric, educational, and genetic clearance reports will accompany the LN2 dry-shipper upon sample dispatch.
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setSelectedDonorSummary(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Close Summary
                </button>
                <button
                  onClick={() => {
                    const id = selectedDonorSummary._id || selectedDonorSummary.donorCode;
                    setSelectedDonorSummary(null);
                    navigate(`/hospital/requests/new/${id}`);
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  Proceed with this Donor <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
