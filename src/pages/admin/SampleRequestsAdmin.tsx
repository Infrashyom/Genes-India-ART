import { useState, useEffect } from 'react';
import { Search, Filter, FileText, CheckCircle2, XCircle, Clock, AlertTriangle, User, Eye, Download, MessageSquare, Loader2, ArrowLeft, ShieldAlert, X, ChevronRight, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { useLocation, Link } from 'react-router-dom';
import api from '../../lib/api';
import Pagination from '../../components/Pagination';
import { useAuth } from '../../context/AuthContext';

export default function SampleRequestsAdmin() {
  const location = useLocation();
  const { user } = useAuth();
  const isStaff = location.pathname.startsWith('/staff') || user?.role === 'staff';

  const [activeTab, setActiveTab] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [previewDoc, setPreviewDoc] = useState<any>(null);

  const fetchRequests = async (currentPage = page, search = searchTerm) => {
    setLoading(true);
    try {
      const response = await api.get(`/requests?page=${currentPage}&limit=10&search=${search}`);
      if (response.data && response.data.data) {
        setRequests(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.total);
      } else {
        setRequests(response.data);
      }
    } catch (err) {
      console.error("Failed to load requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchRequests(page, searchTerm);
    }, 300);
    return () => clearTimeout(delay);
  }, [page, searchTerm]);

  const handleAction = async (actionStatus: string) => {
    if (isStaff) {
      alert("Access Denied: Approvals and rejections can only be processed via the Admin Portal.");
      return;
    }
    if (!selectedRequest) return;
    try {
      await api.patch(`/requests/${selectedRequest._id}/status`, {
        status: actionStatus,
        remarks: remarks || selectedRequest.remarks
      });
      alert(`Request ${selectedRequest.requestId} marked as ${actionStatus}`);
      setSelectedRequest(null);
      setRemarks('');
      fetchRequests();
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesTab = activeTab === 'pending'
      ? ['Pending', 'Pending Review', 'Under Review', 'Documents Requested'].includes(req.status)
      : ['Approved', 'Rejected', 'Dispatched', 'Delivered'].includes(req.status);
      
    const matchesSearch = 
      req.requestId.toLowerCase().includes(searchTerm.toLowerCase()) || 
      req.hospital?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
    return matchesTab && matchesSearch;
  });

  if (selectedRequest) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <button 
          onClick={() => setSelectedRequest(null)} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium text-sm">Back to Requests</span>
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-900">{selectedRequest.requestId}</h2>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  ['Approved', 'Delivered', 'Dispatched'].includes(selectedRequest.status) ? 'bg-green-100 text-green-700' : 
                  selectedRequest.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {selectedRequest.status}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">Submitted on {new Date(selectedRequest.createdAt).toLocaleDateString()} at {new Date(selectedRequest.createdAt).toLocaleTimeString()}</p>
            </div>
            
            {isStaff ? (
              <div className="flex items-center gap-2 bg-amber-50 text-amber-800 border border-amber-200 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Staff Portal: Read-Only Mode (Approval / Rejection restricted to Admin)</span>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <button onClick={() => handleAction('Approved')} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 flex items-center gap-2 shadow-sm cursor-pointer">
                  <CheckCircle2 className="w-4 h-4" /> Approve & Allocate
                </button>
                <button onClick={() => handleAction('Rejected')} className="bg-white text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 flex items-center gap-2 cursor-pointer">
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            )}
          </div>

          {isStaff && (
            <div className="mx-6 mt-4 p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex items-start gap-3 text-blue-900 text-xs sm:text-sm">
              <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Staff Portal: Sample Request Inspection Only</p>
                <p className="text-blue-800 mt-0.5 leading-relaxed">
                  As a staff member, you can review patient requirements, procedure specifications, requested donor identity, and inspect all uploaded clinical/legal documents. In accordance with clinic policy, requests cannot be approved or rejected from the staff portal — decision approval and vial allocation are exclusively handled by Administrators via the Admin Portal.
                </p>
              </div>
            </div>
          )}

          <div className="p-6 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="col-span-2">
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Hospital</span>
                <span className="font-medium text-slate-900">{selectedRequest.hospital?.name || 'Unknown'}</span>
              </div>
              <div className="col-span-2">
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Doctor</span>
                <span className="font-medium text-slate-900">{selectedRequest.doctorName}</span>
              </div>
              <div className="col-span-2">
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Requested Donor</span>
                {selectedRequest.donor?._id ? (
                  <Link 
                    to={isStaff ? `/staff/donors/${selectedRequest.donor._id}` : `/admin/donors/${selectedRequest.donor._id}`}
                    className="inline-flex items-center gap-1 font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 transition-colors"
                  >
                    {selectedRequest.donor?.donorCode || 'View Donor'} &rarr;
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1 font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {selectedRequest.donor?.donorCode || 'Unknown'}
                  </span>
                )}
              </div>
              <div className="col-span-2">
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Patient</span>
                <span className="font-medium text-slate-900">{selectedRequest.patientName} ({selectedRequest.patientAge}Y)</span>
              </div>
              <div className="col-span-2">
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Procedure</span>
                <span className="font-medium text-slate-900">{selectedRequest.procedureType}</span>
              </div>
              <div className="col-span-2">
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Quantity</span>
                <span className="font-medium text-slate-900">{selectedRequest.quantity} Vial(s)</span>
              </div>
            </div>

            {selectedRequest.remarks && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 text-amber-800 text-sm">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-bold mb-1">Previous Remarks to Hospital:</p>
                  <p>{selectedRequest.remarks}</p>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-base font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">Uploaded Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedRequest.documents && selectedRequest.documents.length > 0 ? selectedRequest.documents.map((doc: any, i: number) => (
                  <div key={i} className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-slate-300 transition-colors bg-white">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-slate-400" />
                        <span className="font-bold text-slate-900 text-sm line-clamp-2">{doc.name}</span>
                      </div>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{doc.type}</span>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className={`text-xs font-semibold ${
                        doc.status?.includes('Approved') ? 'text-green-600' :
                        doc.status?.includes('Rejected') ? 'text-red-600' : 'text-amber-600'
                      }`}>
                        {doc.status || 'Pending'}
                      </span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setPreviewDoc(doc)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" 
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if (doc.url) window.open(doc.url, '_blank');
                            else alert(`Document "${doc.name}" download initiated.`);
                          }}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" 
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-slate-500 text-sm p-6 border border-dashed rounded-lg text-center col-span-full">
                    No documents provided with this request.
                  </div>
                )}
              </div>
            </div>

            {/* Admin Remarks Section - Interactive for Admin, Read-Only for Staff */}
            {isStaff ? (
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-slate-500" />
                    Admin Remarks & Communication History
                  </h3>
                  <span className="text-[11px] text-slate-500 font-semibold bg-slate-200/70 px-2 py-0.5 rounded-full">Staff View (Read-Only)</span>
                </div>
                {selectedRequest.remarks ? (
                  <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-sm text-slate-800 leading-relaxed">
                    {selectedRequest.remarks}
                  </div>
                ) : (
                  <div className="bg-white p-4 rounded-lg border border-dashed border-slate-200 text-sm text-slate-400 italic">
                    No internal admin remarks recorded for this sample request yet.
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Admin Remarks & Verification</h3>
                <textarea 
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 h-24 resize-none" 
                  placeholder="Enter internal notes or remarks to send to the hospital if documents are missing..."
                ></textarea>
                <div className="flex flex-wrap justify-end gap-3">
                  <button onClick={() => handleAction('Documents Requested')} className="bg-white text-slate-700 border border-slate-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-2 cursor-pointer">
                    <MessageSquare className="w-4 h-4" /> Request Additional Docs
                  </button>
                  <button onClick={() => handleAction('Pending')} className="bg-amber-100 text-amber-800 border border-amber-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-200 cursor-pointer">
                    Put On Hold
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Document Preview Modal */}
        {previewDoc && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in duration-150">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-sm text-slate-900">{previewDoc.name}</span>
                </div>
                <button onClick={() => setPreviewDoc(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div><span className="font-bold text-slate-600">Document Name:</span> <span className="text-slate-900 font-semibold">{previewDoc.name}</span></div>
                  <div><span className="font-bold text-slate-600">Document Type:</span> <span className="text-slate-900">{previewDoc.type || 'Clinical / Legal Document'}</span></div>
                  <div><span className="font-bold text-slate-600">Verification Status:</span> <span className="font-semibold text-emerald-700">{previewDoc.status || 'Under Review'}</span></div>
                  <div><span className="font-bold text-slate-600">Attached to Request:</span> <span className="font-mono text-blue-700">{selectedRequest.requestId}</span></div>
                </div>
                <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center">
                  <FileText className="w-12 h-12 text-slate-300 mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Official Clinical Attachment</p>
                  <p className="text-xs text-slate-400 mt-1">Uploaded securely by {selectedRequest.hospital?.name || 'Hospital'}</p>
                </div>
              </div>
              <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
                <button onClick={() => setPreviewDoc(null)} className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200 cursor-pointer">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900">Sample Requests</h1>
            {isStaff && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                Staff Portal (Read-Only)
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {isStaff 
              ? "Review sample requests submitted by hospital partners. Action authorization is reserved for Administrators."
              : "Review, approve, and fulfill requests from hospital partners."}
          </p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors cursor-pointer ${activeTab === 'pending' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Pending Review
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors cursor-pointer ${activeTab === 'history' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Processed
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by ID or Hospital..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500" 
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No requests found in this category.</p>
            </div>
          ) : (
            <>
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Request ID</th>
                  <th className="px-6 py-4">Hospital & Doctor</th>
                  <th className="px-6 py-4">Patient / Procedure</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((req) => (
                  <tr 
                    key={req._id} 
                    onClick={() => {
                      setSelectedRequest(req);
                      setRemarks(req.remarks || '');
                    }} 
                    className="hover:bg-slate-50 cursor-pointer group transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-blue-600 group-hover:text-blue-800">
                      {req.requestId}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{req.hospital?.name || 'Unknown'}</div>
                      <div className="text-xs text-slate-500">{req.doctorName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-900">{req.patientName}</div>
                      <div className="text-xs text-slate-500">{req.procedureType} • Donor: {req.donor?.donorCode || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        ['Approved', 'Delivered', 'Dispatched'].includes(req.status) ? 'bg-green-100 text-green-700' : 
                        req.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRequest(req);
                          setRemarks(req.remarks || '');
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination currentPage={page} totalPages={totalPages} totalItems={totalItems} onPageChange={setPage} />
          </>
          )}
        </div>
      </div>
    </div>
  );
}
