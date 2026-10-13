import { useState, useEffect } from 'react';
import { 
  TestTube, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Loader2, 
  Search, 
  Truck, 
  FileText, 
  PlusCircle, 
  Clock, 
  ShieldCheck,
  Building2,
  Calendar,
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function HospitalDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get('/requests?limit=10');
        const data = response.data.data || response.data || [];
        setRequests(data);
      } catch (err) {
        console.error("Failed to fetch hospital requests", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => ['Pending', 'Under Review', 'Documents Requested'].includes(r.status)).length;
  const inTransitCount = requests.filter(r => r.status === 'Dispatched').length;
  const completedCount = requests.filter(r => ['Delivered', 'Completed'].includes(r.status)).length;

  const stats = [
    { 
      label: 'Total Sample Requests', 
      value: totalRequests, 
      sub: 'All recorded cycle requisitions',
      icon: FileText, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      border: 'border-blue-100'
    },
    { 
      label: 'Under Review & Action', 
      value: pendingRequests, 
      sub: 'Pending review or doc submission',
      icon: Clock, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50',
      border: 'border-amber-100'
    },
    { 
      label: 'Samples in Cold-Chain Transit', 
      value: inTransitCount, 
      sub: 'Active dry-shipper deliveries',
      icon: Truck, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50',
      border: 'border-indigo-100'
    },
    { 
      label: 'Delivered / Completed', 
      value: completedCount, 
      sub: 'Received at laboratory / cycle done',
      icon: CheckCircle2, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      border: 'border-emerald-100'
    },
  ];

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
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Under Review':
      case 'Pending':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-medium tracking-wide">
              <Building2 className="w-3.5 h-3.5" /> ART Clinic Partner Portal
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Welcome back, {user?.name || 'Partner Hospital'}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Manage patient donor sample requisitions, track validated LN2 dry-shipper deliveries, and verify ICMR-compliant screening clearances.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5">
            <Link 
              to="/hospital/search" 
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2"
            >
              <Search className="w-4 h-4" /> Search Donors
            </Link>
            <Link 
              to="/hospital/reservations" 
              className="bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all border border-white/10 flex items-center gap-2"
            >
              <Truck className="w-4 h-4" /> Track Shipments
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-white rounded-2xl p-4 shadow-xs border ${stat.border} flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-medium text-slate-500">{stat.label}</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{stat.value}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">{stat.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid: Recent Requests & Matching Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Table Column */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden flex flex-col"
        >
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Requisitions</h3>
              <p className="text-xs text-slate-500">Latest patient gamete allocations and transit status</p>
            </div>
            <Link to="/hospital/requests" className="text-xs sm:text-sm text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-sm">Loading requisitions...</span>
              </div>
            ) : requests.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-3">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <TestTube className="w-6 h-6" />
                </div>
                <p className="font-medium text-slate-700">No sample requests created yet.</p>
                <p className="text-xs text-slate-400">Search our donor repository to initiate a patient sample requisition.</p>
                <Link to="/hospital/search" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline mt-2">
                  Browse Donors <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/75 text-slate-500 text-xs font-semibold border-b border-slate-200 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Requisition ID</th>
                    <th className="px-5 py-3.5">Patient / Protocol</th>
                    <th className="px-5 py-3.5">Donor Match</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.slice(0, 6).map((req) => (
                    <tr key={req._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        <div className="font-mono text-xs text-blue-600">{req.requestId}</div>
                        <div className="text-[11px] text-slate-400 font-normal flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" /> {new Date(req.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-slate-900">{req.patientName}</div>
                        <div className="text-xs text-slate-500 font-normal">
                          {req.procedureType} • {req.quantity || 1} Vial{req.quantity > 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-medium text-slate-800 text-xs inline-flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded-md">
                          <TestTube className="w-3 h-3 text-blue-600" />
                          {req.donor?.donorCode || 'DON-CODE'}
                        </span>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {req.donor?.bloodGroup ? `${req.donor.bloodGroup} • ${req.donor.donorType || 'Gamete'}` : 'Verified'}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(req.status)}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        {/* Sidebar Info & Match Card */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-blue-600 rounded-3xl p-6 text-white relative overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="space-y-3 relative z-10">
              <span className="text-xs uppercase font-bold tracking-wider text-blue-200">ICMR Compliant Match</span>
              <h3 className="text-xl font-bold leading-tight">Patient Phenotype Matching</h3>
              <p className="text-blue-100 text-xs leading-relaxed">
                Filter verified donors by blood group, physical phenotypes, educational profile, and comprehensive genetic carrier screening.
              </p>
            </div>

            <div className="pt-6 relative z-10 space-y-3">
              <Link 
                to="/hospital/search" 
                className="w-full bg-white text-blue-700 hover:bg-slate-50 font-bold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                Search Donor Inventory <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Quick Regulatory Assurance card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3.5">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> ART Act Compliance
            </h4>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>All donors undergo mandatory 180-day quarantine and viral marker re-tests.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>Pre-authorized cryo-logistics with calibrated continuous temp loggers.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>Strict anonymous donor-patient non-disclosure protocols enforced.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-mono text-blue-600">{selectedRequest.requestId}</span>
                <h3 className="text-lg font-bold text-slate-900">Requisition Details</h3>
              </div>
              <button 
                onClick={() => setSelectedRequest(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl">
                <div>
                  <span className="text-xs text-slate-400 block">Patient Name</span>
                  <span className="font-semibold text-slate-800">{selectedRequest.patientName}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Age & Procedure</span>
                  <span className="font-semibold text-slate-800">
                    {selectedRequest.patientAge ? `${selectedRequest.patientAge} Yrs • ` : ''}{selectedRequest.procedureType}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Treating Doctor</span>
                  <span className="font-semibold text-slate-800">{selectedRequest.doctorName}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Status</span>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold border mt-0.5 ${getStatusBadge(selectedRequest.status)}`}>
                    {selectedRequest.status}
                  </span>
                </div>
              </div>

              {selectedRequest.remarks && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                  <span className="font-bold block mb-1">Remarks / Bank Advisory:</span>
                  {selectedRequest.remarks}
                </div>
              )}

              {selectedRequest.shippingDetails && (
                <div className="border border-slate-200 rounded-xl p-3.5 text-xs space-y-1.5 bg-white">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-blue-600" /> Logistics Status
                  </div>
                  <div className="text-slate-600">Location: {selectedRequest.shippingDetails.currentLocation || 'Preparing'}</div>
                  <div className="text-slate-600">Carrier: {selectedRequest.shippingDetails.carrier}</div>
                  {selectedRequest.shippingDetails.trackingNumber && (
                    <div className="text-slate-600">AWB Tracking: <span className="font-mono text-blue-600 font-semibold">{selectedRequest.shippingDetails.trackingNumber}</span></div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setSelectedRequest(null);
                  navigate('/hospital/requests');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700"
              >
                Manage in Requests
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
