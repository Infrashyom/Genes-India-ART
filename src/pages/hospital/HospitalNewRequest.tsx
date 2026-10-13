import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  CheckCircle2, 
  UploadCloud, 
  AlertTriangle, 
  ArrowLeft, 
  ArrowRight, 
  TestTube,
  ShieldCheck,
  Loader2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import api from '../../lib/api';

export default function HospitalNewRequest() {
  const { donorId } = useParams();
  const navigate = useNavigate();
  
  const [loadingDonor, setLoadingDonor] = useState(true);
  const [donor, setDonor] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    bloodGroup: '',
    husbandName: '',
    doctorName: '',
    procedureType: 'IVF',
    expectedDate: '',
    quantity: 1
  });
  
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [documents, setDocuments] = useState<{ [key: string]: { name: string; url: string; type: string } }>({});
  const [error, setError] = useState('');

  // Fetch donor details on mount
  useEffect(() => {
    const fetchDonor = async () => {
      if (!donorId) return;
      try {
        const response = await api.get(`/donors/${donorId}`);
        setDonor(response.data);
      } catch (err) {
        console.error('Failed to load donor info', err);
      } finally {
        setLoadingDonor(false);
      }
    };
    fetchDonor();
  }, [donorId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docKey: string, docLabel: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Strict 5MB file size limit
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit. Please upload a file smaller than 5MB.');
      return;
    }

    setUploadingDoc(docKey);
    setError('');

    try {
      const data = new FormData();
      data.append('file', file);
      
      const res = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const url = res.data.secure_url || res.data.url;
      const fileType = file.type.includes('pdf') ? 'PDF' : file.type.includes('png') ? 'PNG' : 'JPG';

      setDocuments(prev => ({
        ...prev,
        [docKey]: {
          name: `${docLabel} (${file.name})`,
          url: url,
          type: fileType
        }
      }));
    } catch (err: any) {
      console.error('File upload failed', err);
      setError(err.response?.data?.error || 'Document upload failed. Please ensure file is under 5MB (PDF, PNG, JPG).');
    } finally {
      setUploadingDoc(null);
    }
  };

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!formData.patientName.trim()) {
        setError('Please enter the patient full name.');
        return;
      }
      if (!formData.patientAge || Number(formData.patientAge) < 18 || Number(formData.patientAge) > 65) {
        setError('Please provide a valid patient age between 18 and 65.');
        return;
      }
      if (!formData.doctorName.trim()) {
        setError('Please specify the treating ART physician/doctor name.');
        return;
      }
    } else if (step === 2) {
      if (!documents.aadhaar || !documents.consent || !documents.prescription) {
        setError('All 3 statutory ART documents (Aadhaar, ART Consent Form, and Doctor Prescription) are required by law.');
        return;
      }
    }
    setStep(s => s + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const docsArray = Object.values(documents).map(d => ({
        name: d.name,
        type: d.type,
        url: d.url,
        status: 'Pending Review'
      }));

      const payload = {
        donor: donor?._id || donorId,
        patientName: formData.patientName,
        patientAge: Number(formData.patientAge),
        doctorName: formData.doctorName,
        procedureType: formData.procedureType,
        quantity: Number(formData.quantity) || 1,
        documents: docsArray,
        remarks: formData.husbandName ? `Spouse: ${formData.husbandName}. Expected Cycle: ${formData.expectedDate || 'TBD'}` : `Expected Cycle: ${formData.expectedDate || 'TBD'}`
      };

      const res = await api.post('/requests', payload);
      setCreatedRequestId(res.data.requestId || 'REQ-CONFIRMED');
    } catch (err: any) {
      console.error('Failed to submit sample request', err);
      setError(err.response?.data?.error || err.response?.data?.details || 'Failed to submit requisition. Please verify all fields.');
    } finally {
      setSubmitting(false);
    }
  };

  if (createdRequestId) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200 text-center space-y-6"
        >
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Requisition ID: {createdRequestId}
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Requisition Submitted Successfully
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Your patient sample requisition has been registered and is under formal ART Bank review. Allocation and cryogenic dry-shipper dispatch will be scheduled upon document verification.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 text-left text-xs space-y-2.5 border border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-500">Patient:</span>
              <span className="text-slate-800 font-medium">{formData.patientName} ({formData.patientAge} Y)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Selected Donor:</span>
              <span className="text-slate-800 font-mono font-medium">{donor?.donorCode || donorId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Protocol & Quantity:</span>
              <span className="text-slate-800 font-medium">{formData.procedureType} • {formData.quantity} Vial{formData.quantity > 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Initial Status:</span>
              <span className="font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">Under Review</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/hospital/requests')}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Track in Sample Requests
            </button>
            <button
              onClick={() => navigate('/hospital/search')}
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-3 px-6 rounded-xl transition-colors cursor-pointer"
            >
              Search More Donors
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      {/* Back button */}
      <button 
        onClick={() => navigate('/hospital/search')}
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Donor Repository
      </button>

      {/* Selected Donor Preview Ribbon */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-3xl p-5 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
            <TestTube className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-blue-300 font-bold">Selected Gamete Donor</div>
            <h2 className="text-xl font-bold font-mono tracking-tight">
              {loadingDonor ? 'Loading Donor...' : donor?.donorCode || donorId}
            </h2>
            <div className="text-xs text-slate-300 mt-0.5">
              {donor ? `${donor.bloodGroup} Blood • ${donor.donorType || 'Gamete'} Donor • ${donor.complexion || 'Standard'} • ${donor.height || ''} cm` : 'Verified ICMR Clearance'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            <ShieldCheck className="w-3.5 h-3.5" /> 180-Day Quarantine Clear
          </span>
        </div>
      </div>

      {/* Step Progress Indicators */}
      <div className="flex items-center justify-between relative px-4">
        <div className="absolute left-8 right-8 top-4 -translate-y-1/2 h-1 bg-slate-200 -z-0 rounded-full" />
        <div 
          className="absolute left-8 top-4 -translate-y-1/2 h-1 bg-blue-600 -z-0 rounded-full transition-all duration-300"
          style={{ width: `${(step - 1) * 45}%` }}
        />
        
        {[
          { num: 1, label: 'Patient & Protocol' },
          { num: 2, label: 'Statutory ART Documents' },
          { num: 3, label: 'Review & Requisition' }
        ].map((item) => (
          <div key={item.num} className="flex flex-col items-center gap-1.5 bg-slate-100 z-10 px-2 py-0.5 rounded-lg">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
              step > item.num ? 'bg-emerald-600 text-white' : step === item.num ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-200 text-slate-500'
            }`}>
              {step > item.num ? <CheckCircle2 className="w-4 h-4" /> : item.num}
            </div>
            <span className={`text-[11px] font-semibold ${step >= item.num ? 'text-slate-900' : 'text-slate-400'}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Error alert */}
      {error && (
        <div className="bg-rose-50 text-rose-800 p-4 rounded-2xl border border-rose-200 flex items-start gap-3 text-xs animate-in fade-in">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* Main Form */}
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden">
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 sm:p-8 space-y-8">
            {/* Patient Info */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                Patient Recipient Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Patient Full Name *</label>
                  <input 
                    type="text" 
                    value={formData.patientName} 
                    onChange={e => setFormData({ ...formData, patientName: e.target.value })} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white" 
                    placeholder="Recipient Full Name" 
                    required 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Patient Age (Years) *</label>
                  <input 
                    type="number" 
                    value={formData.patientAge} 
                    onChange={e => setFormData({ ...formData, patientAge: e.target.value })} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white" 
                    placeholder="e.g. 31" 
                    required 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Recipient Blood Group</label>
                  <select 
                    value={formData.bloodGroup} 
                    onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  >
                    <option value="">Select Recipient Blood Group...</option>
                    <option>O+</option><option>A+</option><option>B+</option><option>AB+</option>
                    <option>O-</option><option>A-</option><option>B-</option><option>AB-</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Spouse / Partner Name (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.husbandName} 
                    onChange={e => setFormData({ ...formData, husbandName: e.target.value })} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white" 
                    placeholder="Spouse Name" 
                  />
                </div>
              </div>
            </div>

            {/* Medical / Treatment Details */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                Clinical Procedure & Allocation Protocol
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Treating ART Specialist / Doctor *</label>
                  <input 
                    type="text" 
                    value={formData.doctorName} 
                    onChange={e => setFormData({ ...formData, doctorName: e.target.value })} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white" 
                    placeholder="e.g. Dr. A. Sen, MD" 
                    required 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Planned ART Protocol *</label>
                  <select 
                    value={formData.procedureType} 
                    onChange={e => setFormData({ ...formData, procedureType: e.target.value })} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  >
                    <option value="IVF">IVF (In Vitro Fertilization)</option>
                    <option value="ICSI">ICSI (Intracytoplasmic Sperm Injection)</option>
                    <option value="IUI">IUI (Intrauterine Insemination)</option>
                    <option value="Other">Other Assisted Reproduction</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Estimated Procedure Date</label>
                  <input 
                    type="date" 
                    value={formData.expectedDate} 
                    onChange={e => setFormData({ ...formData, expectedDate: e.target.value })} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Sample Vials Requested *</label>
                  <select 
                    value={formData.quantity} 
                    onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  >
                    <option value={1}>1 Cryo Vial (Standard cycle)</option>
                    <option value={2}>2 Cryo Vials (Dual cycle backup)</option>
                    <option value={3}>3 Cryo Vials (Multiple cycle protocol)</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button 
                type="button" 
                onClick={handleNext} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                Proceed to Document Upload <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 sm:p-8 space-y-6">
            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-blue-900 leading-relaxed">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>Statutory Compliance Requirement:</strong> As per Chapter V, Section 22 of the ART (Regulation) Act 2021, registered ART clinics must furnish verified recipient identity proof, signed informed consents, and written specialist prescriptions before donor gamete allocation.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { 
                  id: 'aadhaar', 
                  label: 'Recipient Aadhaar / Passport', 
                  desc: 'Government photo identification proof',
                  req: true 
                },
                { 
                  id: 'consent', 
                  label: 'Signed Patient Consent Form', 
                  desc: 'Executed ART consent (Form 8 / Form 12)',
                  req: true 
                },
                { 
                  id: 'prescription', 
                  label: "Treating Doctor's Prescription", 
                  desc: 'Clinical requisition on hospital letterhead',
                  req: true 
                }
              ].map(doc => {
                const isUploaded = Boolean(documents[doc.id]);
                const isUploading = uploadingDoc === doc.id;

                return (
                  <div 
                    key={doc.id} 
                    className={`border rounded-2xl p-4 flex flex-col justify-between transition-all ${
                      isUploaded ? 'border-emerald-300 bg-emerald-50/30' : 'border-slate-200 hover:border-blue-400 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-bold text-slate-900 text-xs leading-snug">
                          {doc.label} {doc.req && <span className="text-rose-500">*</span>}
                        </h4>
                        {isUploaded && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-slate-400 mb-4">{doc.desc}</p>
                    </div>

                    <label className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                      isUploaded ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-200 hover:border-blue-400 bg-slate-50'
                    }`}>
                      <div className="flex flex-col items-center text-center">
                        {isUploading ? (
                          <>
                            <Loader2 className="w-5 h-5 mb-1.5 animate-spin text-blue-600" />
                            <span className="text-[11px] font-semibold text-blue-600">Uploading securely...</span>
                          </>
                        ) : isUploaded ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 mb-1 text-emerald-600" />
                            <span className="text-[11px] font-semibold text-emerald-700 truncate max-w-[180px]">
                              {documents[doc.id].name}
                            </span>
                            <span className="text-[10px] text-emerald-600 mt-0.5">Click to replace</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-5 h-5 mb-1 text-slate-400" />
                            <span className="text-[11px] font-semibold text-blue-600">Choose file to upload</span>
                            <span className="text-[10px] text-slate-400">PDF, JPG, PNG (Max 5MB)</span>
                          </>
                        )}
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".pdf,image/png,image/jpeg" 
                        disabled={isUploading}
                        onChange={e => handleFileUpload(e, doc.id, doc.label)} 
                      />
                    </label>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Back to Patient Info
              </button>
              <button 
                type="button" 
                onClick={handleNext} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                Review Requisition <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 sm:p-8 space-y-6">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                Requisition Verification & Summary
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Donor card */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5 pb-1 border-b border-slate-200">
                    <TestTube className="w-3.5 h-3.5 text-blue-600" /> Selected Donor Information
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Donor Code:</span>
                    <strong className="font-mono text-slate-900">{donor?.donorCode || donorId}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Gamete / Blood:</span>
                    <span className="font-semibold text-slate-800">{donor?.donorType || 'Sperm'} • {donor?.bloodGroup || 'O+'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phenotype Summary:</span>
                    <span className="text-slate-800">{donor?.complexion || 'Fair'}, {donor?.eyeColor || 'Brown'} eyes</span>
                  </div>
                </div>

                {/* Patient card */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5 pb-1 border-b border-slate-200">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" /> Patient & Procedure Summary
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Patient Name & Age:</span>
                    <strong className="text-slate-900">{formData.patientName} ({formData.patientAge} Years)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Treating Physician:</span>
                    <span className="font-semibold text-slate-800">{formData.doctorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Protocol & Vials:</span>
                    <span className="font-semibold text-slate-800">{formData.procedureType} • {formData.quantity} Vial{formData.quantity > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              {/* Uploaded Documents List */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-800">Attached Regulatory Dossiers</h4>
                <div className="space-y-2">
                  {Object.entries(documents).map(([key, doc]) => (
                    <div key={key} className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-white text-xs">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-slate-700">{doc.name}</span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Ready for Bank Review
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => setStep(2)} 
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Back to Documents
              </button>
              <button 
                type="button" 
                onClick={handleSubmit} 
                disabled={submitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-8 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting Requisition...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Submit Sample Requisition
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
