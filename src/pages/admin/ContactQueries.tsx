import { useState, useEffect } from 'react';
import { Search, Mail, Phone, Calendar, Loader2, MessageSquare, Eye, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../../lib/api';
import Pagination from '../../components/Pagination';

export default function ContactQueries() {
  const [queries, setQueries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedQuery, setSelectedQuery] = useState<any | null>(null);

  const fetchQueries = async (currentPage = page, search = searchTerm) => {
    setLoading(true);
    try {
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
      const response = await api.get(`/crm/contacts?page=${currentPage}&limit=10${searchParam}`);
      if (response.data && response.data.data) {
        setQueries(response.data.data);
        setTotalPages(response.data.totalPages || 1);
        setTotalItems(response.data.total || 0);
      } else {
        setQueries(response.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch queries", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchQueries(page, searchTerm);
    }, 250);
    return () => clearTimeout(delay);
  }, [page, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contact Responses</h1>
          <p className="text-sm text-slate-500 mt-1">Review inquiries received from website visitors and prospective patients.</p>
        </div>
        <div className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-xs">
          Total Responses: <span className="font-bold text-slate-900">{totalItems}</span>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
      >
        <div className="p-4 sm:p-5 border-b border-slate-200">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
             <div className="flex flex-col items-center justify-center p-16 text-slate-400 gap-3">
               <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
               <p className="text-xs font-medium">Loading contact responses...</p>
             </div>
          ) : queries.length === 0 ? (
             <div className="p-16 text-center text-slate-500 space-y-2">
               <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
               <p className="font-semibold text-slate-700">No contact queries found</p>
               <p className="text-xs text-slate-400">Inquiries submitted via the Contact Us form will appear here.</p>
             </div>
          ) : (
            <>
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 font-semibold text-xs border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Name & Subject</th>
                  <th className="px-5 py-3.5">Message</th>
                  <th className="px-5 py-3.5">Contact Details</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {queries.map((q) => (
                  <tr key={q._id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Name & Subject */}
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900">{q.name}</div>
                      <div className="text-slate-500 text-xs truncate max-w-[220px] mt-0.5">{q.subject}</div>
                    </td>

                    {/* Message Preview */}
                    <td className="px-5 py-4">
                      <div className="text-slate-600 text-xs truncate max-w-[280px]" title={q.message}>
                        {q.message}
                      </div>
                    </td>

                    {/* Contact Details */}
                    <td className="px-5 py-4">
                      <div className="text-xs text-slate-700 font-medium">{q.email}</div>
                      {q.phone && <div className="text-xs text-slate-400 font-mono mt-0.5">{q.phone}</div>}
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(q.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Actions: Eye Modal, Email Icon, Phone Icon */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedQuery(q)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="View Full Message"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <a 
                          href={`mailto:${q.email}`} 
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer inline-flex" 
                          title="Send Email"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                        {q.phone && (
                          <a 
                            href={`tel:${q.phone}`} 
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer inline-flex" 
                            title="Call"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        )}
                      </div>
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

      {/* Query Detail Modal */}
      <AnimatePresence>
        {selectedQuery && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 overflow-hidden"
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 leading-tight">
                      {selectedQuery.name}
                    </h2>
                    <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" /> Received on {new Date(selectedQuery.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedQuery(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Email Address</span>
                  <a href={`mailto:${selectedQuery.email}`} className="text-sm font-semibold text-blue-600 hover:underline break-all">
                    {selectedQuery.email}
                  </a>
                </div>
                {selectedQuery.phone && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone Number</span>
                    <a href={`tel:${selectedQuery.phone}`} className="text-sm font-mono font-bold text-blue-600 hover:underline">
                      {selectedQuery.phone}
                    </a>
                  </div>
                )}
                <div className={`${selectedQuery.phone ? 'sm:col-span-2' : 'sm:col-span-2'} p-3 bg-slate-50 rounded-xl border border-slate-100`}>
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Subject</span>
                  <span className="text-sm font-semibold text-slate-800">{selectedQuery.subject}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Inquiry Message:
                </label>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {selectedQuery.message}
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-slate-100">
                <a
                  href={`mailto:${selectedQuery.email}?subject=Re: ${encodeURIComponent(selectedQuery.subject)}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
                >
                  <Mail className="w-3.5 h-3.5" /> Email Response
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedQuery(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
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
