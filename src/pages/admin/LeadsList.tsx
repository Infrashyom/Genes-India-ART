import { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Loader2, 
  MessageSquare, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Eye, 
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../../lib/api';
import Pagination from '../../components/Pagination';

const STATUS_OPTIONS = ['All', 'New', 'Contacted', 'In Progress', 'Onboarded', 'Rejected'] as const;

export default function LeadsList() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  const fetchLeads = async (currentPage = page, search = searchTerm, status = statusFilter) => {
    setLoading(true);
    try {
      const statusParam = status !== 'All' ? `&status=${encodeURIComponent(status)}` : '';
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
      const response = await api.get(`/crm/leads?page=${currentPage}&limit=10${statusParam}${searchParam}`);
      
      if (response.data && response.data.data) {
        setLeads(response.data.data);
        setTotalPages(response.data.totalPages || 1);
        setTotalItems(response.data.total || 0);
      } else {
        setLeads(response.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch leads", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchLeads(page, searchTerm, statusFilter);
    }, 250);
    return () => clearTimeout(delay);
  }, [page, searchTerm, statusFilter]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/crm/leads/${id}/status`, { status: newStatus });
      setLeads(prev => prev.map(l => l._id === id ? { ...l, status: newStatus } : l));
      if (selectedLead && selectedLead._id === id) {
        setSelectedLead((prev: any) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Onboarded':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'In Progress':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Contacted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Partnership Requests</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review and manage onboarding inquiries submitted by hospitals and fertility clinics.
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-xs">
          Total Inquiries: <span className="font-bold text-slate-900">{totalItems}</span>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
      >
        {/* Controls Bar: Search & Status Filters */}
        <div className="p-4 sm:p-5 border-b border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by hospital, contact, or city..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50"
              />
            </div>

            {/* Status Filter Pills */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-blue-600" /> Status:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {STATUS_OPTIONS.map((st) => (
                  <button
                    key={st}
                    onClick={() => { setStatusFilter(st); setPage(1); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      statusFilter === st
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Clean, Concise Main Table */}
        <div className="overflow-x-auto">
          {loading ? (
             <div className="flex flex-col items-center justify-center p-16 text-slate-400 gap-3">
               <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
               <p className="text-xs font-medium">Loading partnership requests...</p>
             </div>
          ) : leads.length === 0 ? (
             <div className="p-16 text-center text-slate-500 space-y-2">
               <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
               <p className="font-semibold text-slate-700">No partnership requests found</p>
               <p className="text-xs text-slate-400">
                 {statusFilter !== 'All' 
                   ? `There are no inquiries with status "${statusFilter}".`
                   : 'Inquiries submitted via the Hospital Partnership page will appear here.'}
               </p>
             </div>
          ) : (
            <>
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold text-xs border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Hospital / Clinic</th>
                  <th className="px-5 py-3.5">Contact Person</th>
                  <th className="px-5 py-3.5">Location</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => {
                  return (
                    <tr key={lead._id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Hospital Name & Date */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{lead.hospitalName}</span>
                            <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3" />
                              {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Recent'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Person */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-800">{lead.contactPerson}</div>
                        <div className="text-xs text-slate-500">{lead.email}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">{lead.phone}</div>
                      </td>

                      {/* Location */}
                      <td className="px-5 py-4">
                        <span className="text-xs font-medium text-slate-700 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {lead.location || 'N/A'}
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="px-5 py-4">
                        <select 
                          value={lead.status || 'New'}
                          onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer focus:ring-2 focus:ring-blue-500 ${getStatusBadge(lead.status)}`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Onboarded">Onboarded</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="View Full Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <a 
                            href={`mailto:${lead.email}`} 
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" 
                            title="Send Email"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                          <a 
                            href={`tel:${lead.phone}`} 
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer" 
                            title="Call"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Pagination currentPage={page} totalPages={totalPages} totalItems={totalItems} onPageChange={setPage} />
          </>
          )}
        </div>
      </motion.div>

      {/* Full Details Modal */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-6 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 leading-tight">
                      {selectedLead.hospitalName}
                    </h2>
                    <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5" /> Received on {new Date(selectedLead.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Grid of All Submitted Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">ICMR Registration</span>
                  <span className="font-mono text-sm font-bold text-slate-800">
                    {selectedLead.icmrNumber || 'N/A'}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Location / City</span>
                  <span className="text-sm font-semibold text-slate-800">{selectedLead.location || 'N/A'}</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Contact Person</span>
                  <span className="text-sm font-semibold text-slate-800">{selectedLead.contactPerson}</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone / Mobile</span>
                  <a href={`tel:${selectedLead.phone}`} className="text-sm font-mono font-bold text-blue-600 hover:underline">
                    {selectedLead.phone}
                  </a>
                </div>

                <div className="sm:col-span-2 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Email Address</span>
                  <a href={`mailto:${selectedLead.email}`} className="text-sm font-semibold text-blue-600 hover:underline break-all">
                    {selectedLead.email}
                  </a>
                </div>
              </div>

              {/* Submitted Message */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Submitted Clinical Requirements / Message:
                </label>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {selectedLead.message || 'No additional message provided.'}
                </div>
              </div>

              {/* Status Change Option Only */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Partnership Status
                  </span>
                  <span className="text-xs text-slate-400">Selecting an option updates status immediately.</span>
                </div>
                <select
                  value={selectedLead.status || 'New'}
                  onChange={(e) => handleStatusChange(selectedLead._id, e.target.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${getStatusBadge(selectedLead.status)}`}
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Onboarded">Onboarded</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
