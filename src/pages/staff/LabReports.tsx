import { useState, useEffect } from 'react';
import { FlaskConical, Search, Filter, FileText, CheckCircle2, AlertCircle, Loader2, ArrowRight, Dna } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

export default function LabReports() {
  const navigate = useNavigate();
  const [donors, setDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/donors?limit=50');
      const list = res.data.data || res.data || [];
      setDonors(list);
    } catch (err) {
      console.error('Failed to load donor lab reports', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  const filteredDonors = donors.filter(d => {
    const matchesSearch = !searchTerm || 
      d.donorCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.bloodGroup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.donorType?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'All' || d.donorType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Laboratory & Genetic Clearances</h1>
          <p className="text-sm text-slate-500 mt-1">Review clinical diagnostic panels, infectious disease tests, karyotyping, and carrier screening.</p>
        </div>
        <button 
          onClick={() => navigate('/staff/donor/new')} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 text-sm shadow-sm shadow-blue-600/20 cursor-pointer transition-colors"
        >
          <FlaskConical className="w-4 h-4" /> Onboard Donor for Testing
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xs border border-slate-200"
      >
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Donor Code, Blood Group, Type..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Filter:</span>
            {['All', 'Sperm', 'Egg'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  filterType === t 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
            <p className="text-sm">Loading laboratory profiles...</p>
          </div>
        ) : filteredDonors.length === 0 ? (
          <div className="p-16 text-center text-slate-500">
            <FlaskConical className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="font-semibold text-slate-800">No Laboratory Records Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              There are currently no registered donors in the database to display laboratory reports for.
            </p>
            <button
              onClick={() => navigate('/staff/donor/new')}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Onboard first donor <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold text-xs border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Donor Code</th>
                  <th className="px-6 py-3.5">Gamete Type</th>
                  <th className="px-6 py-3.5">Blood Group</th>
                  <th className="px-6 py-3.5">Medical Clearance</th>
                  <th className="px-6 py-3.5">Genetic Clearance</th>
                  <th className="px-6 py-3.5">Lifecycle Status</th>
                  <th className="px-6 py-3.5 text-right">EDR Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDonors.map((donor) => {
                  const isMedicalCleared = donor.medicalClearance === true;
                  const isGeneticCleared = donor.geneticClearance === true;

                  return (
                    <tr key={donor._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <FlaskConical className="w-4 h-4 text-blue-500" />
                          <span>{donor.donorCode}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-700">{donor.donorType || 'Sperm'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          {donor.bloodGroup}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isMedicalCleared 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {isMedicalCleared ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                          {isMedicalCleared ? 'Cleared' : 'Pending Tests'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isGeneticCleared 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          <Dna className="w-3.5 h-3.5" />
                          {isGeneticCleared ? 'Carrier Screened' : 'Pending Karyotyping'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                          {donor.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button 
                          onClick={() => navigate(`/staff/donor/${donor._id}?tab=laboratory-tests`)} 
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                        >
                          View Lab Tests
                        </button>
                        <span className="text-slate-300">|</span>
                        <button 
                          onClick={() => navigate(`/staff/donor/${donor._id}?tab=genetic-screening`)} 
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                        >
                          Genetics
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
