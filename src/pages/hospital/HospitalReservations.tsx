import { useState, useEffect } from 'react';
import { 
  TestTube, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Loader2, 
  ThermometerSnowflake, 
  X, 
  Calendar, 
  AlertCircle, 
  RefreshCw,
  Search,
  Sparkles,
  FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../../lib/api';

export default function HospitalReservations() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Tracking modal state
  const [trackingItem, setTrackingItem] = useState<any>(null);

  // Outcome reporting modal state
  const [outcomeItem, setOutcomeItem] = useState<any>(null);
  const [cycleStatus, setCycleStatus] = useState('Pregnancy Confirmed');
  const [pregnancyConfirmed, setPregnancyConfirmed] = useState(true);
  const [outcomeNotes, setOutcomeNotes] = useState('');
  const [savingOutcome, setSavingOutcome] = useState(false);
  const [outcomeSuccess, setOutcomeSuccess] = useState('');

  const fetchReservations = async () => {
    setLoading(true);
    try {
      // Query approved, dispatched, delivered, and completed sample requests
      const response = await api.get('/requests?status=Approved,Dispatched,Delivered,Completed');
      const list = response.data.data || response.data || [];
      setReservations(list);
    } catch (err) {
      console.error('Failed to fetch reservations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleReportOutcomeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!outcomeItem) return;
    setSavingOutcome(true);

    try {
      await api.patch(`/requests/${outcomeItem._id}/outcome`, {
        cycleStatus,
        pregnancyConfirmed,
        notes: outcomeNotes
      });
      setOutcomeSuccess('Clinical outcome logged successfully into national registry format.');
      setTimeout(() => {
        setOutcomeItem(null);
        setOutcomeSuccess('');
        setOutcomeNotes('');
        fetchReservations();
      }, 1500);
    } catch (err: any) {
      console.error('Failed to report outcome', err);
    } finally {
      setSavingOutcome(false);
    }
  };

  const inTransitCount = reservations.filter(r => r.status === 'Dispatched').length;
  const deliveredCount = reservations.filter(r => r.status === 'Delivered').length;
  const completedCount = reservations.filter(r => r.status === 'Completed').length;
  const approvedCount = reservations.filter(r => r.status === 'Approved').length;

  const filteredReservations = reservations.filter(res => {
    const matchesSearch = 
      res.requestId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.donor?.donorCode?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'all') return true;
    if (activeTab === 'approved') return res.status === 'Approved';
    if (activeTab === 'transit') return res.status === 'Dispatched';
    if (activeTab === 'delivered') return res.status === 'Delivered';
    if (activeTab === 'completed') return res.status === 'Completed';
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <ThermometerSnowflake className="w-4 h-4" /> Cryo-Chain Transport & Outcome Tracking
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Allocated Gamete Reservations
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor real-time LN2 dry-shipper dispatch, temperature compliance, hospital delivery verification, and clinical outcomes.
          </p>
        </div>

        <button
          onClick={fetchReservations}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} /> Refresh Shipments
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Reserved / Preparing', count: approvedCount, sub: 'Under nitrogen charging', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'In Cold-Chain Transit', count: inTransitCount, sub: 'En route with temp logger', icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Received at Hospital Lab', count: deliveredCount, sub: 'Stored in clinic cryo vault', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Clinical Outcome Logged', count: completedCount, sub: 'Cycle outcome submitted', icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-50' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">{kpi.label}</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{kpi.count}</h3>
              <p className="text-[11px] text-slate-400">{kpi.sub}</p>
            </div>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
              <kpi.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Search and Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All Shipments', count: reservations.length },
            { id: 'approved', label: 'Preparing', count: approvedCount },
            { id: 'transit', label: 'In Transit', count: inTransitCount },
            { id: 'delivered', label: 'Delivered', count: deliveredCount },
            { id: 'completed', label: 'Outcomes Reported', count: completedCount }
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

      {/* Main Reservations Table */}
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-16 text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-sm font-medium">Loading reservations & shipments...</p>
            </div>
          ) : filteredReservations.length === 0 ? (
            <div className="p-16 text-center text-slate-400 space-y-3">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-700">No active reservations found</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Once a sample requisition is approved by the ART bank, its cryo allocation and delivery tracking will appear here.
              </p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/75 text-slate-500 text-xs font-semibold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Requisition / Dry Shipper</th>
                  <th className="px-6 py-4">Patient / Protocol</th>
                  <th className="px-6 py-4">Matched Gamete</th>
                  <th className="px-6 py-4">Logistics Status</th>
                  <th className="px-6 py-4">Current Location / ETA</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReservations.map((res) => {
                  const shipping = res.shippingDetails || {};

                  return (
                    <tr key={res._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs font-bold text-blue-600 flex items-center gap-1.5">
                          <TestTube className="w-3.5 h-3.5 text-blue-500" />
                          {res.requestId}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          Shipper: <span className="font-mono text-slate-600">{shipping.shipperId || 'DS-LN2'}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">{res.patientName}</div>
                        <div className="text-xs text-slate-500 font-normal">
                          {res.procedureType} • {res.quantity || 1} Vial{res.quantity > 1 ? 's' : ''}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-mono text-xs font-medium text-slate-800">
                          {res.donor?.donorCode || 'DONOR'}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {res.donor?.bloodGroup || 'O+'} • {res.donor?.donorType || 'Gamete'}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          res.status === 'Dispatched' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                          res.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          res.status === 'Completed' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {res.status === 'Dispatched' && <Truck className="w-3.5 h-3.5" />}
                          {res.status === 'Delivered' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {res.status === 'Completed' && <Sparkles className="w-3.5 h-3.5" />}
                          {res.status === 'Approved' && <Clock className="w-3.5 h-3.5" />}
                          {res.status === 'Dispatched' ? 'In Transit' : res.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs">
                        <div className="flex items-center gap-1.5 font-medium text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[200px]">{shipping.currentLocation || 'Central Cryo Vault'}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 pl-5">
                          ETA: {shipping.eta || 'Standard Logistics Window'}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        {/* Tracking button */}
                        <button 
                          onClick={() => setTrackingItem(res)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5" /> Track Cryo
                        </button>

                        {/* Report Outcome button if delivered */}
                        {res.status === 'Delivered' && (
                          <button 
                            onClick={() => {
                              setOutcomeItem(res);
                              setCycleStatus('Pregnancy Confirmed');
                              setPregnancyConfirmed(true);
                              setOutcomeNotes('');
                            }}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            <FileCheck className="w-3.5 h-3.5" /> Report Outcome
                          </button>
                        )}

                        {res.status === 'Completed' && (
                          <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 inline-block">
                            {res.clinicalOutcome?.cycleStatus || 'Cycle Recorded'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Live Cold-Chain Tracking Modal */}
      <AnimatePresence>
        {trackingItem && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Cold-Chain Cryo Delivery Monitor
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Requisition: {trackingItem.requestId} • Shipper: {trackingItem.shippingDetails?.shipperId || 'DS-LN2-841'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setTrackingItem(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Shipper Sensor Stats */}
              <div className="grid grid-cols-3 gap-3 bg-slate-900 text-white p-4 rounded-2xl text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Internal Temperature</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm flex items-center gap-1 mt-0.5">
                    <ThermometerSnowflake className="w-3.5 h-3.5" /> -196.2°C
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Hold Time Status</span>
                  <span className="font-bold text-slate-200 text-sm block mt-0.5">Static Safe</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Carrier Tracking</span>
                  <span className="font-mono text-blue-300 text-xs truncate block mt-0.5">
                    {trackingItem.shippingDetails?.trackingNumber || 'CP-VALIDATED'}
                  </span>
                </div>
              </div>

              {/* Timeline Milestones */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Logistics Milestones
                </h4>

                <div className="relative pl-6 space-y-5 text-xs before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {/* Step 1 */}
                  <div className="relative">
                    <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                    </div>
                    <span className="font-bold text-slate-900 block">Vial Identity & Code Matched</span>
                    <span className="text-slate-500 text-[11px]">Donor {trackingItem.donor?.donorCode || 'DONOR'} retrieved from Cryo Vault Tank A1</span>
                  </div>

                  {/* Step 2 */}
                  <div className="relative">
                    <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                    </div>
                    <span className="font-bold text-slate-900 block">Dry Shipper Nitrogen Charged & Tested</span>
                    <span className="text-slate-500 text-[11px]">Absorption matrix loaded with liquid nitrogen, calibrated temp logger activated</span>
                  </div>

                  {/* Step 3 */}
                  <div className="relative">
                    <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-white ${
                      ['Dispatched', 'Delivered', 'Completed'].includes(trackingItem.status) ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}>
                      <CheckCircle2 className="w-2.5 h-2.5" />
                    </div>
                    <span className="font-bold text-slate-900 block">Dispatched via Validated Cold-Chain Courier</span>
                    <span className="text-slate-500 text-[11px]">{trackingItem.shippingDetails?.carrier || 'CryoPort Cold-Chain'} • Handed over to courier</span>
                  </div>

                  {/* Step 4 */}
                  <div className="relative">
                    <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-white ${
                      ['Delivered', 'Completed'].includes(trackingItem.status) ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}>
                      <CheckCircle2 className="w-2.5 h-2.5" />
                    </div>
                    <span className="font-bold text-slate-900 block">Received at Hospital IVF Laboratory</span>
                    <span className="text-slate-500 text-[11px]">
                      {['Delivered', 'Completed'].includes(trackingItem.status) 
                        ? 'Package verified, tamper-evident seals checked, vials transferred to clinic storage.'
                        : `Estimated Arrival: ${trackingItem.shippingDetails?.eta || 'In Transit'}`
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  onClick={() => setTrackingItem(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Close Monitor
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Report Outcome Modal */}
      <AnimatePresence>
        {outcomeItem && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Report Assisted Reproduction Outcome
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Requisition: {outcomeItem.requestId} • Patient: {outcomeItem.patientName}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setOutcomeItem(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {outcomeSuccess ? (
                <div className="p-6 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <p className="text-sm font-bold text-slate-800">{outcomeSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleReportOutcomeSubmit} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Clinical Cycle Outcome *</label>
                    <select
                      value={cycleStatus}
                      onChange={e => {
                        setCycleStatus(e.target.value);
                        setPregnancyConfirmed(e.target.value.includes('Pregnancy Confirmed'));
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Pregnancy Confirmed">Clinical Pregnancy Confirmed (Gestational Sac / FHR)</option>
                      <option value="Embryo Transfer Successful">Embryo Transfer Successful (Awaiting Beta hCG)</option>
                      <option value="Fertilization Recorded">Fertilization Recorded (Embryos in Cryopreservation)</option>
                      <option value="Biochemical Pregnancy">Biochemical Pregnancy (hCG positive, unresolved)</option>
                      <option value="Cycle Unsuccessful">Cycle Unsuccessful / Negative</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      id="pregCheck"
                      checked={pregnancyConfirmed}
                      onChange={e => setPregnancyConfirmed(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="pregCheck" className="font-semibold text-slate-800 cursor-pointer">
                      Confirm Clinical Pregnancy Established
                    </label>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700">Clinical Observations / Notes (Optional)</label>
                    <textarea
                      rows={3}
                      value={outcomeNotes}
                      onChange={e => setOutcomeNotes(e.target.value)}
                      placeholder="e.g. Single blastocyst transferred on Day 5. Good endometrium lining. Beta-hCG 450 mIU/mL."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setOutcomeItem(null)}
                      className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingOutcome}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                    >
                      {savingOutcome ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Recording...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Save Outcome
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
