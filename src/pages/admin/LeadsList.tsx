
import { useState, useEffect } from 'react';
import { Building2, Search, Filter, Mail, Phone, Loader2, MessageSquare, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import api from '../../lib/api';
import Pagination from '../../components/Pagination';

export default function LeadsList() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchLeads = async (currentPage = page, search = searchTerm) => {
    setLoading(true);
    try {
      const response = await api.get(`/crm/leads?page=${currentPage}&limit=10&search=${search}`);
      if (response.data && response.data.data) {
        setLeads(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.total);
      } else {
        setLeads(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch leads", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchLeads(page, searchTerm);
    }, 300);
    return () => clearTimeout(delay);
  }, [page, searchTerm]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/crm/leads/${id}/status`, { status: newStatus });
      fetchLeads();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const filteredLeads = leads;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Partnership Requests</h1>
          <p className="text-sm text-slate-500 mt-1">Manage onboarding for new hospital and clinic partners.</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-200"
      >
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search hospitals or contacts..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 cursor-pointer">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
             <div className="flex justify-center p-12">
               <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
             </div>
          ) : filteredLeads.length === 0 ? (
             <div className="p-12 text-center text-slate-500">No leads found.</div>
          ) : (
            <>
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Hospital Name</th>
                  <th className="px-6 py-4">Contact Person</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Message</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-slate-900">{lead.hospitalName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="font-medium text-slate-900">{lead.contactPerson}</div>
                      <div className="text-xs text-slate-500 break-all">{lead.email}</div>
                      <div className="text-xs text-slate-500">{lead.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{lead.location}</td>
                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={lead.message}>
                      {lead.message || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 ${
                          lead.status === 'Onboarded' ? 'bg-green-100 text-green-700' : 
                          lead.status === 'In Progress' ? 'bg-amber-100 text-amber-700' : 
                          lead.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Onboarded">Onboarded</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <a href={`mailto:${lead.email}`} className="inline-flex p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" title="Send Email">
                        <Mail className="w-4 h-4" />
                      </a>
                      <a href={`tel:${lead.phone}`} className="inline-flex p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer" title="Call">
                        <Phone className="w-4 h-4" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination currentPage={page} totalPages={totalPages} totalItems={totalItems} onPageChange={setPage} />
          </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
