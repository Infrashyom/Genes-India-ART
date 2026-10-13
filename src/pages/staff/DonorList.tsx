import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronRight, UserPlus, ChevronDown, Loader2 } from 'lucide-react';
import api from '../../lib/api';
import Pagination from '../../components/Pagination';

interface Donor {
  _id: string;
  donorCode: string;
  donorType: string;
  status: string;
  bloodGroup: string;
  age: number;
}

export default function DonorList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await api.get(`/donors?page=${page}&search=${searchTerm}`);
        if (response.data.data) {
          setDonors(response.data.data);
          setTotalPages(response.data.totalPages);
          setTotalItems(response.data.total);
        } else if (Array.isArray(response.data)) {
          setDonors(response.data);
        }
      } catch (err: any) {
        setError('Failed to load donors. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonors();
  }, [page, searchTerm]);

  const filteredDonors = donors;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button 
          onClick={() => navigate('/staff/donors/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> New Registration
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by ID, Blood Group..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
            >
              <Filter className="w-4 h-4" /> Filters <ChevronDown className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 md:grid-cols-5 gap-4">
              <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700">
                <option value="">Donor Type (All)</option>
                <option value="Sperm">Sperm Donor</option>
                <option value="Egg">Egg Donor</option>
              </select>
              <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700">
                <option value="">Status (All)</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Active">Active</option>
              </select>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Donor Code</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Age / BG</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDonors.map((donor) => (
                <tr key={donor._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-blue-600">{donor.donorCode}</td>
                  <td className="px-6 py-4">
                    {donor.donorType === 'Egg' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span> Egg Donor
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span> Sperm Donor
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{donor.age} yrs • {donor.bloodGroup}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      donor.status.includes('Pending') ? 'bg-amber-100 text-amber-700' :
                      donor.status === 'Active' ? 'bg-green-100 text-green-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {donor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => navigate(`/staff/donors/${donor._id}`)}
                      className="text-slate-400 hover:text-blue-600 transition-colors p-2"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredDonors.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              No donors found matching your search.
            </div>
          )}
        </div>
        <Pagination currentPage={page} totalPages={totalPages} totalItems={totalItems} onPageChange={(p) => setPage(p)} />
      </div>
    </div>
  );
}
