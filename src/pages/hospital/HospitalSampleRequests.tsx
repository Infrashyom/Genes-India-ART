import { useState, useEffect } from 'react';
import { 
  Plus, 
  TestTube, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Loader2, 
  X, 
  UploadCloud, 
  Truck, 
  ExternalLink, 
  Eye, 
  AlertTriangle,
  RefreshCw,
  XCircle,
  Building2,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

export default function HospitalSampleRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  
  // Additional document upload state inside modal
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadError, setUploadError] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await api.get('/requests?limit=100');
      const list = response.data.data || response.data || [];
      setRequests(list);
    } catch (err) {
      console.error('Failed to load sample requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUploadAdditionalDoc = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedRequest) return;

    // Strict 5MB file size limit check
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds the 5MB limit. Please upload a file smaller than 5MB.');
      return;
    }

    setUploadingDoc(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const url = uploadRes.data.secure_url || uploadRes.data.url;
      const docName = newDocName.trim() || file.name;
      const fileType = file.type.includes('pdf') ? 'PDF' : 'JPG';

      const updateRes = await api.patch(`/requests/${selectedRequest._id}/documents`, {
        name: docName,
        type: fileType,
        url: url
      });

      setSelectedRequest(updateRes.data);
      setUploadSuccess(`Document "${docName}" attached successfully. Requisition status moved to Under Review.`);
      setNewDocName('');
      fetchRequests();
    } catch (err: any) {
      console.error('Failed to upload additional document', err);
      setUploadError(err.response?.data?.error || 'Failed to attach document. Please try again.');
    } finally {
      setUploadingDoc(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Dispatched':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Delivered':
      case 'Completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Documents Requested':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Under Review':
      case 'Pending':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.requestId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.donor?.donorCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.doctorName?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'all') return true;
    if (activeTab === 'review') return ['Pending', 'Under Review'].includes(req.status);
    if (activeTab === 'docs') return req.status === 'Documents Requested';
    if (activeTab === 'approved') return req.status === 'Approved';
    if (activeTab === 'dispatched') return ['Dispatched', 'Delivered', 'Completed'].includes(req.status);
    if (activeTab === 'rejected') return req.status === 'Rejected';
    return true;
  });

  return (
    <div className="space-y-4 pb-8">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" /> Hospital ART Requisitions
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Patient Sample Requisitions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track regulatory clearance, document verification, and cryo vial allocation for your IVF cycles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchRequests}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} /> Refresh
          </button>
          <button 
            onClick={() => navigate('/hospital/search')}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Requisition
          </button>
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {[
            { id: 'all', label: 'All', count: requests.length },
            { id: 'review', label: 'Under Review', count: requests.filter(r => ['Pending', 'Under Review'].includes(r.status)).length },
            { id: 'docs', label: 'Docs Requested', count: requests.filter(r => r.status === 'Documents Requested').length },
            { id: 'approved', label: 'Approved', count: requests.filter(r => r.status === 'Approved').length },
            { id: 'dispatched', label: 'Dispatched / Done', count: requests.filter(r => ['Dispatched', 'Delivered', 'Completed'].includes(r.status)).length },
            { id: 'rejected', label: 'Rejected', count: requests.filter(r => r.status === 'Rejected').length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === tab.id ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            placeholder="Search by ID, patient, donor..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 pl-8"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-16 text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-sm font-medium">Loading requisitions...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-16 text-center text-slate-400 space-y-3">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-700">No requisitions found</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {searchTerm ? 'No results matched your search term.' : 'There are no requisitions currently under this tab.'}
              </p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/75 text-slate-500 text-xs font-semibold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Requisition ID</th>
                  <th className="px-6 py-4">Patient Name</th>
                  <th className="px-6 py-4">Donor Code</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Documents</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs font-bold text-blue-600">{req.requestId}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 font-normal">
                        <Calendar className="w-3 h-3" /> {new Date(req.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{req.patientName}</div>
                      <div className="text-xs text-slate-500 font-normal">
                        {req.procedureType} • {req.quantity || 1} Vial{req.quantity > 1 ? 's' : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg text-xs font-mono font-medium text-slate-700">
                        <TestTube className="w-3.5 h-3.5 text-blue-600" />
                        {req.donor?.donorCode || 'DONOR'}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {req.donor?.bloodGroup ? `${req.donor.bloodGroup} • ${req.donor.donorType || 'Gamete'}` : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(req.status)}`}>
                        {req.status === 'Approved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {req.status === 'Dispatched' && <Truck className="w-3.5 h-3.5" />}
                        {req.status === 'Documents Requested' && <AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
                        {req.status === 'Under Review' && <Clock className="w-3.5 h-3.5" />}
                        {req.status === 'Rejected' && <XCircle className="w-3.5 h-3.5" />}
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="font-medium">{req.documents?.length || 0} Attached</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedRequest(req)} 
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Details & In-Modal Document Upload Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-sm font-bold text-blue-600">{selectedRequest.requestId}</span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(selectedRequest.status)}`}>
                      {selectedRequest.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Submitted: {new Date(selectedRequest.createdAt).toLocaleString()}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setSelectedRequest(null);
                    setUploadSuccess('');
                    setUploadError('');
                  }}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Feedback Alert for Documents Requested */}
              {selectedRequest.status === 'Documents Requested' && (
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl space-y-2 text-xs text-amber-900">
                  <div className="flex items-center gap-2 font-bold text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    Additional Information Required by ART Bank
                  </div>
                  <p className="leading-relaxed">
                    {selectedRequest.remarks || 'Please upload the missing or amended documents (e.g. updated consent form) below to proceed with vial allocation.'}
                  </p>
                </div>
              )}

              {/* Success / Error Banners for in-modal upload */}
              {uploadSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> {uploadSuccess}
                </div>
              )}
              {uploadError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" /> {uploadError}
                </div>
              )}

              {/* Patient & Donor Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-2">
                  <span className="font-bold text-slate-800 block pb-1 border-b border-slate-200">Patient & Protocol</span>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Patient Name:</span>
                    <strong className="text-slate-800">{selectedRequest.patientName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Age:</span>
                    <span className="text-slate-800">{selectedRequest.patientAge || 'N/A'} Years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Treating Physician:</span>
                    <span className="text-slate-800 font-semibold">{selectedRequest.doctorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Protocol & Vials:</span>
                    <span className="text-slate-800">{selectedRequest.procedureType} • {selectedRequest.quantity || 1} Vial(s)</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-2">
                  <span className="font-bold text-slate-800 block pb-1 border-b border-slate-200">Selected Donor Match</span>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Donor Reference:</span>
                    <strong className="font-mono text-blue-600">{selectedRequest.donor?.donorCode || 'DONOR'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Blood Group:</span>
                    <span className="text-slate-800 font-semibold">{selectedRequest.donor?.bloodGroup || 'O+'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Gamete Type:</span>
                    <span className="text-slate-800">{selectedRequest.donor?.donorType || 'Sperm'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Screening Status:</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">180-Day Passed</span>
                  </div>
                </div>
              </div>

              {/* Admin Remarks if present */}
              {selectedRequest.remarks && selectedRequest.status !== 'Documents Requested' && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700">
                  <strong className="block text-slate-900 mb-0.5">ART Bank Notes:</strong>
                  {selectedRequest.remarks}
                </div>
              )}

              {/* Attached Documents section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Attached Statutory Dossiers ({selectedRequest.documents?.length || 0})
                  </h4>
                </div>

                {selectedRequest.documents?.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No documents attached.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedRequest.documents?.map((doc: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-white text-xs">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <div>
                            <span className="font-semibold text-slate-800">{doc.name}</span>
                            <span className="text-[10px] text-slate-400 block uppercase">{doc.type || 'PDF'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            doc.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                            doc.status === 'Rejected' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {doc.status || 'Pending Review'}
                          </span>
                          {doc.url && (
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:text-blue-800 p-1.5 rounded-lg hover:bg-blue-50"
                              title="Open document"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upload Additional Document form (Interactive) */}
              <div className="border border-dashed border-slate-300 rounded-2xl p-4 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-blue-600" /> Upload Updated or Additional Document
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-md">
                    Max size: 5MB
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Document label (e.g. Revised Signed Consent Form)"
                      value={newDocName}
                      onChange={e => setNewDocName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs">
                      {uploadingDoc ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-3.5 h-3.5" /> Choose File
                        </>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,image/png,image/jpeg"
                        disabled={uploadingDoc}
                        onChange={handleUploadAdditionalDoc}
                      />
                    </label>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">Supported formats: PDF, JPG, PNG up to 5MB.</p>
              </div>

              {/* Shipping Logistics Box if Dispatched/Delivered */}
              {selectedRequest.shippingDetails && ['Dispatched', 'Delivered', 'Completed'].includes(selectedRequest.status) && (
                <div className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-4 text-xs space-y-2">
                  <div className="font-bold text-indigo-950 flex items-center gap-1.5 pb-1 border-b border-indigo-100">
                    <Truck className="w-4 h-4 text-indigo-600" /> Cold-Chain Logistics Status
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Carrier</span>
                      <span className="font-semibold">{selectedRequest.shippingDetails.carrier}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Tracking Number</span>
                      <span className="font-mono font-bold text-indigo-700">
                        {selectedRequest.shippingDetails.trackingNumber || 'CP-VALIDATED'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Temperature Log</span>
                      <span className="font-semibold text-emerald-700">{selectedRequest.shippingDetails.tempLog || '-196°C LN2'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Current Location</span>
                      <span className="font-semibold">{selectedRequest.shippingDetails.currentLocation}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setSelectedRequest(null);
                    setUploadSuccess('');
                    setUploadError('');
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
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
