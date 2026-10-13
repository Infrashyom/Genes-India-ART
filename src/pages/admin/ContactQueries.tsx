
import { useState, useEffect } from 'react';
import { Search, Mail, Phone, Calendar, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import api from '../../lib/api';
import Pagination from '../../components/Pagination';

export default function ContactQueries() {
  const [queries, setQueries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchQueries = async (currentPage = page, search = searchTerm) => {
    setLoading(true);
    try {
      const response = await api.get(`/crm/contacts?page=${currentPage}&limit=10&search=${search}`);
      if (response.data && response.data.data) {
        setQueries(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.total);
      } else {
        setQueries(response.data);
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
    }, 300);
    return () => clearTimeout(delay);
  }, [page, searchTerm]);

  const filteredQueries = queries;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contact Responses</h1>
          <p className="text-sm text-slate-500 mt-1">Manage inquiries from individuals and prospective donors.</p>
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
              placeholder="Search by name, email or subject..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
             <div className="flex justify-center p-12">
               <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
             </div>
          ) : filteredQueries.length === 0 ? (
             <div className="p-12 text-center text-slate-500">No contact queries found.</div>
          ) : (
            <>
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Name & Subject</th>
                  <th className="px-6 py-4 font-medium">Message</th>
                  <th className="px-6 py-4 font-medium">Contact Details</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredQueries.map((q) => (
                  <tr key={q._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{q.name}</div>
                      <div className="text-slate-500 text-xs truncate max-w-[200px] mt-1">{q.subject}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-600 text-sm truncate max-w-[250px]" title={q.message}>
                        {q.message}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600 mb-1 break-all text-xs"><Mail className="w-4 h-4 text-slate-400 shrink-0" /> {q.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        q.status === 'Unread' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        q.status === 'Read' ? 'bg-slate-100 text-slate-700 border border-slate-200' :
                        'bg-green-50 text-green-700 border border-green-200'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar className="w-4 h-4" />
                        {new Date(q.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <a href={`mailto:${q.email}`} className="inline-block px-3 py-1.5 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors cursor-pointer text-xs border border-blue-200">
                        Reply
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
