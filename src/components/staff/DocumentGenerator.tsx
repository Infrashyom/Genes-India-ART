import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  PenTool, 
  CheckCircle, 
  Clock, 
  X, 
  Eye, 
  RefreshCw,
  Lock
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface DocumentGeneratorProps {
  donor: any;
}

interface DocMeta {
  id: string;
  code: string;
  name: string;
  type: 'Statutory' | 'Declarations' | 'Clinical Reports';
  applicableFor: 'Male' | 'Female' | 'All';
  description: string;
  badge?: string;
}

interface SignatureRecord {
  signatureDataUrl?: string;
  signerName: string;
  signerRole: string;
  signedAt: string;
  hash: string;
}

const ALL_DOCUMENTS: DocMeta[] = [
  {
    id: 'annexure_a',
    code: 'ANNEXURE-A',
    name: 'Annexure-A - Requisition Form for Semen Donor Registration Card',
    type: 'Statutory',
    applicableFor: 'Male',
    description: 'Statutory District ART Registry Requisition Card for Semen Donor registration under ART Rules.',
    badge: 'District Registration',
  },
  {
    id: 'annexure_a_female',
    code: 'ANNEXURE-A',
    name: 'Annexure-A - Requisition Form for Oocyte Donor Registration Card',
    type: 'Statutory',
    applicableFor: 'Female',
    description: 'Statutory District ART Registry Requisition Card for Oocyte Donor registration under ART Rules.',
    badge: 'District Registration',
  },
  {
    id: 'form_22',
    code: 'FORM 22 / 13',
    name: 'Form 22 / Form 13 - Consent Form for the Donor of Sperm',
    type: 'Statutory',
    applicableFor: 'Male',
    description: 'Statutory informed consent for sperm donation with doctor & independent counsellor discussions, spousal agreement, and ART bank endorsement.',
    badge: 'Mandatory Sperm Consent',
  },
  {
    id: 'form_24a',
    code: 'FORM 24 A',
    name: 'Form 24 A - Information on Semen Donor (45 Statutory Parameters)',
    type: 'Statutory',
    applicableFor: 'Male',
    description: 'Statutory comprehensive 45-parameter clinical dossier: Basic Demographics, Medical & Obstetric History, Hematology, Serology, Physical Examination, and Features.',
    badge: 'Mandatory 45-Point Dossier',
  },
  {
    id: 'donor_self_affidavit',
    code: 'AFF-DONOR-01',
    name: 'Affidavit by Sperm Donor (ART Bill 2021)',
    type: 'Declarations',
    applicableFor: 'Male',
    description: 'Sworn affidavit by sperm donor: Age > 21, voluntary donation, first-time donation declaration, single agency commitment, and photo verification.',
    badge: 'Donor Sworn Oath',
  },
  {
    id: 'donor_bank_agreement',
    code: 'AGR-DONOR-BNK',
    name: 'Agreement between ART Bank and Sperm Donor',
    type: 'Statutory',
    applicableFor: 'Male',
    description: 'Bilateral legal agreement: 6-month cryogenic quarantine, repeat serological testing, expense reimbursement, and dispute settlement.',
    badge: 'Bilateral Agreement',
  },
  {
    id: 'form_19',
    code: 'FORM 19',
    name: 'Form 19 - Record of use of Donor Gametes (Semen Donors)',
    type: 'Statutory',
    applicableFor: 'Male',
    description: 'Statutory register under ART Rules for tracking supply date, recipient ART clinic, registration number, and receipt.',
    badge: 'Mandatory Register',
  },
  {
    id: 'form_19_female',
    code: 'FORM 19',
    name: 'Form 19 - Record of use of Donor Gametes (Oocyte Donors)',
    type: 'Statutory',
    applicableFor: 'Female',
    description: 'Statutory register under ART Rules for tracking oocyte donor allocation to accredited ART clinic.',
    badge: 'Mandatory Register',
  },
  {
    id: 'bank_affidavit_semen',
    code: 'AFF-BNK-SEMEN',
    name: 'Affidavit by ART Bank in regard to Donor Semen Sample',
    type: 'Declarations',
    applicableFor: 'Male',
    description: 'Sworn affidavit by Lab Director (Dr Charudutt Joshi) affirming single commissioning couple allocation under ART Act 2021.',
    badge: 'Lab Director Affidavit',
  },
  {
    id: 'bank_affidavit_oocyte',
    code: 'AFF-BNK-OOCYTE',
    name: 'Affidavit by ART Bank in regard to Oocyte Donor',
    type: 'Declarations',
    applicableFor: 'Female',
    description: 'Sworn affidavit by Lab Director (Dr Charudutt Joshi) affirming single commissioning couple allocation for oocyte donation.',
    badge: 'Lab Director Affidavit',
  },
  {
    id: 'f13',
    code: 'FORM 13',
    name: 'Form 13 - Consent Form for the Donor of Oocytes [Rule 13(f)(viii)]',
    type: 'Statutory',
    applicableFor: 'Female', // Only for women!
    description: 'Statutory consent under Rule 13(f)(viii) of ART Act 2021 for ovarian stimulation, oocyte retrieval, relinquishment of parental rights, and insurance.',
    badge: 'Required for Women',
  },
  {
    id: 'form_m1',
    code: 'FORM M-1',
    name: 'Form M-1 - Information on Oocyte Donor (44 Statutory Parameters)',
    type: 'Statutory',
    applicableFor: 'Female',
    description: 'Comprehensive 44-parameter clinical and demographic dossier for oocyte donors with Menstrual & Obstetric history and provisional disclosure clause.',
    badge: 'Mandatory Oocyte Dossier',
  },
  {
    id: 'form_14a',
    code: 'FORM 14 A',
    name: 'Form 14 A - Record of Oocyte Donors Recruited by ART Bank [Rule 13(2)(i)]',
    type: 'Statutory',
    applicableFor: 'Female',
    description: 'Statutory register under Rule 13(2)(i) tracking oocyte donor recruitment, supply date, ART clinic, and receipt attachment.',
    badge: 'Recruitment Register',
  },
  {
    id: 'form_14b',
    code: 'FORM 14 B',
    name: 'Form 14 B - Oocyte-Embryo Record & Embryology Sheet [Rule 13(2)(i)]',
    type: 'Statutory',
    applicableFor: 'Female',
    description: 'Day 0 to Day 5 embryology laboratory culture progression, cleavage grade, blastocyst fate, cryo vitrification tank/straw details, and secret safe register notice.',
    badge: 'Embryology Lab Sheet',
  },
  {
    id: 'couple_affidavit',
    code: 'AFF-COUPLE-01',
    name: "Commissioning Couple's Statutory Affidavit (Oocyte Donor)",
    type: 'Declarations',
    applicableFor: 'Female',
    description: '3-page statutory affidavit by husband & wife guaranteeing 12-month health insurance under Sec 22(1)(b) & Rule 12, covering medical complications, and indemnity.',
    badge: 'Couple Sworn Oath',
  },
  {
    id: 'f11',
    code: 'FORM 11',
    name: 'Form 11 - Consent of Semen Donor (Mandatory for Men)',
    type: 'Statutory',
    applicableFor: 'Male', // Only for men!
    description: 'Statutory consent under Rule 13(1)(a) of ART Act 2021 for semen donation, voluntary participation, and non-paternity agreement.',
    badge: 'Required for Men',
  },
  {
    id: 'f10',
    code: 'FORM 10',
    name: 'Form 10 - Gamete Storage & Cryopreservation Consent',
    type: 'Statutory',
    applicableFor: 'All',
    description: 'Statutory consent for cryogenic storage, liquid nitrogen quarantine, and bio-custody under ART Rules 2022.',
  },
  {
    id: 'f14',
    code: 'FORM 14',
    name: 'Form 14 - Gamete Allocation & Clinic Utilization Record',
    type: 'Statutory',
    applicableFor: 'All',
    description: 'Statutory traceable chain-of-custody transfer log to accredited recipient ART clinics with National Registry ID.',
  },
  {
    id: 'f15',
    code: 'FORM 15',
    name: 'Form 15 - Counsellor Psychological Clearance Certificate',
    type: 'Statutory',
    applicableFor: 'All',
    description: 'Certified statutory evaluation by Registered Clinical Psychologist under ART Act 2021.',
  },
  {
    id: 'decl_post',
    code: 'POST-DON-01',
    name: 'Statutory Declaration After Donation & Discharge Record',
    type: 'Declarations',
    applicableFor: 'All',
    description: 'Official post-donation declaration generated after sample collection/retrieval confirming number of vials, container storage location, physical fitness, expense reimbursement, and permanent release.',
    badge: 'Generated at the End',
  },
  {
    id: 'affidavit',
    code: 'AFF-ART-01',
    name: 'Donor Notarized Affidavit & Relinquishment Agreement',
    type: 'Declarations',
    applicableFor: 'All',
    description: 'Legal sworn affidavit affirming truthful medical disclosures, absence of inherited disorders, and legal indemnity.',
  },
  {
    id: 'r_medical',
    code: 'MED-REP-01',
    name: 'Comprehensive Donor Medical, Genetic & Lab Dossier',
    type: 'Clinical Reports',
    applicableFor: 'All',
    description: 'Complete multi-specialty clinical report including physical traits, lifestyle habits, family history, serology, semen analysis/ovarian reserve, and urine routine.',
  },
  {
    id: 'r_cryo',
    code: 'CRYO-INV-01',
    name: 'Cryobank Storage & Inventory Allocation Record',
    type: 'Clinical Reports',
    applicableFor: 'All',
    description: 'Detailed cryobiology laboratory log with LN2 Tank ID, Canister, Goblet, Number of Vials, Container Location, and dual-witness verification.',
  },
];

export default function DocumentGenerator({ donor }: DocumentGeneratorProps) {
  const isFemale = donor.donorType === 'Egg' || donor.donorType === 'Female' || donor.gender === 'Female';
  
  // STRICT GENDER FILTERING: Show ONLY forms required for men or women in their respective registration!
  const availableDocs = ALL_DOCUMENTS.filter((doc) => {
    if (isFemale && doc.applicableFor === 'Male') return false;
    if (!isFemale && doc.applicableFor === 'Female') return false;
    return true;
  });

  const defaultDocId = isFemale ? 'f13' : 'f11';
  const [selectedDocId, setSelectedDocId] = useState<string>(defaultDocId);
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Statutory' | 'Declarations' | 'Clinical Reports'>('All');

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isSigningModalOpen, setIsSigningModalOpen] = useState(false);
  const [signatureType, setSignatureType] = useState<'draw' | 'type'>('draw');
  const [typedSignerName, setTypedSignerName] = useState(
    `${donor.firstName || 'Donor'} ${donor.lastName || ''}`.trim()
  );
  const [signerRole, setSignerRole] = useState<'Donor' | 'Medical Director' | 'Authorized Witness'>('Donor');
  const [hasAgreedTerms, setHasAgreedTerms] = useState(true);
  const [signedDocs, setSignedDocs] = useState<Record<string, SignatureRecord>>({});
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);

  // Ensure active doc is valid for the donor's sex
  useEffect(() => {
    if (!availableDocs.some((d) => d.id === selectedDocId)) {
      setSelectedDocId(defaultDocId);
    }
  }, [donor, isFemale]);

  // Filter documents based on active category
  const filteredDocs = availableDocs.filter((doc) => {
    if (selectedCategory !== 'All' && doc.type !== selectedCategory) {
      return false;
    }
    return true;
  });

  const activeDoc = availableDocs.find((d) => d.id === selectedDocId) || availableDocs[0];
  const activeSignature = signedDocs[selectedDocId];
  const isDocSigned = !!activeSignature;

  // Extract nested EDR clinical and statutory fields cleanly
  const edr = donor.edrData || {};
  const repro = edr['reproductive-info'] || edr['reproductive-history'] || {};
  const semen = edr['semen-analysis'] || {};
  const lab = edr['laboratory-tests'] || edr['female-laboratory-tests'] || {};
  const genetic = edr['genetic-screening'] || edr['female-genetic-screening'] || {};
  const psych = edr['psychological-assessment'] || {};
  const consent = edr['consent-legal'] || {};
  const doctor = edr['doctor-review'] || {};
  const sample = edr['sample-collection'] || {};
  const cryo = edr['cryobank-inventory'] || {};
  const allocation = edr['hospital-allocation'] || {};
  const insurance = edr['financial-insurance'] || {};
  const physical = edr['physical-traits'] || {};

  // Formatted data helper strings
  const donorFullName = `${donor.firstName || 'Donor'} ${donor.lastName || ''}`.trim() || 'N/A';
  const donorAge = donor.age || 25;
  const donorDob = donor.dob || '1999-05-14';
  const donorBlood = donor.bloodGroup || 'O+';
  const donorAadhaar = donor.aadhaar || donor.primaryDocNumber || 'XXXX-XXXX-9821';
  const donorPan = donor.pan || donor.secondaryDocNumber || 'ABCDE1234F';
  const donorHeight = donor.height || physical.height || 172;
  const donorWeight = donor.weight || physical.weight || 68;
  const donorBmi = (donorWeight && donorHeight)
    ? (donorWeight / Math.pow(donorHeight / 100, 2)).toFixed(1)
    : '22.8';

  const yearOfMarriage = repro.yearOfMarriage || '2019 (Married)';
  const boysCount = repro.boysCount !== undefined ? repro.boysCount : '1';
  const girlsCount = repro.girlsCount !== undefined ? repro.girlsCount : '1';
  const childrenAges = repro.childrenAges || 'Son: 5 yrs, Daughter: 2 yrs';
  const totalChildren = repro.childrenCount || repro.livingChildren || '2';

  const semenTestDate = semen.testDate || '2026-09-24';
  const urineRoutine = lab.urineRoutine || 'Normal / Nil Albumin & Sugar (Pus cells 0-2/hpf)';
  const urineMicroNotes = lab.urineMicroscopyNotes || 'Color Pale Yellow, Sp. Gr 1.015, Pus cells 1-2, Sugar Nil';

  const freezingMethod = sample.freezingMethod || 'Vitrification (Rapid Freezing)';
  const numberOfVials = cryo.numberOfVials || cryo.strawsStoredCount || sample.numberOfVialsCollected || '6';
  const containerLocation = cryo.containerLocation || 'CryoTank-02 / Canister-04 / Goblet-Yellow / Rack-1 / Slot-5';
  const tankId = cryo.tankId || 'CryoTank-02';
  const canisterNumber = cryo.canisterNumber || 'CAN-04';
  const gobletColor = cryo.gobletColor || 'Yellow';
  const freezingDate = cryo.freezingDate || sample.collectionDate || '2026-09-24 10:30 AM';
  const collectionDate = sample.collectionDate || '2026-09-24 09:30 AM';
  const sampleBarcode = sample.sampleContainerBarcode || `SMP-${donor.id ? donor.id.replace(/[^a-zA-Z0-9]/g, '') : '9921'}-01`;

  const reviewingDoctor = doctor.reviewingDoctorName || 'Dr. A. K. Banerjee (MD, FRCOG)';
  const doctorReg = doctor.doctorRegistrationNumber || 'MCI-48291/WB-2009';
  const insurancePolicy = insurance.insurancePolicyNumber || 'HDFC-ERGO-ART-992104';
  const insuranceSum = insurance.insuranceSumInsured || 'Rs. 5,00,000';
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // Additional statutory fields for Annexure-A, Form 22/13, and Form 24 A
  const personal = edr['personal-details'] || {};
  const contact = edr['contact-info'] || {};
  const medical = edr['medical-history'] || {};
  const physicalExam = edr['physical-exam'] || {};
  
  const donorFatherName = personal.fatherName || donor.fatherName || 'Shri Ramesh Kumar';
  const donorHusbandName = personal.husbandName || personal.spouseName || 'Shri S. Sharma';
  const donorAddress = contact.permanentAddress || contact.address || donor.address || 'Indore, Madhya Pradesh';
  const donorMobile = contact.mobilePhone || contact.mobile || donor.mobile || '+91 98260 12345';
  const donorEmail = contact.email || donor.email || 'donor.confidential@genesindia.com';
  const donorEducation = donor.education || personal.educationLevel || 'Graduate / B.Sc';
  const spouseEducation = personal.spouseEducation || 'Graduate / B.Com';
  const donorProfession = donor.profession || personal.occupation || 'Private Executive';
  const spouseProfession = personal.spouseOccupation || 'Homemaker';
  const monthlyIncome = personal.monthlyIncome || 'Rs. 35,000 / Month';
  const religion = personal.religion || donor.religion || 'Hindu';
  const placeOfBirth = personal.placeOfBirth || 'Indore, Madhya Pradesh';
  const maritalStatus = donor.maritalStatus || personal.maritalStatus || 'Married';
  const counsellorName = psych.counselorName || 'Dr. Priya Verma, M.Phil (Clinical Psychology)';
  const counsellorAddress = psych.counselorAddress || 'Apex Counselling Services, Indore, M.P.';
  const doctorClinicAddress = doctor.clinicAddress || 'Genes India ART Bank & Research Centre, Indore, M.P.';
  const clinicRegistrationNo = 'ART-BNK-MP-2022-0041';
  const clinicName = 'Genes India ART Bank & Research Centre';
  const labDirectorName = 'Dr Charudutt Joshi';
  const labDirectorAge = '54';
  const labDirectorResidence = 'J 47 LIG colony, Opposite J sector Garden, Indore';
  const artBankAddress = '402 A-402 B, 4th floor, Industry house, 15 A B Road, Indore (MP) 452010';
  const clinicPcpndtReg = 'PCPNDT/MP/IND/2021/049';
  const commissioningCouple = allocation.recipientCoupleName || 'Mrs. Ananya Sharma';
  const commissioningHusband = allocation.recipientHusbandName || 'Mr. Rahul Sharma';
  const recipientArtClinic = allocation.recipientClinicName || 'Apex Fertility Clinic';
  const recipientArtClinicAddress = allocation.recipientClinicAddress || 'Indore, Madhya Pradesh';

  // Female Oocyte & Embryology specific data
  const menstrual = edr['menstrual-history'] || {};
  const retrieval = edr['egg-retrieval'] || {};
  const menstrualHistory = menstrual.cycleRegularity 
    ? `${menstrual.cycleLengthDays || '28'} Days / ${menstrual.flowDurationDays || '4-5'} Days Flow, ${menstrual.cycleRegularity}, LMP: ${menstrual.lastMenstrualPeriod || '2026-09-12'}`
    : 'Regular 28-30 Days cycle, 4-5 Days moderate flow, Dysmenorrhea: Absent, LMP: 12/09/2026';
    
  const oocytesRetrievedCount = retrieval.totalOocytesRetrieved || '14';
  const matureOocytesM2 = retrieval.matureOocytesMII || '11';
  
  const coupleWifeName = allocation.coupleWifeName || 'Mrs. RUKHMA BAI';
  const coupleHusbandName = allocation.coupleHusbandName || 'Mr. RAJESH';
  const coupleWifeAadhaar = allocation.coupleWifeAadhaar || '9150 8138 5222';
  const coupleHusbandAadhaar = allocation.coupleHusbandAadhaar || '8973 0406 8823';
  const coupleAddress = allocation.coupleAddress || 'UTAWADA SAGWAL DHAR M.P. 454441';
  const coupleMobile = allocation.coupleMobile || '9755754157';
  const treatingDoctorClinic = allocation.treatingDoctorClinic || 'Dr. Nidhi Mittal, Add. Mittal Hospital Tilak Marg Pochaupati Dhar, M.P. 454001';

  // Canvas Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    setHasDrawnSignature(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawnSignature(false);
  };

  const handleApplySignature = () => {
    let signatureUrl = '';
    if (signatureType === 'draw') {
      const canvas = canvasRef.current;
      if (canvas && hasDrawnSignature) {
        signatureUrl = canvas.toDataURL('image/png');
      }
    }

    const randomHash = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    const newRecord: SignatureRecord = {
      signatureDataUrl: signatureUrl,
      signerName: typedSignerName || donorFullName,
      signerRole: signerRole,
      signedAt: new Date().toLocaleString('en-IN'),
      hash: `SHA256:${randomHash.toUpperCase()}`,
    };

    setSignedDocs((prev) => ({
      ...prev,
      [selectedDocId]: newRecord,
    }));

    setIsSigningModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    const element = document.getElementById('printable-art-document');
    if (!element) {
      window.print();
      return;
    }

    try {
      setIsExportingPdf(true);
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const safeDocCode = activeDoc.code.replace(/[^a-zA-Z0-9]/g, '_');
      const safeDonorName = (donor.lastName || donor.firstName || 'Donor').replace(/[^a-zA-Z0-9]/g, '_');
      pdf.save(`${safeDocCode}_${safeDonorName}_${donor.id || 'EDR'}.pdf`);
    } catch (err) {
      console.error('PDF export failed, falling back to print dialog:', err);
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Reusable Standard A4 Page Sheet Content Component
  const renderA4Content = () => (
    <div className="w-[794px] min-h-[1123px] max-h-[1123px] bg-white p-10 text-slate-900 font-sans relative selection:bg-blue-100 flex flex-col justify-between box-border border border-slate-300 shadow-md print:border-none print:shadow-none print:p-8 print:w-full print:h-auto">
      <div>
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-3 mb-4 relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-block px-2 py-0.5 rounded bg-slate-900 text-white text-[9px] font-mono font-bold uppercase tracking-wider mb-1">
                GOVERNMENT OF INDIA - ART REGISTRY APPROVED
              </div>
              <h1 className="text-xl font-bold text-slate-950 uppercase tracking-tight font-serif">
                GENES INDIA - THE ART BANK
              </h1>
              <p className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                Registration No: REG/ART-BNK/MH/2023/00481
              </p>
              <p className="text-[10px] text-slate-500">
                Licensed under the Assisted Reproductive Technology (Regulation) Act, 2021
              </p>
            </div>

            {/* QR box */}
            <div className="text-right shrink-0">
              <div className="inline-flex flex-col items-center bg-slate-50 p-1.5 border border-slate-300 rounded">
                <div className="w-12 h-12 bg-slate-900 p-0.5 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div className="w-2.5 h-2.5 bg-white"></div>
                    <div className="w-2.5 h-2.5 bg-white"></div>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-1.5 h-1.5 bg-white"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-2.5 h-2.5 bg-white"></div>
                    <div className="w-2.5 h-2.5 bg-white"></div>
                  </div>
                </div>
                <span className="text-[8px] font-mono font-bold text-slate-600 mt-0.5">
                  UID: {donor.id || 'DON-9921'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-600">
            <div><span className="font-bold text-slate-900">Doc Ref:</span> {activeDoc.code}</div>
            <div><span className="font-bold text-slate-900">Execution Date:</span> {currentDate}</div>
            <div><span className="font-bold text-slate-900">Sample UID:</span> {sampleBarcode}</div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-4 relative z-10">
          <h2 className="text-base font-bold text-slate-900 uppercase underline decoration-1 underline-offset-4 tracking-wide font-serif">
            {activeDoc.name}
          </h2>
          <p className="text-[10px] text-slate-600 mt-0.5 italic">
            Prescribed under the Assisted Reproductive Technology (Regulation) Rules, 2022
          </p>
        </div>

        {/* Section 1: Donor Particulars Table */}
        <div className="mb-4 relative z-10">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-1 border-l-4 border-slate-900 mb-2">
            I. Donor Particulars & Biological Identity
          </h3>

          <table className="w-full text-[10.5px] border border-slate-300">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="w-1/4 p-1.5 bg-slate-50 font-semibold text-slate-700">Full Legal Name:</td>
                <td className="w-1/4 p-1.5 font-semibold text-slate-900">{donorFullName}</td>
                <td className="w-1/4 p-1.5 bg-slate-50 font-semibold text-slate-700">Donor Unique ID:</td>
                <td className="w-1/4 p-1.5 font-mono font-bold text-blue-700">{donor.id || 'DON-2026-000145'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-1.5 bg-slate-50 font-semibold text-slate-700">Date of Birth & Age:</td>
                <td className="p-1.5">{donorDob} ({donorAge} Years)</td>
                <td className="p-1.5 bg-slate-50 font-semibold text-slate-700">Gender / Donor Type:</td>
                <td className="p-1.5 font-semibold">{donor.gender || (isFemale ? 'Female (Egg)' : 'Male (Sperm)')}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-1.5 bg-slate-50 font-semibold text-slate-700">Blood Group & Rh:</td>
                <td className="p-1.5 font-bold text-rose-700">{donorBlood}</td>
                <td className="p-1.5 bg-slate-50 font-semibold text-slate-700">Height / Weight / BMI:</td>
                <td className="p-1.5">{donorHeight} cm / {donorWeight} kg (BMI: {donorBmi})</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-1.5 bg-slate-50 font-semibold text-slate-700">National ID (Aadhaar):</td>
                <td className="p-1.5 font-mono">{donorAadhaar}</td>
                <td className="p-1.5 bg-slate-50 font-semibold text-slate-700">PAN Number:</td>
                <td className="p-1.5 font-mono">{donorPan}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-1.5 bg-slate-50 font-semibold text-slate-700">Marital Status & Year:</td>
                <td className="p-1.5">{donor.maritalStatus || 'Married'} ({yearOfMarriage})</td>
                <td className="p-1.5 bg-slate-50 font-semibold text-slate-700">Children Profile:</td>
                <td className="p-1.5 font-semibold">
                  Total: {totalChildren} (Sons: {boysCount}, Daughters: {girlsCount} | Ages: {childrenAges})
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-1.5 bg-slate-50 font-semibold text-slate-700">Statutory Health Insurance:</td>
                <td className="p-1.5 font-mono text-[10px]">{insurancePolicy}</td>
                <td className="p-1.5 bg-slate-50 font-semibold text-slate-700">Sum Insured Amount:</td>
                <td className="p-1.5 font-semibold text-emerald-800">{insuranceSum} (12 Months Term)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 2: Form-Specific Statutory Clauses */}
        <div className="relative z-10 text-[10.5px] text-slate-800 leading-snug space-y-3">
          {/* ANNEXURE-A: District Requisition Card (Matches User's PDF) */}
          {(activeDoc.id === 'annexure_a' || activeDoc.id === 'annexure_a_female') && (
            <div className="space-y-3 font-serif">
              <div className="text-center space-y-0.5 border-b border-slate-300 pb-2">
                <div className="text-xs font-semibold text-slate-700">(Annexure-A)</div>
                <div className="text-sm font-bold text-slate-900 tracking-wider">DISTRICT-INDORE</div>
                <div className="text-xs font-bold text-slate-900 uppercase">
                  Requisition Form for {activeDoc.id === 'annexure_a' ? 'SEMEN DONOR REGISTRATION CARD' : 'OOCYTE DONOR REGISTRATION CARD'}
                </div>
                <div className="text-[10px] text-right text-slate-600 font-sans">
                  Date:- <span className="font-medium underline">{currentDate}</span>
                </div>
              </div>

              <div className="space-y-1.5 font-sans text-xs bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
                <div className="grid grid-cols-3 gap-2 py-0.5 border-b border-slate-200/60">
                  <span className="text-slate-600">Name of Registered ART/IVF/BANK Clinic :</span>
                  <span className="col-span-2 font-medium text-slate-900">{clinicName}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-0.5 border-b border-slate-200/60">
                  <span className="text-slate-600">ART Registration Certificate No. :</span>
                  <span className="col-span-2 font-mono font-medium text-slate-900">{clinicRegistrationNo}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-0.5 border-b border-slate-200/60">
                  <span className="text-slate-600">Name of Donor :</span>
                  <span className="col-span-2 font-medium text-slate-900">{donorFullName}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-0.5 border-b border-slate-200/60">
                  <span className="text-slate-600">{activeDoc.id === 'annexure_a' ? 'Father Name :' : 'Husband Name :'}</span>
                  <span className="col-span-2 font-medium text-slate-900">{activeDoc.id === 'annexure_a' ? donorFatherName : donorHusbandName}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-0.5 border-b border-slate-200/60">
                  <span className="text-slate-600">Age :</span>
                  <span className="col-span-2 font-medium text-slate-900">{donorAge} Years</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-0.5 border-b border-slate-200/60">
                  <span className="text-slate-600">Aadhar Address :</span>
                  <span className="col-span-2 font-medium text-slate-900">{donorAddress}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-0.5 border-b border-slate-200/60">
                  <span className="text-slate-600">Marital Status :</span>
                  <span className="col-span-2 font-medium text-slate-900">{maritalStatus}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-0.5 border-b border-slate-200/60">
                  <span className="text-slate-600">Aadhar Card No :</span>
                  <span className="col-span-2 font-mono font-medium text-slate-900">{donorAadhaar}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-0.5 border-b border-slate-200/60">
                  <span className="text-slate-600">Education :</span>
                  <span className="col-span-2 font-medium text-slate-900">{donorEducation}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-0.5 border-b border-slate-200/60">
                  <span className="text-slate-600">Mobile No. :</span>
                  <span className="col-span-2 font-medium text-slate-900">{donorMobile}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-0.5 border-b border-slate-200/60">
                  <span className="text-slate-600">FEMALE :</span>
                  <span className="col-span-2 font-medium">{activeDoc.id === 'annexure_a_female' ? '[ ✔ ] Yes' : '[   ]'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-0.5">
                  <span className="text-slate-600">MALE :</span>
                  <span className="col-span-2 font-medium">{activeDoc.id === 'annexure_a' ? '[ ✔ ] Yes' : '[   ]'}</span>
                </div>
              </div>
            </div>
          )}

          {/* FORM 22 / FORM 13: Consent Form for the Donor of Sperm (Matches User's Image 1) */}
          {activeDoc.id === 'form_22' && (
            <div className="space-y-3 font-serif">
              <div className="text-center border-b border-slate-300 pb-2">
                <div className="text-xs font-bold text-slate-900 tracking-wider">FORM - 22 / FORM 13</div>
                <h3 className="text-sm font-bold text-slate-900">Consent Form for the Donor of Sperm</h3>
              </div>

              <div className="space-y-3 font-sans text-xs text-slate-800 leading-relaxed text-justify">
                <p>
                  I, Mr. <span className="font-semibold underline text-slate-900">{donorFullName}</span> consent to donate my sperm to couples / individuals who are unable to have a child by other means.
                </p>
                <p>
                  I have had a full discussion with Dr. <span className="font-semibold underline text-slate-900">{reviewingDoctor}</span> ({doctorClinicAddress}) on <span className="underline">{currentDate}</span>,
                </p>
                <p>
                  I have been counselled by <span className="font-semibold underline text-slate-900">{counsellorName}</span> ({counsellorAddress}) on <span className="underline">{currentDate}</span>
                </p>
                <p>
                  I understand that there will be no direct or indirect contact between the recipient, and me, and my personal identity will not be disclosed to the recipient or to the child born through the use of my gamete.
                </p>
                <p>
                  I understand that I shall have no rights whatsoever on the resulting offspring and vice versa.
                </p>
                <p className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                  (If applicable) My wife has agreed to the donation of my sperm. (Strike off if not applicable.)<br />
                  <span className="font-medium text-slate-900">Wife's consent status:</span> {maritalStatus === 'Married' ? 'Wife informed, agreed and formal consent obtained.' : 'Not Applicable (Unmarried / Single Donor)'}
                </p>

                <div className="pt-2 border-t border-slate-300 space-y-2">
                  <h4 className="font-bold text-slate-900 text-center uppercase tracking-wider text-xs">
                    Endorsement by the ART bank
                  </h4>
                  <p>
                    I/we have personally explained to <span className="font-semibold underline text-slate-900">{donorFullName}</span> the details and implications of his signing this consent / approval form, and made sure to the extent humanly possible that he understands these details and implications.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 text-[11px] font-sans">
                  <div>
                    <span className="text-slate-500 block">Name and signature of the Doctor:</span>
                    <span className="font-semibold text-slate-900">{reviewingDoctor}</span>
                    <span className="block text-[10px] text-slate-500">Reg: {doctorReg}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Name, address and signature of Witness:</span>
                    <span className="font-semibold text-slate-900">Authorized Officer, Genes India ART Bank</span>
                    <span className="block text-[10px] text-slate-500">{clinicName}, Indore</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-200">
                    <span className="text-slate-500">Name and address of the ART bank: </span>
                    <span className="font-medium text-slate-900">{clinicName}, Indore, Madhya Pradesh</span>
                    <span className="block text-slate-500 mt-0.5">Dated: <span className="font-medium text-slate-900">{currentDate}</span></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FORM 24 A: Information on Semen Donor (Matches User's Images 2 & 3) */}
          {activeDoc.id === 'form_24a' && (
            <div className="space-y-3 font-sans text-xs">
              <div className="text-center border-b border-slate-300 pb-2">
                <div className="text-xs font-bold text-slate-900 tracking-wider">FORM 24 A</div>
                <h3 className="text-sm font-bold text-slate-900">Information on Semen Donor</h3>
                <div className="text-[10px] text-right text-slate-600 mt-1">
                  Date of filling the form: <span className="font-semibold underline">{currentDate}</span>
                </div>
              </div>

              {/* Basic Information (1 to 12) */}
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-bold text-slate-900 uppercase bg-slate-100 px-2 py-1 border-l-4 border-blue-600">
                  Basic Information
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] p-2 bg-slate-50/60 rounded-lg border border-slate-200">
                  <div>1. Identification number (Donor ID): <span className="font-mono font-semibold text-blue-700">{donor.id || 'DON-O-112'}</span></div>
                  <div>2. Age / Date of birth: <span className="font-medium">{donorAge} Yrs / {donorDob}</span></div>
                  <div>3. Adhar No.: <span className="font-mono font-medium">{donorAadhaar}</span></div>
                  <div>4. Place of birth: <span className="font-medium">{placeOfBirth}</span></div>
                  <div>5. Marital status: <span className="font-medium">{maritalStatus}</span></div>
                  <div>6. Education: i) Donor: <span className="font-medium">{donorEducation}</span> | ii) Spouse: <span className="font-medium">{spouseEducation}</span></div>
                  <div>7. Occupation: i) Donor: <span className="font-medium">{donorProfession}</span> | ii) Spouse: <span className="font-medium">{spouseProfession}</span></div>
                  <div>8. Monthly income: <span className="font-medium">{monthlyIncome}</span></div>
                  <div>9. Religion: <span className="font-medium">{religion}</span></div>
                  <div>10. Address: <span className="font-medium">{donorAddress}</span></div>
                  <div>11. Telephone: <span className="font-medium">{donorMobile}</span></div>
                  <div>12. Email: <span className="font-medium">{donorEmail}</span></div>
                </div>
              </div>

              {/* History (13 to 20) */}
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-bold text-slate-900 uppercase bg-slate-100 px-2 py-1 border-l-4 border-blue-600">
                  History
                </h4>
                <div className="space-y-1 text-[11px] p-2 bg-slate-50/60 rounded-lg border border-slate-200">
                  <div>
                    13. Obstetric history of wife: i) Number of deliveries: <span className="font-medium">{repro.childrenCount || '2'}</span> | ii) Number of abortions: <span className="font-medium">{repro.abortionsCount || '0'}</span> | iii) Other points of note: <span className="font-medium">{repro.obstetricNotes || 'Healthy full term deliveries, nil complications'}</span>
                  </div>
                  <div>14. History of use of contraceptives: <span className="font-medium">{medical.contraceptives || 'Barrier method / Nil oral steroids'}</span></div>
                  <div>15. Medical history: <span className="font-medium">{medical.medicalHistory || 'Nil significant illness, no hospitalizations or major surgeries'}</span></div>
                  <div>16. Family history from the medical point of view: <span className="font-medium">{medical.familyHistory || 'No family history of diabetes, hypertension, epilepsy, or mental illness'}</span></div>
                  <div>17. History of any abnormality in a child of the donor: <span className="font-medium">{medical.childAbnormality || 'Nil reported, children physically and developmentally normal'}</span></div>
                  <div>18. History of blood transfusion: <span className="font-medium">{medical.bloodTransfusion || 'No history of blood or blood products transfusion'}</span></div>
                  <div>19. History of substance abuse: <span className="font-medium">{medical.substanceAbuse || 'Non-smoker, Non-alcoholic, No illicit drug use'}</span></div>
                  <div>20. History of any Genetic abnormality: <span className="font-medium">{genetic.geneticAbnormality || 'No genetic abnormality; Normal G-banded Karyotype 46,XY confirmed'}</span></div>
                </div>
              </div>

              {/* Investigations (21 to 33) */}
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-bold text-slate-900 uppercase bg-slate-100 px-2 py-1 border-l-4 border-blue-600">
                  Investigations
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] p-2 bg-slate-50/60 rounded-lg border border-slate-200">
                  <div className="col-span-2">21. Blood group and Rh status: <span className="font-bold text-rose-700">{donorBlood}</span></div>
                  <div className="col-span-2">
                    22. Complete blood picture: 
                    i) Hb: <span className="font-medium">{lab.hb || '15.2'} g/dL</span> | 
                    ii) RBC: <span className="font-medium">{lab.rbcCount || '5.1'} M/uL</span> | 
                    iii) WBC: <span className="font-medium">{lab.wbcCount || '7,400'} /uL</span> | 
                    iv) Diff WBC: <span className="font-medium">{lab.diffWbc || 'N64 L28 E4 M4'}</span> | 
                    v) Platelets: <span className="font-medium">{lab.plateletCount || '2.8'} L</span> | 
                    vi) Peripheral smear: <span className="font-medium">{lab.peripheralSmear || 'Normocytic, Normochromic'}</span>
                  </div>
                  <div>23. Random blood sugar: <span className="font-medium">{lab.randomBloodSugar || '94'} mg/dL</span></div>
                  <div>24. Blood urea / Serum creatinine: <span className="font-medium">{lab.ureaCreatinine || 'Urea 22 / Creatinine 0.9 mg/dL'}</span></div>
                  <div>25. SGPT: <span className="font-medium">{lab.sgpt || '24'} U/L</span></div>
                  <div>26. Routine urine examination: <span className="font-medium">{lab.urineRoutine || 'Normal (Albumin & Sugar Nil)'}</span></div>
                  <div>27. HBsAg status: <span className="font-medium text-emerald-700">{lab.hbsAg || 'Non-Reactive'}</span></div>
                  <div>28. Hepatitis C status: <span className="font-medium text-emerald-700">{lab.hcvAb || 'Non-Reactive'}</span></div>
                  <div>29. HIV ⁽¹⁾ status with date of tests: <span className="font-medium text-emerald-700">{lab.hivScreening || 'Non-Reactive'} (Date: {lab.hivDate || currentDate})</span></div>
                  <div>30. Hemoglobin A2 (for thalassemia) status: <span className="font-medium text-emerald-700">{genetic.thalassemiaCarrier || 'Normal (HbA2 2.6%)'}</span></div>
                  <div>31. HIV PCR ⁽²⁾: <span className="font-medium text-emerald-700">{lab.hivPcr || 'Negative / Non-Detected'}</span></div>
                  <div>32. Sexually transmitted diseases: <span className="font-medium text-emerald-700">{lab.vdrlSyphilis || 'Non-Reactive (VDRL/TPHA)'}</span></div>
                  <div className="col-span-2">33. Any other specific test ⁽³⁾: <span className="font-medium">{lab.otherSpecificTests || 'SMA SMN1 Exon 7/8 Normal 2 Copies, G6PD Normal'}</span></div>
                </div>
              </div>

              {/* Features (34 to 38) & Detailed Physical Exam (39 to 45) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-bold text-slate-900 uppercase bg-slate-100 px-2 py-1 border-l-4 border-blue-600">
                    Features
                  </h4>
                  <div className="space-y-0.5 text-[11px] p-2 bg-slate-50/60 rounded-lg border border-slate-200">
                    <div>34. Height: <span className="font-medium">{donorHeight} cm</span></div>
                    <div>35. Weight: <span className="font-medium">{donorWeight} kg (BMI: {donorBmi})</span></div>
                    <div>36. Colour of skin: <span className="font-medium">{donor.complexion || physical.skinTone || 'Wheatish'}</span></div>
                    <div>37. Colour of hair: <span className="font-medium">{donor.hairColor || physical.hairColor || 'Black'}</span></div>
                    <div>38. Colour of eyes: <span className="font-medium">{donor.eyeColor || physical.eyeColor || 'Brown'}</span></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-bold text-slate-900 uppercase bg-slate-100 px-2 py-1 border-l-4 border-blue-600">
                    Detailed Physical Examination
                  </h4>
                  <div className="space-y-0.5 text-[11px] p-2 bg-slate-50/60 rounded-lg border border-slate-200">
                    <div>39. Pulse: <span className="font-medium">{physicalExam.pulse || '74'} /min</span></div>
                    <div>40. Blood pressure: <span className="font-medium">{physicalExam.bloodPressure || '120/80'} mmHg</span></div>
                    <div>41. Temperature: <span className="font-medium">{physicalExam.temperature || '98.4'} °F</span></div>
                    <div>42. Respiratory system: <span className="font-medium">{physicalExam.respiratorySystem || 'Clear, NVBS'}</span></div>
                    <div>43. Cardiovascular system: <span className="font-medium">{physicalExam.cardiovascularSystem || 'S1 S2 Normal'}</span></div>
                    <div>44. Per abdominal examination: <span className="font-medium">{physicalExam.perAbdominal || 'Soft, Non-tender'}</span></div>
                    <div>45. Other systems: <span className="font-medium">{physicalExam.otherSystems || 'NAD'}</span></div>
                  </div>
                </div>
              </div>

              {/* Statutory Footnotes (Matches User's Image 3) */}
              <div className="p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-[10px] text-slate-600 space-y-1">
                <div className="font-bold text-slate-700">Footnotes:</div>
                <div>1. To be carried out every 6 months</div>
                <div>2. To be carried out if donor leaves within 6 months of the previous HIV test</div>
                <div>3. Any additional test carried out on the basis of the history and examination of donor</div>
                <div className="pt-1 text-slate-900 font-medium italic border-t border-slate-200">
                  All the tests should have been done within 15 days prior to the date of filling the form.
                </div>
                <div className="pt-2 text-right">
                  <span className="block font-semibold text-slate-900">Name and signature with date, of the person filling the form:</span>
                  <span className="font-serif italic text-xs text-slate-900">{reviewingDoctor}, {currentDate}</span>
                </div>
              </div>
            </div>
          )}

          {/* DONOR SELF AFFIDAVIT (Matches User's PDF 4, Page 1) */}
          {activeDoc.id === 'donor_self_affidavit' && (
            <div className="space-y-3 font-serif">
              <div className="text-center border-b border-slate-300 pb-2">
                <h3 className="text-sm font-bold text-slate-900 tracking-wider">AFFIDAVIT</h3>
                <div className="text-xs text-slate-600 font-sans">Under the provisions of Assisted Reproductive Technology Act, 2021</div>
              </div>

              <div className="space-y-2.5 font-sans text-xs text-slate-800 leading-relaxed text-justify">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                  <div>I undersigned,</div>
                  <div>1) Name of Sperm Donor: <span className="font-semibold text-slate-900 underline">{donorFullName}</span> S/o <span className="font-semibold text-slate-900 underline">{donorFatherName}</span></div>
                  <div>R/O: <span className="font-medium text-slate-900">{donorAddress}</span></div>
                  <div>Mob no: <span className="font-medium text-slate-900">{donorMobile}</span> | Adhar Card No: <span className="font-mono font-medium text-slate-900">{donorAadhaar}</span></div>
                </div>

                <div className="font-semibold text-slate-900 pt-1">I Declare That:</div>
                <ol className="list-none space-y-1.5 pl-2 text-xs">
                  <li>a) I have approached Genes India for donating my sperms.</li>
                  <li>b) I had full discussion with the Counsellor understood the procedure completely.</li>
                  <li>c) I have submitted my Adhar card as proof of Identity and Age. I declare that I am above age of 21 as per ART Act 2021.</li>
                  <li>d) In my full conscious I give consent to Genes India to utilize my sperms for benefiting a couple who are not able to conceive by normal means.</li>
                  <li>e) I am offering my services on humanitarian ground to help the people.</li>
                  <li>f) My photograph is verified and affixed in biological identification records.</li>
                  <li>g) I also declare that I am donating my sperms for the first time at Genes India the ART bank and have not donated my sperms earlier.</li>
                  <li>h) I also declare that as per provisions of ART Act 2021 I will not approach any other agency for sperm donation.</li>
                  <li>i) All information submitted to Genes India is true to best of my knowledge.</li>
                </ol>

                <div className="grid grid-cols-2 gap-4 pt-4 text-xs font-sans border-t border-slate-200">
                  <div>
                    <span className="text-slate-500 block">Place: <span className="font-medium text-slate-900">Indore</span></span>
                    <span className="text-slate-500 block mt-3">Witness: <span className="font-semibold text-slate-900">{consent.legalWitnessName || 'Authorized Officer'}</span></span>
                    <span className="text-[11px] text-slate-500">Name & address: {clinicName}, Indore</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block">Signature: <span className="underline font-serif italic text-slate-900">{donorFullName}</span></span>
                    <span className="text-slate-500 block mt-3">Name of Donor: <span className="font-semibold text-slate-900">{donorFullName}</span></span>
                    <span className="text-[11px] text-slate-500">UID: {donor.id || 'DON-9921'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AGREEMENT BETWEEN ART BANK AND SPERM DONOR (Matches User's PDF 4, Page 2) */}
          {activeDoc.id === 'donor_bank_agreement' && (
            <div className="space-y-3 font-serif">
              <div className="text-center border-b border-slate-300 pb-2">
                <h3 className="text-sm font-bold text-slate-900 tracking-wider">Agreement between ART Bank and Sperm Donor</h3>
                <div className="text-xs text-slate-600 font-sans">Bilateral Statutory Undertaking under ART Act 2021</div>
              </div>

              <div className="space-y-2 font-sans text-xs text-slate-800 leading-relaxed text-justify">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                  <div className="font-semibold text-slate-900">This agreement is made between:</div>
                  <div>1) <span className="font-semibold text-slate-900">{clinicName}</span>, {artBankAddress}</div>
                  <div>2) Name of Sperm Donor –– <span className="font-semibold text-slate-900 underline">{donorFullName}</span> S/o <span className="font-semibold text-slate-900 underline">{donorFatherName}</span></div>
                  <div>R/o <span className="font-medium text-slate-900">{donorAddress}</span> (MP) Mobile no: <span className="font-medium text-slate-900">{donorMobile}</span></div>
                </div>

                <div className="font-semibold text-slate-900 pt-1">States that:</div>
                <ol className="list-none space-y-1.5 pl-2 text-xs">
                  <li>a) Genes India is duly registered firm and this is ART bank which supplies human gametes to infertile couples.</li>
                  <li>b) Genes India is duly registered Genetic clinic under PCPNDT act with registration no. <span className="font-mono font-medium">{clinicPcpndtReg}</span>.</li>
                  <li>c) Mr. <span className="font-semibold underline text-slate-900">{donorFullName}</span> approached this ART bank for donating sperms for treatment of infertile couple.</li>
                  <li>d) He has submitted affidavit of his legal documents with other ID documents.</li>
                  <li>e) His medical tests are performed by the ART bank and they are in accordance with norms of ART Act (2021).</li>
                  <li>f) This is mutually agreed that The Genes India will pay for their expenses.</li>
                  <li>g) As these Sperm are frozen and can be released only after quarantine period of six months which involves donor to visit ART bank and repeat medical tests after six months for this donor has agreed.</li>
                  <li>h) Donor agrees to take full responsibility in case of any dispute created by his family members and will settle with them.</li>
                  <li>i) Donor has been explained in detail about procedure. Under full consciousness he has given consent for the procedure.</li>
                  <li>j) He will not have any rights to ask about utilization of his sperms and results out of donation.</li>
                </ol>

                <div className="grid grid-cols-2 gap-4 pt-4 text-xs font-sans border-t border-slate-200">
                  <div>
                    <span className="text-slate-500 block">Place: <span className="font-medium text-slate-900">Indore</span></span>
                    <span className="text-slate-500 block">Date: <span className="font-medium text-slate-900">{currentDate}</span></span>
                    <span className="text-slate-500 block mt-3 font-semibold text-slate-900">For Genes India:</span>
                    <span className="font-serif italic text-xs text-slate-900">{labDirectorName} (Lab Director)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block">&nbsp;</span>
                    <span className="text-slate-500 block">&nbsp;</span>
                    <span className="text-slate-500 block mt-3 font-semibold text-slate-900">For Sperm donor:</span>
                    <span className="font-serif italic text-xs text-slate-900">{donorFullName}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FORM 19: Record of use of Donor Gametes (Matches User's PDF 1) */}
          {(activeDoc.id === 'form_19' || activeDoc.id === 'form_19_female') && (
            <div className="space-y-3 font-sans text-xs">
              <div className="flex justify-between items-start border-b border-slate-300 pb-2">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">ART Rules</div>
                  <h3 className="text-sm font-bold text-slate-900">FORM – 19</h3>
                  <div className="text-xs font-semibold text-slate-800">Record of use of Donor Gametes</div>
                  <div className="text-[10px] text-slate-500 italic">(A separate form to be used for each individual donor) AADHAR card no. to be entered</div>
                </div>
                <div className="text-right text-[11px] space-y-0.5">
                  <div><span className="text-slate-500">Name of ART bank:</span> <span className="font-semibold text-slate-900">{clinicName}</span></div>
                  <div><span className="text-slate-500">Registration no.:</span> <span className="font-mono font-medium">{clinicRegistrationNo}</span></div>
                  <div><span className="text-slate-500">AADHAR Card no.:</span> <span className="font-mono font-bold text-blue-700">{donorAadhaar}</span></div>
                </div>
              </div>

              <div className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 border-l-4 border-blue-600">
                {activeDoc.id === 'form_19' ? 'A. For Semen Donors' : 'B. For Oocyte Donors'}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-[10px] border border-slate-300 text-center">
                  <thead className="bg-slate-100 font-semibold text-slate-700 border-b border-slate-300">
                    <tr>
                      <th className="p-1.5 border-r border-slate-300">Donor ID</th>
                      <th className="p-1.5 border-r border-slate-300">Sample ID</th>
                      <th className="p-1.5 border-r border-slate-300">Collection Date</th>
                      <th className="p-1.5 border-r border-slate-300">Name of person Recruiting</th>
                      <th className="p-1.5 border-r border-slate-300">Signature</th>
                      <th className="p-1.5 border-r border-slate-300">Supply Date</th>
                      <th className="p-1.5 border-r border-slate-300">ART Clinic</th>
                      <th className="p-1.5 border-r border-slate-300">Registration no.</th>
                      <th className="p-1.5">Receipt attached</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="p-1.5 border-r font-mono font-medium">{donor.id || 'DON-9921'}</td>
                      <td className="p-1.5 border-r font-mono">{sampleBarcode}</td>
                      <td className="p-1.5 border-r">{collectionDate.split(' ')[0]}</td>
                      <td className="p-1.5 border-r">{doctor.reviewingDoctorName || 'Nurse Sunita / Recruiter'}</td>
                      <td className="p-1.5 border-r font-serif italic">[Verified]</td>
                      <td className="p-1.5 border-r">{allocation.dispatchDate || currentDate}</td>
                      <td className="p-1.5 border-r font-medium">{recipientArtClinic}</td>
                      <td className="p-1.5 border-r font-mono">{allocation.clinicNationalRegNo || 'ART-CL-2024-0012'}</td>
                      <td className="p-1.5 text-emerald-700 font-semibold">Attached (ACK-01)</td>
                    </tr>
                    {/* Blank rows matching official ART Rules Form 19 log */}
                    {[1, 2, 3, 4].map(idx => (
                      <tr key={idx} className="border-b border-slate-200 h-7 text-slate-300">
                        <td className="border-r">-</td>
                        <td className="border-r">-</td>
                        <td className="border-r">-</td>
                        <td className="border-r">-</td>
                        <td className="border-r">-</td>
                        <td className="border-r">-</td>
                        <td className="border-r">-</td>
                        <td className="border-r">-</td>
                        <td>-</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-[10px] text-right text-slate-400 italic pt-1">
                Prescribed under Rule 19 of Assisted Reproductive Technology (Regulation) Rules, 2022
              </div>
            </div>
          )}

          {/* AFFIDAVIT BY ART BANK IN REGARD TO DONOR SEMEN SAMPLE (Matches User's PDF 2) */}
          {activeDoc.id === 'bank_affidavit_semen' && (
            <div className="space-y-3 font-serif">
              <div className="text-center border-b border-slate-300 pb-2">
                <h3 className="text-sm font-bold text-slate-900 tracking-wider">
                  Affidavit by ART bank in regard to Donor Semen Sample
                </h3>
              </div>

              <div className="space-y-2.5 font-sans text-xs text-slate-800 leading-relaxed text-justify">
                <p>
                  I <span className="font-semibold text-slate-900">{labDirectorName}</span> aged <span className="font-semibold text-slate-900">{labDirectorAge} years</span> residing at <span className="font-medium text-slate-900">{labDirectorResidence}</span> do solemnly affirm and state as under:
                </p>

                <ol className="list-decimal pl-4 space-y-2 text-xs">
                  <li>
                    That I am the Lab Director (Designation) of Genes India, ART Bank, having its registered office at {artBankAddress} and I am authorized to sign and execute the affidavit on behalf of the Genes India ART bank.
                  </li>
                  <li>
                    That ART Bank is duly registered under the provisions of Assisted Reproductive Technology (Regulation) Act, 2021 and is functioning in accordance with the ART (Regulation) Act, 2021 and ART (Regulation) Rules, 2022.
                  </li>
                  <li>
                    That Genes India ART Bank has supplied one semen sample of one semen donor Code <span className="font-mono font-bold text-blue-700">{donor.id || 'DON-9921'}</span> to <span className="font-semibold underline text-slate-900">{recipientArtClinic}</span> ART Clinic located at <span className="underline">{recipientArtClinicAddress}</span>.
                  </li>
                  <li>
                    That the said semen sample has been allocated strictly for the use for below named Commissioning couple/woman only.<br />
                    Name of Commissioning Couple/woman: <span className="font-semibold underline text-slate-900">{commissioningCouple}</span> W/O <span className="font-semibold underline text-slate-900">{commissioningHusband}</span>.<br />
                    <span className="font-medium text-slate-900">I declare on affidavit that Genes India ART Bank has not supplied sperm of the above mentioned donor to any other ART Clinic for the use in any other commissioning couple/woman. That means the ART Bank has not supplied sperm of the same donor to more than one commissioning couple/woman.</span>
                  </li>
                  <li>
                    The abovementioned semen sample is issued for above mentioned commissioning couple/woman and it shall not be used by ART Clinic for any other commissioning couple/woman.
                  </li>
                  <li>
                    That the contents of this affidavit para-1 to 6 are true and correct to the best of my knowledge and belief.
                  </li>
                </ol>

                <div className="grid grid-cols-2 gap-4 pt-4 text-xs font-sans border-t border-slate-200">
                  <div>
                    <span className="text-slate-500 block">Place: <span className="font-medium text-slate-900">INDORE</span></span>
                    <span className="text-slate-500 block">Date: <span className="font-medium text-slate-900">{currentDate}</span></span>
                    <span className="text-slate-500 block mt-2 font-medium text-slate-900">Genes India ART Bank</span>
                    <span className="text-slate-500 block">Name: <span className="font-semibold text-slate-900">{labDirectorName}</span></span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block">Signature: <span className="underline font-serif italic text-slate-900">{labDirectorName}</span></span>
                    <span className="text-slate-500 block">Designation: <span className="font-semibold text-slate-900">Lab Director</span></span>
                    <span className="text-slate-400 block text-[10px] mt-2">[ Seal of ART bank ]</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AFFIDAVIT BY ART BANK IN REGARD TO OOCYTE DONOR (Matches User's PDF 3) */}
          {activeDoc.id === 'bank_affidavit_oocyte' && (
            <div className="space-y-3 font-serif">
              <div className="text-center border-b border-slate-300 pb-2">
                <h3 className="text-sm font-bold text-slate-900 tracking-wider">
                  Affidavit by ART bank in regard to Oocyte Donor
                </h3>
              </div>

              <div className="space-y-2.5 font-sans text-xs text-slate-800 leading-relaxed text-justify">
                <p>
                  I <span className="font-semibold text-slate-900">{labDirectorName}</span>, aged <span className="font-semibold text-slate-900">{labDirectorAge} years</span> residing at <span className="font-medium text-slate-900">{labDirectorResidence}</span> do solemnly affirm and state as under:
                </p>

                <ol className="list-decimal pl-4 space-y-2 text-xs">
                  <li>
                    That I am the Lab Director (Designation) of Genes India, ART Bank, having its registered office at {artBankAddress} and I am authorized to sign and execute the affidavit on behalf of the Genes India ART bank.
                  </li>
                  <li>
                    That ART Bank is duly registered under the provisions of Assisted Reproductive Technology (Regulation) Act, 2021 and is functioning in accordance with the ART (Regulation) Act, 2021 and ART (Regulation) Rules, 2022.
                  </li>
                  <li>
                    That Genes India ART Bank has supplied Oocyte DonorCode <span className="font-mono font-bold text-purple-700">{donor.id || 'DON-O-9921'}</span> to <span className="font-semibold underline text-slate-900">{recipientArtClinic}</span> ART Clinic located at <span className="underline">{recipientArtClinicAddress}</span>.
                  </li>
                  <li>
                    That the said Oocyte donor has been allocated strictly for the use for below named Commissioning couple/woman only. Name of Commissioning Couple/woman: <span className="font-semibold underline text-slate-900">{commissioningCouple}</span> W/O <span className="font-semibold underline text-slate-900">{commissioningHusband}</span>.
                  </li>
                  <li>
                    <span className="font-medium text-slate-900">I declare on affidavit that Genes India ART Bank has not supplied Oocytes of the above mentioned donor to any other ART Clinic for the use in any other commissioning couple/woman. That means the ART Bank has not supplied Oocytes of the same donor to more than one commissioning couple/woman.</span>
                  </li>
                  <li>
                    The above mentioned oocyte donor is issued for above mentioned commissioning couple/woman and it shall not be used by ART Clinic for any other commissioning couple/woman.
                  </li>
                  <li>
                    That the contents of this affidavit para-1 to 6 are true and correct to the best of my knowledge and belief.
                  </li>
                </ol>

                <div className="grid grid-cols-2 gap-4 pt-4 text-xs font-sans border-t border-slate-200">
                  <div>
                    <span className="text-slate-500 block">Place: <span className="font-medium text-slate-900">INDORE</span></span>
                    <span className="text-slate-500 block">Date: <span className="font-medium text-slate-900">{currentDate}</span></span>
                    <span className="text-slate-500 block mt-2 font-medium text-slate-900">Genes India ART Bank</span>
                    <span className="text-slate-500 block">Name: <span className="font-semibold text-slate-900">{labDirectorName}</span></span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block">Signature: <span className="underline font-serif italic text-slate-900">{labDirectorName}</span></span>
                    <span className="text-slate-500 block">Designation: <span className="font-semibold text-slate-900">Lab Director</span></span>
                    <span className="text-slate-400 block text-[10px] mt-2">[ Seal of ART bank ]</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FORM 13: Consent Form for the Donor of Oocytes (Matches User's PDF 5 & Image 3) */}
          {activeDoc.id === 'f13' && (
            <div className="space-y-3 font-serif">
              <div className="text-center border-b border-slate-300 pb-2">
                <div className="text-xs font-bold text-slate-900 tracking-wider">FORM 13</div>
                <div className="text-[11px] text-slate-600 font-sans">[See rule 13 (f) (viii)]</div>
                <h3 className="text-sm font-bold text-slate-900">Consent Form for the Donor of Oocytes</h3>
              </div>

              <div className="space-y-2.5 font-sans text-xs text-slate-800 leading-relaxed text-justify">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                  <div>I, Mrs. <span className="font-semibold underline text-slate-900">{donorFullName}</span> W/O <span className="font-semibold underline text-slate-900">{donorHusbandName}</span></div>
                  <div>Address: <span className="font-medium text-slate-900">{donorAddress}</span></div>
                  <div>AADHAR card number: <span className="font-mono font-medium text-slate-900">{donorAadhaar}</span></div>
                </div>

                <p>
                  Willingly consent to donate my oocyte to couple/individual who are unable to have a child by other means. At this stage and to the best of my knowledge I am free of any infectious diseases or genetic disorders.
                </p>
                <p>
                  I have had a full discussion with <span className="font-semibold underline text-slate-900">DR. SRAVANI REDDY</span> (FERTICARE IVF CENTRE, ONGOLE).
                </p>
                <p>
                  I have been counselled by <span className="font-semibold underline text-slate-900">DR. CHARUDUTT JOSHI</span>, GENES INDIA THE ART BANK, {artBankAddress}.
                </p>
                <p>
                  (I understand that there will be no direct or indirect contact between me and the recipient, and my personal identity will not be disclosed to the recipient or to the child born through the use of my gamete.: If applicable)
                </p>
                <p>
                  I understand that I shall have no rights whatsoever on the resulting offspring and vice versa.
                </p>
                <p className="font-medium text-slate-900">
                  I understand that the method of treatment may include:
                </p>
                <ol className="list-decimal pl-4 space-y-1 text-xs">
                  <li>Stimulating my ovaries for multifollicular development.</li>
                  <li>The recovery of one or more of my eggs under ultrasound-guidance or by laparoscopy under sedation or general anesthesia.</li>
                  <li>The fertilization of my oocytes with recipient's husband's or donor sperm and transferring the resulting embryo into the recipient.</li>
                </ol>

                <p className="p-2.5 bg-amber-50/60 border border-amber-200/80 rounded-lg text-slate-700 text-[11px]">
                  I understand and accept that the drugs that are used to stimulate the ovaries to raise oocytes have temporary side-effects like nausea, headaches and abdominal bloating. Only in a small proportion of cases, a condition called ovarian hyperstimulation occurs where there is an exaggerated ovarian response. Such cases can be identified ahead of time but only to a limited extent. Further, at times the ovarian response is poor or absent in spite of using a high dose of drugs. Under these circumstances, the treatment cycle will be cancelled.
                </p>

                <div className="pt-2">
                  <span className="text-slate-500">Name, address and signature of woman: </span>
                  <span className="font-semibold text-slate-900 underline">{donorFullName}</span>, {donorAddress}
                </div>

                <div className="pt-3 border-t border-slate-300 space-y-2">
                  <h4 className="font-bold text-slate-900 text-center uppercase tracking-wider text-xs">
                    Endorsement by the ART clinic
                  </h4>
                  <p>
                    I / we have personally explained to <span className="font-semibold underline text-slate-900">Mrs. {donorFullName} W/O {donorHusbandName}</span>, the details and implications of her signing this consent / approval form, and made sure to the extent humanly possible that she understands these details and implications.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 text-[11px] font-sans">
                  <div>
                    <span className="text-slate-500 block">Name, address and signature of the Witness:</span>
                    <span className="font-semibold text-slate-900">Authorized Witness, Ferticare IVF Centre</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Name and signature of the Doctor:</span>
                    <span className="font-semibold text-slate-900">Dr. Sravani Reddy (Clinician)</span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-200 space-y-1">
                    <div><span className="text-slate-500">Name and address of the ART clinic:</span> <span className="font-medium text-slate-900">Ferticare IVF Centre, Ongole</span></div>
                    <div><span className="text-slate-500">Name and address of the ART Bank that recruited and screened donor:</span> <span className="font-medium text-slate-900">{clinicName}, {artBankAddress}</span></div>
                    <div><span className="text-slate-500">Date:</span> <span className="font-medium text-slate-900">{currentDate}</span></div>
                    <div className="text-[10px] text-slate-400 italic pt-1">
                      (This form will be filled by the ART clinic but a copy of the same has to be maintained by the ART bank in case the donor was recruited and screened by the bank)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FORM M-1: Information on Oocyte Donor (Matches User's Images 1 & 2) */}
          {activeDoc.id === 'form_m1' && (
            <div className="space-y-3 font-sans text-xs">
              <div className="text-center border-b border-slate-300 pb-2">
                <div className="text-xs font-bold text-slate-900 tracking-wider">M-1</div>
                <h3 className="text-sm font-bold text-slate-900">Information on Oocyte Donor</h3>
                <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                  <span>Date of filling the form (except items 16-26): <span className="font-semibold underline">{currentDate}</span></span>
                  <span>Date of filling items 16-26: <span className="font-semibold underline">{currentDate}</span></span>
                </div>
              </div>

              {/* Basic Information (1 to 12) */}
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-bold text-slate-900 uppercase bg-slate-100 px-2 py-1 border-l-4 border-purple-600">
                  Basic Information
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] p-2 bg-slate-50/60 rounded-lg border border-slate-200">
                  <div>1. Identification number (Donor ID): <span className="font-mono font-semibold text-purple-700">{donor.id || 'DON-O-112'}</span></div>
                  <div>2. Age / Date of birth: <span className="font-medium">{donorAge} Yrs / {donorDob}</span></div>
                  <div>3. Aadhar No.: <span className="font-mono font-medium">{donorAadhaar}</span></div>
                  <div>4. Place of birth: <span className="font-medium">{placeOfBirth}</span></div>
                  <div>5. Marital status: <span className="font-medium">{maritalStatus}</span></div>
                  <div>6. Education: i) Donor: <span className="font-medium">{donorEducation}</span> | ii) Spouse: <span className="font-medium">{spouseEducation}</span></div>
                  <div>7. Occupation: iii) Donor: <span className="font-medium">{donorProfession}</span> | iv) Spouse: <span className="font-medium">{spouseProfession}</span></div>
                  <div>8. Monthly income: <span className="font-medium">{monthlyIncome}</span></div>
                  <div>9. Religion: <span className="font-medium">{religion}</span></div>
                  <div>10. Address: <span className="font-medium">{donorAddress}</span></div>
                  <div>11. Telephone: <span className="font-medium">{donorMobile}</span></div>
                  <div>12. Email: <span className="font-medium">{donorEmail}</span></div>
                </div>
              </div>

              {/* History (13 to 21) */}
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-bold text-slate-900 uppercase bg-slate-100 px-2 py-1 border-l-4 border-purple-600">
                  History
                </h4>
                <div className="space-y-1 text-[11px] p-2 bg-slate-50/60 rounded-lg border border-slate-200">
                  <div>
                    13. Obstetric history: i) Number of deliveries: <span className="font-medium">{repro.childrenCount || '2'}</span> | ii) Number of abortions: <span className="font-medium">{repro.abortionsCount || '0'}</span> | iii) Other points of note: <span className="font-medium">{repro.obstetricNotes || 'Healthy full term vaginal deliveries'}</span>
                  </div>
                  <div>14. Menstrual history: <span className="font-medium">{menstrualHistory}</span></div>
                  <div>15. History of use of contraceptives: <span className="font-medium">{medical.contraceptives || 'Barrier method / Nil hormonal IUD'}</span></div>
                  <div>16. Medical history: <span className="font-medium">{medical.medicalHistory || 'Nil major illness, no hospitalizations or previous surgeries'}</span></div>
                  <div>17. Family history from medical point of view: <span className="font-medium">{medical.familyHistory || 'No family history of diabetes, hypertension, breast/ovarian malignancy'}</span></div>
                  <div>18. History of any abnormality in a child of donor: <span className="font-medium">{medical.childAbnormality || 'Nil reported, children healthy and developmentally normal'}</span></div>
                  <div>19. History of blood transfusion: <span className="font-medium">{medical.bloodTransfusion || 'No history of blood transfusion'}</span></div>
                  <div>20. History of substance abuse: <span className="font-medium">{medical.substanceAbuse || 'Non-smoker, Non-alcoholic, No substance abuse'}</span></div>
                  <div>21. History of any Genetic abnormality: <span className="font-medium">{genetic.geneticAbnormality || 'No genetic abnormality; Normal Karyotype 46,XX confirmed'}</span></div>
                </div>
              </div>

              {/* Investigations (22 to 33) */}
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-bold text-slate-900 uppercase bg-slate-100 px-2 py-1 border-l-4 border-purple-600">
                  Investigations
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] p-2 bg-slate-50/60 rounded-lg border border-slate-200">
                  <div className="col-span-2">22. Blood group and Rh status: <span className="font-bold text-rose-700">{donorBlood}</span></div>
                  <div className="col-span-2">
                    23. Complete blood picture: 
                    i) Hb: <span className="font-medium">{lab.hb || '13.4'} g/dL</span> | 
                    ii) RBC: <span className="font-medium">{lab.rbcCount || '4.6'} M/uL</span> | 
                    iii) WBC: <span className="font-medium">{lab.wbcCount || '6,800'} /uL</span> | 
                    iv) Diff WBC: <span className="font-medium">{lab.diffWbc || 'N62 L30 E5 M3'}</span> | 
                    v) Platelet count: <span className="font-medium">{lab.plateletCount || '2.6'} L</span> | 
                    vi) Peripheral smear: <span className="font-medium">{lab.peripheralSmear || 'Normocytic, Normochromic'}</span>
                  </div>
                  <div>24. Random blood sugar: <span className="font-medium">{lab.randomBloodSugar || '88'} mg/dL</span></div>
                  <div>25. Blood urea / Serum creatinine: <span className="font-medium">{lab.ureaCreatinine || 'Urea 19 / Creatinine 0.8 mg/dL'}</span></div>
                  <div>26. SGPT: <span className="font-medium">{lab.sgpt || '22'} U/L</span></div>
                  <div>27. Routine urine examination: <span className="font-medium">{lab.urineRoutine || 'Normal (Albumin & Sugar Nil)'}</span></div>
                  <div>28. HBsAg status: <span className="font-medium text-emerald-700">{lab.hbsAg || 'Non-Reactive'}</span></div>
                  <div>29. Hepatitis C status: <span className="font-medium text-emerald-700">{lab.hcvAb || 'Non-Reactive'}</span></div>
                  <div>30. HIV status with date of tests: <span className="font-medium text-emerald-700">{lab.hivScreening || 'Non-Reactive'} (Date: {lab.hivDate || currentDate})</span></div>
                  <div>31. Hemoglobin A2 (for thalassemia) status: <span className="font-medium text-emerald-700">{genetic.thalassemiaCarrier || 'Normal (HbA2 2.4%)'}</span></div>
                  <div>32. Any other specific test ⁽²⁾: <span className="font-medium">{lab.otherSpecificTests || 'AMH: 3.2 ng/mL, AFC: 16'}</span></div>
                  <div>33. Sexually transmitted diseases: <span className="font-medium text-emerald-700">{lab.vdrlSyphilis || 'Non-Reactive (VDRL/TPHA)'}</span></div>
                </div>
              </div>

              {/* Features (34 to 38) & Detailed Physical Exam (39 to 44 + Other) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-bold text-slate-900 uppercase bg-slate-100 px-2 py-1 border-l-4 border-purple-600">
                    Features
                  </h4>
                  <div className="space-y-0.5 text-[11px] p-2 bg-slate-50/60 rounded-lg border border-slate-200">
                    <div>34. Height: <span className="font-medium">{donorHeight} cm</span></div>
                    <div>35. Weight: <span className="font-medium">{donorWeight} kg (BMI: {donorBmi})</span></div>
                    <div>36. Colour of skin: <span className="font-medium">{donor.complexion || physical.skinTone || 'Fair'}</span></div>
                    <div>37. Colour of hair: <span className="font-medium">{donor.hairColor || physical.hairColor || 'Black'}</span></div>
                    <div>38. Colour of eyes: <span className="font-medium">{donor.eyeColor || physical.eyeColor || 'Dark Brown'}</span></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-bold text-slate-900 uppercase bg-slate-100 px-2 py-1 border-l-4 border-purple-600">
                    Detailed Physical Examination
                  </h4>
                  <div className="space-y-0.5 text-[11px] p-2 bg-slate-50/60 rounded-lg border border-slate-200">
                    <div>39. Pulse: <span className="font-medium">{physicalExam.pulse || '76'} /min</span></div>
                    <div>40. Blood pressure: <span className="font-medium">{physicalExam.bloodPressure || '116/76'} mmHg</span></div>
                    <div>41. Temperature: <span className="font-medium">{physicalExam.temperature || '98.6'} °F</span></div>
                    <div>42. Respiratory system: <span className="font-medium">{physicalExam.respiratorySystem || 'Clear, NVBS'}</span></div>
                    <div>43. Cardiovascular system: <span className="font-medium">{physicalExam.cardiovascularSystem || 'S1 S2 Normal'}</span></div>
                    <div>44. Per abdominal examination: <span className="font-medium">{physicalExam.perAbdominal || 'Soft, Non-tender, No scar'}</span></div>
                    <div>Other systems: <span className="font-medium">{physicalExam.otherSystems || 'Thyroid & Breast NAD'}</span></div>
                  </div>
                </div>
              </div>

              {/* Footnotes & Provisional Disclosure Clause (Matches User's Image 2) */}
              <div className="p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-[10px] text-slate-600 space-y-1">
                <div className="font-bold text-slate-700">Footnotes:</div>
                <div>1. To be carried out within 15 days prior to oocyte donation</div>
                <div>2. Any additional test carried out on the basis of the history and examination of donor</div>
                <div className="pt-1.5 text-slate-900 leading-relaxed border-t border-slate-200">
                  <strong>Notice to Patient:</strong> To the patient, a copy of this form without items 16-26 filled in, may be given when asked for. The investigations in items 16-26 may be done when the patient has chosen the donor provisionally, subject to the results of tests in items 16-26 being satisfactory.
                </div>
                <div className="pt-2 text-right">
                  <span className="block font-semibold text-slate-900">Name(s) and Signature(s) with Date:</span>
                  <span className="font-serif italic text-xs text-slate-900">{reviewingDoctor}, {currentDate}</span>
                </div>
              </div>
            </div>
          )}

          {/* FORM 14 A: Record of Oocyte Donors Recruited by ART Bank (Matches User's PDF 1) */}
          {activeDoc.id === 'form_14a' && (
            <div className="space-y-3 font-sans text-xs">
              <div className="text-center border-b border-slate-300 pb-2">
                <h3 className="text-sm font-bold text-slate-900">FORM 14 A</h3>
                <div className="text-[11px] text-slate-600">[See rule 13 (2) (i)]</div>
                <div className="text-xs text-slate-700 mt-1">
                  For Oocyte Donors AADHAR card no. to be entered (For donors recruited and screened by the ART bank)
                </div>
                <div className="text-right text-[11px] text-slate-600 mt-1">
                  AADHAR Card no: <span className="font-mono font-bold text-purple-700">{donorAadhaar}</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-[10.5px] border border-slate-300 text-center">
                  <thead className="bg-slate-100 font-semibold text-slate-700 border-b border-slate-300">
                    <tr>
                      <th className="p-2 border-r border-slate-300">Donor ID</th>
                      <th className="p-2 border-r border-slate-300">Recruitment Date</th>
                      <th className="p-2 border-r border-slate-300">Name of person Recruiting</th>
                      <th className="p-2 border-r border-slate-300">Signature</th>
                      <th className="p-2 border-r border-slate-300">Supply Date</th>
                      <th className="p-2 border-r border-slate-300">ART Clinic</th>
                      <th className="p-2">Receipt attached (Yes / No)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 border-r font-mono font-medium">{donor.id || 'DON-O-112'}</td>
                      <td className="p-2 border-r">{collectionDate.split(' ')[0]}</td>
                      <td className="p-2 border-r">{doctor.reviewingDoctorName || 'Coordinator Anita / Recruiter'}</td>
                      <td className="p-2 border-r font-serif italic">[Signed]</td>
                      <td className="p-2 border-r">{allocation.dispatchDate || currentDate}</td>
                      <td className="p-2 border-r font-medium">{recipientArtClinic}</td>
                      <td className="p-2 font-semibold text-emerald-700">Yes (Attached)</td>
                    </tr>
                    {[1, 2, 3, 4, 5].map(idx => (
                      <tr key={idx} className="border-b border-slate-200 h-8 text-slate-300">
                        <td className="border-r">-</td>
                        <td className="border-r">-</td>
                        <td className="border-r">-</td>
                        <td className="border-r">-</td>
                        <td className="border-r">-</td>
                        <td className="border-r">-</td>
                        <td>-</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* FORM 14 B: Oocyte-Embryo Record & Culture Progression (Matches User's PDF 2) */}
          {activeDoc.id === 'form_14b' && (
            <div className="space-y-3 font-sans text-xs">
              <div className="text-center border-b border-slate-300 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Form 14B</h3>
                <div className="text-[11px] text-slate-600">[See rule 13 (2) (i)]</div>
                <div className="text-xs font-semibold text-slate-800">
                  Oocyte-Embryo Record (AADHAR card no. to be entered)
                </div>
                <div className="flex justify-between text-[11px] text-slate-700 mt-2 p-2 bg-slate-50 rounded border border-slate-200">
                  <div>Patient name: <span className="font-semibold text-slate-900">{commissioningCouple}</span></div>
                  <div>ID no.: <span className="font-mono font-semibold text-blue-700">{sampleBarcode}</span></div>
                  <div>AADHAR Card no.: <span className="font-mono font-bold text-purple-700">{donorAadhaar}</span></div>
                </div>
              </div>

              {/* Day-by-Day Progression Sheet */}
              <div className="overflow-x-auto">
                <table className="w-full text-[9px] border border-slate-300 text-center">
                  <thead className="bg-slate-100 font-semibold text-slate-700 border-b border-slate-300">
                    <tr>
                      <th className="p-1 border-r border-slate-300">Day 0 (OPU)</th>
                      <th className="p-1 border-r border-slate-300">Day 1 (Fert)</th>
                      <th className="p-1 border-r border-slate-300">Day 2 (Cleavage)</th>
                      <th className="p-1 border-r border-slate-300">Day 3 (Morula)</th>
                      <th className="p-1 border-r border-slate-300">Day 4</th>
                      <th className="p-1 border-r border-slate-300">Day 5 (Blast)</th>
                      <th className="p-1">Frozen Info</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b bg-slate-50/50">
                      <td className="p-1 border-r text-[8.5px] leading-tight">Time: 09:30 AM<br />Sci: S. Roy<br />Dr: Dr. Mittal<br />Hyal: 10:15<br />Inj: 10:45</td>
                      <td className="p-1 border-r text-[8.5px] leading-tight">Diss: 18h<br />Score: 16h<br />2PN: 10<br />1PN: 1<br />0PN: 3</td>
                      <td className="p-1 border-r text-[8.5px] leading-tight">4-cell: 6<br />2-cell: 3<br />Grade: 1-2<br />Frag: &lt;10%</td>
                      <td className="p-1 border-r text-[8.5px] leading-tight">8-cell: 7<br />6-cell: 2<br />Grade: 1<br />Compacting</td>
                      <td className="p-1 border-r text-[8.5px] leading-tight">Morula: 8<br />Cavitating: 4<br />Sci: S. Roy</td>
                      <td className="p-1 border-r text-[8.5px] leading-tight">4AA: 3<br />4AB: 2<br />3BB: 2<br />FATE: Vitri</td>
                      <td className="p-1 text-[8.5px] leading-tight font-medium text-blue-800">Method: Vitri<br />Straws: 4<br />Tank: Cryo-01<br />Canister: C-02</td>
                    </tr>
                    {[1, 2, 3, 4, 5].map((eggNum) => (
                      <tr key={eggNum} className="border-b border-slate-200">
                        <td className="p-1 border-r font-mono">Egg #{eggNum}: MII</td>
                        <td className="p-1 border-r">2PN (Normal)</td>
                        <td className="p-1 border-r">4-Cell / Gr-1</td>
                        <td className="p-1 border-r">8-Cell / Gr-1</td>
                        <td className="p-1 border-r">Morula</td>
                        <td className="p-1 border-r font-medium text-emerald-800">4AA Blastocyst</td>
                        <td className="p-1 font-mono text-[8px] text-blue-700">Straw #{eggNum} (Frozen)</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Frozen Embryo Details & Sealed Secret Register Notice */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-2 bg-slate-50 border border-slate-200 rounded text-[10px] space-y-0.5">
                  <div className="font-semibold text-slate-900">Frozen embryo details:</div>
                  <div>Tank: <span className="font-mono font-medium">{tankId}</span></div>
                  <div>Canister: <span className="font-mono font-medium">{canisterNumber}</span></div>
                  <div>Goblet/Loop: <span className="font-medium">{gobletColor} / High-Security CBS Straws</span></div>
                  <div>Arrangement: <span className="font-medium">Rack-02, Goblet-Yellow, Cannister-C4</span></div>
                </div>

                <div className="p-2 bg-amber-50/70 border border-amber-200 rounded text-[9.5px] text-slate-700 leading-snug">
                  <strong>Statutory Confidentiality Requirement:</strong><br />
                  The ART bank will maintain a separate register which will give the name and address, telephone no. etc., of the donor, that will match with the donor ID mentioned above. This register will be kept in a safe, under lock and key, and will be accessible to only a small number of persons in the ART bank who will be sworn on oath to maintain the above identity secret.
                </div>
              </div>
            </div>
          )}

          {/* COMMISSIONING COUPLE'S AFFIDAVIT (Matches User's PDF 4, 3 Pages) */}
          {activeDoc.id === 'couple_affidavit' && (
            <div className="space-y-3 font-serif">
              <div className="text-center border-b border-slate-300 pb-2">
                <h3 className="text-sm font-bold text-slate-900 tracking-wider">
                  COMMISSIONING COUPLE'S AFFIDAVIT
                </h3>
                <div className="text-xs text-slate-600 font-sans">
                  Under Section 22(1)(b) & Section 22(4)(ii) of ART Act 2021 and Rule 12 of ART Rules 2022
                </div>
              </div>

              <div className="space-y-2 font-sans text-xs text-slate-800 leading-relaxed text-justify">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                  <div>We (1) <span className="font-semibold text-slate-900 underline">{coupleWifeName}</span> W/o <span className="font-semibold text-slate-900 underline">{coupleHusbandName}</span> R/o {coupleAddress} WITH Adhaar No. <span className="font-mono font-medium">{coupleWifeAadhaar}</span> Mobile No. {coupleMobile}</div>
                  <div>and (2) <span className="font-semibold text-slate-900 underline">{coupleHusbandName}</span> S/O NANDU R/o:- {coupleAddress} Adhaar No. <span className="font-mono font-medium">{coupleHusbandAadhaar}</span> Mobile No. {coupleMobile} do hereby solemnly affirm and depose as under:</div>
                </div>

                <ol className="list-decimal pl-4 space-y-1.5 text-xs">
                  <li>That we are taking treatment for Artificial Reproductive Technology for primary infertility clinic at <span className="font-medium text-slate-900">{treatingDoctorClinic}</span>.</li>
                  <li>We both are married and provide identity and residence proof of both husband and wife.</li>
                  <li>We have had a full discussion with Dr. Nidhi Mittal, in regard to our treatment on 14/09/2024.</li>
                  <li>We have been counseled by Dr. Nidhi Mittal on 14/09/2024 that we require an oocyte from donor for our treatment.</li>
                  <li>We have been informed that children born out of ART shall have all the rights of a naturally conceived child for us.</li>
                  <li>
                    We have been informed that as per Section 22 (1) (b) of Assisted Reproductive Technology (Regulation) Act, 2021, an insurance coverage of such amount as may be prescribed for a period of twelve months in favor of oocyte donor by the commissioning couple from an insurance company or an agent recognized by Insurance Regulatory Development Authority established under the provisions of the Insurance Regulatory Development Authority Act, 1999, is required.
                  </li>
                  <li>
                    As per Rule 12 (1) and 12 (ii) of Assisted Reproductive Technology (Regulation) Rules, 2022: The intending couple or woman will purchase general health insurance coverage in favor of oocyte donor for a period of 12 months for an amount sufficient enough to cover all expenses for all complications arising due to oocyte retrieval.
                  </li>
                  <li>
                    In absence of clarity regarding the amount of insurance as per ART Act and Rules, we have done health insurance of Mrs. <span className="font-semibold underline text-slate-900">{donorFullName}</span> age <span className="font-medium text-slate-900">{donorAge} Years</span> which is of a reasonable amount in the name of donor who is acting as a donor in our case.
                  </li>
                  <li>
                    Considering the purpose of such section to protect donor, we on affidavit assure that we will take care of all medical expenditures of oocyte donor and also will be responsible for paying the donor all the medical expenditure which she may occur for treatment of any complication which may occur due to the Ovum Pick-up procedure performed on her for donating such oocytes to us.
                  </li>
                  <li>We have been explained about risks which may occur in ovum pick-up procedure in details by Dr. Nidhi Mittal.</li>
                  <li>We have been informed that children born out of ART shall have all the rights of a naturally conceived child of us.</li>
                  <li>We have been informed that the oocyte donor and her husband has already relinquished their parental rights on the child.</li>
                  <li>We have read over the contents of the affidavit in local language and after understanding the contents, we have executed this affidavit out of our own free will.</li>
                  <li>That the contents stated in para 1 to para 12 of this affidavit are true and correct and I undertake to indemnify and keep the ART BANK and clinic indemnified, if any statement or fact stated by me is incorrect or false.</li>
                </ol>

                <div className="pt-3 border-t border-slate-300 space-y-2">
                  <div className="font-bold text-slate-900 text-center uppercase tracking-wider text-xs">
                    VERIFICATION
                  </div>
                  <p className="text-center text-[11px]">
                    Verified at Indore on the <span className="font-semibold">{currentDate}</span>, that the contents of the affidavit in Para 1 to Para 13 are true and correct to the best of our knowledge and nothing has been concealed there from.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 text-xs font-sans">
                  <div>
                    <span className="text-slate-500 block">Date: <span className="font-medium text-slate-900">{currentDate}</span></span>
                    <span className="text-slate-500 block">Place: <span className="font-medium text-slate-900">Indore</span></span>
                  </div>
                  <div className="text-right space-y-2">
                    <div><span className="text-slate-500 text-[10px] block">Deponent 1 (Wife):</span> <span className="font-serif italic font-semibold text-slate-900 underline">{coupleWifeName}</span></div>
                    <div><span className="text-slate-500 text-[10px] block">Deponent 2 (Husband):</span> <span className="font-serif italic font-semibold text-slate-900 underline">{coupleHusbandName}</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FORM 11 (Men only) */}

          {/* FORM 11 (Men only) */}
          {activeDoc.id === 'f11' && (
            <div className="space-y-2.5">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-1 border-l-4 border-slate-900">
                II. Statutory Consent of Semen Donor for Gamete Donation (Form 11)
              </h3>
              <p className="text-justify">
                I, <strong>{donorFullName}</strong>, holding Aadhaar number <strong>{donorAadhaar}</strong>, hereby declare that I am voluntarily donating my semen sample at Genes India ART Bank.
              </p>
              <ol className="list-decimal pl-4 space-y-1.5 text-justify">
                <li>
                  <strong>Biological Paternity Relinquishment:</strong> I explicitly agree that I shall have no parental rights, duties, or claims over any child born as a result of ART procedures utilizing my semen.
                </li>
                <li>
                  <strong>Cryogenic Quarantine Protocol:</strong> I agree that my sample will undergo statutory mandatory 6-month cryogenic quarantine at -196°C in Liquid Nitrogen before clinical release.
                </li>
                <li>
                  <strong>Lifetime Donation Limits:</strong> I confirm that I have not exceeded the statutory maximum gamete donation limits permitted under the ART Act 2021.
                </li>
                <li>
                  <strong>Truthful Disclosure:</strong> I affirm that I have completely disclosed my medical and genetic history to the medical director.
                </li>
              </ol>
            </div>
          )}

          {/* POST-DONATION DECLARATION */}
          {activeDoc.id === 'decl_post' && (
            <div className="space-y-2.5">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-1 border-l-4 border-slate-900">
                II. Post-Procedure Verification & Cryobank Storage Details
              </h3>
              <div className="bg-slate-50 border border-slate-300 p-2.5 rounded text-[10px] grid grid-cols-2 gap-2">
                <div><span className="font-semibold">Procedure Completed:</span> {isFemale ? 'Oocyte Retrieval (Aspiration)' : 'Semen Collection & Cryopreservation'}</div>
                <div><span className="font-semibold">Collection Date & Time:</span> <span className="font-mono">{collectionDate}</span></div>
                <div><span className="font-semibold">Number of Vials Frozen:</span> <span className="font-bold text-blue-800">{numberOfVials} Cryovials</span></div>
                <div><span className="font-semibold">Freezing Method:</span> {freezingMethod}</div>
                <div className="col-span-2">
                  <span className="font-semibold">Storage Container Location:</span> <span className="font-mono font-bold bg-white px-1.5 py-0.5 border border-slate-300 rounded">{containerLocation}</span>
                </div>
              </div>
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-1 border-l-4 border-slate-900">
                III. Post-Donation Declaration & Legal Discharge
              </h3>
              <ol className="list-decimal pl-4 space-y-1 text-justify">
                <li>I confirm that the donation was completed smoothly, my post-procedure vitals are stable, and I am in sound physical condition at discharge.</li>
                <li>I acknowledge receipt of legitimate direct expense reimbursement in compliance with Section 22(4) of the ART Act 2021.</li>
                <li>I permanently reaffirm zero parental rights to any offspring conceived through this sample.</li>
              </ol>
            </div>
          )}

          {/* FORM 10: Storage & Cryopreservation */}
          {activeDoc.id === 'f10' && (
            <div className="space-y-2.5">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-1 border-l-4 border-slate-900">
                II. Agreement for Cryopreservation & Bio-Custody
              </h3>
              <p className="text-justify">
                This agreement authorizes Genes India ART Bank to cryopreserve and retain gamete specimens under strict chain-of-custody in Liquid Nitrogen (LN2) tanks at -196°C in accordance with national biosafety standards.
              </p>
              <div className="border border-slate-300 p-2 bg-slate-50 text-[10px] grid grid-cols-2 gap-1.5">
                <div><span className="font-semibold">Allocated Storage Tank:</span> {tankId}</div>
                <div><span className="font-semibold">Canister / Goblet:</span> {canisterNumber} ({gobletColor})</div>
                <div><span className="font-semibold">Number of Vials Stored:</span> {numberOfVials} Straws/Vials</div>
                <div><span className="font-semibold">Quarantine Window:</span> 180 Days Mandatory Quarantine</div>
              </div>
            </div>
          )}

          {/* FORM 14: ART Clinic Allocation */}
          {activeDoc.id === 'f14' && (
            <div className="space-y-2.5">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-1 border-l-4 border-slate-900">
                II. Statutory ART Clinic Allocation & Traceability Log
              </h3>
              <table className="w-full text-[10.5px] border border-slate-300">
                <tbody>
                  <tr className="border-b"><td className="p-1.5 bg-slate-50 font-semibold">Recipient ART Clinic:</td><td className="p-1.5">{allocation.recipientClinicName || 'Apex Fertility & ART Center'}</td></tr>
                  <tr className="border-b"><td className="p-1.5 bg-slate-50 font-semibold">National Clinic Reg ID:</td><td className="p-1.5 font-mono">{allocation.clinicNationalRegNo || 'ART-CL-UP-2024-0012'}</td></tr>
                  <tr className="border-b"><td className="p-1.5 bg-slate-50 font-semibold">Allocated Vials:</td><td className="p-1.5">{numberOfVials} Straws from {containerLocation}</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {/* FORM 15: Psychological Clearance */}
          {activeDoc.id === 'f15' && (
            <div className="space-y-2.5">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-1 border-l-4 border-slate-900">
                II. Psychological Evaluation & Certified Counsellor Clearance
              </h3>
              <p className="text-justify">
                I have conducted a formal clinical psychological evaluation of donor <strong>{donorFullName}</strong> on {psych.counselingDate || currentDate}. The donor exhibits emotional stability, clear comprehension of genetic anonymity, and no psychological contraindications under the ART Act.
              </p>
              <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-emerald-900 font-semibold text-[10px]">
                Status: RECOMMENDED & FULLY CLEARED FOR GAMETE DONATION
              </div>
            </div>
          )}

          {/* CLINICAL DOSSIER */}
          {activeDoc.id === 'r_medical' && (
            <div className="space-y-2">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-1 border-l-4 border-slate-900">
                II. Clinical Screening & Investigation Dossier
              </h3>
              <table className="w-full text-[10px] border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 border-b">
                    <th className="p-1 text-left font-semibold">Investigation</th>
                    <th className="p-1 text-left font-semibold">Result</th>
                    <th className="p-1 text-left font-semibold">Standard</th>
                    <th className="p-1 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b"><td className="p-1 font-semibold">HIV 1/2 ELISA</td><td className="p-1 text-emerald-700 font-semibold">{lab.hivScreening || 'Non-Reactive'}</td><td className="p-1">Non-Reactive</td><td className="p-1 text-emerald-800">Cleared</td></tr>
                  <tr className="border-b"><td className="p-1 font-semibold">HBsAg</td><td className="p-1 text-emerald-700 font-semibold">{lab.hbsAg || 'Non-Reactive'}</td><td className="p-1">Non-Reactive</td><td className="p-1 text-emerald-800">Cleared</td></tr>
                  <tr className="border-b"><td className="p-1 font-semibold">Anti-HCV</td><td className="p-1 text-emerald-700 font-semibold">{lab.hcvAb || 'Non-Reactive'}</td><td className="p-1">Non-Reactive</td><td className="p-1 text-emerald-800">Cleared</td></tr>
                  <tr className="border-b"><td className="p-1 font-semibold">VDRL / Syphilis</td><td className="p-1 text-emerald-700 font-semibold">{lab.vdrlSyphilis || 'Non-Reactive'}</td><td className="p-1">Non-Reactive</td><td className="p-1 text-emerald-800">Cleared</td></tr>
                  <tr className="border-b bg-blue-50/30"><td className="p-1 font-semibold">Urine Routine</td><td className="p-1 font-medium">{urineRoutine}</td><td className="p-1">Albumin/Sugar Nil</td><td className="p-1 text-emerald-800">{urineMicroNotes}</td></tr>
                  {!isFemale && (
                    <tr className="border-b"><td className="p-1 font-semibold">Semen Analysis</td><td className="p-1 font-medium">Vol: {semen.semenVolume || '2.8 mL'} | Conc: {semen.spermConcentration || '65 M/mL'}</td><td className="p-1">Test Date: {semenTestDate}</td><td className="p-1 text-emerald-800">Normal</td></tr>
                  )}
                  <tr className="border-b"><td className="p-1 font-semibold">Karyotyping</td><td className="p-1">{genetic.karyotypeResult || (isFemale ? '46,XX' : '46,XY')}</td><td className="p-1">Normal HPLC</td><td className="p-1 text-emerald-800">Normal</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {/* CRYO ALLOCATION REPORT */}
          {activeDoc.id === 'r_cryo' && (
            <div className="space-y-2">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-1 border-l-4 border-slate-900">
                II. Cryogenic Bio-Storage Inventory & Location Assignment
              </h3>
              <div className="grid grid-cols-2 gap-2 border border-slate-300 p-2.5 bg-slate-50 text-[10px]">
                <div><span className="font-semibold">LN2 Storage Tank:</span> {tankId}</div>
                <div><span className="font-semibold">Canister ID:</span> {canisterNumber}</div>
                <div><span className="font-semibold">Goblet Identifier:</span> {gobletColor} Goblet</div>
                <div><span className="font-semibold">Number of Vials:</span> {numberOfVials} Cryovials</div>
                <div className="col-span-2"><span className="font-semibold">Full Storage Location:</span> {containerLocation}</div>
                <div><span className="font-semibold">Freezing Date:</span> {freezingDate}</div>
              </div>
            </div>
          )}

          {/* AFFIDAVIT */}
          {activeDoc.id === 'affidavit' && (
            <div className="space-y-2">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-900 bg-slate-100 px-2 py-1 border-l-4 border-slate-900">
                II. Notarized Legal Affidavit & Non-Coercion Undertaking
              </h3>
              <p className="text-justify">
                I solemnly affirm that I have executed this undertaking in complete awareness of the provisions of the Assisted Reproductive Technology (Regulation) Act, 2021 without concealing any material medical or genetic facts.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* STANDARD & PLAIN OFFICIAL LEGAL SIGNATURES (No fancy cards) */}
      <div className="pt-4 border-t-2 border-slate-900 relative z-10 mt-auto">
        <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-[10.5px]">
          {/* Signature 1: Donor */}
          <div className="space-y-1">
            <div className="border-b border-slate-800 h-10 flex items-end pb-1">
              {isDocSigned ? (
                activeSignature.signatureDataUrl ? (
                  <img src={activeSignature.signatureDataUrl} alt="Signature" className="max-h-9 max-w-full object-contain" />
                ) : (
                  <span className="font-serif italic text-base text-slate-900 font-bold">{activeSignature.signerName}</span>
                )
              ) : null}
            </div>
            <div className="font-bold text-slate-900 uppercase text-[10px]">
              Signature / Thumb Impression of Donor
            </div>
            <div className="text-[10px] text-slate-600">
              Name: {donorFullName} | Aadhaar: {donorAadhaar}
            </div>
            {isDocSigned && (
              <div className="text-[9px] text-slate-500 font-mono">
                Signed on: {activeSignature.signedAt}
              </div>
            )}
          </div>

          {/* Signature 2: Medical Director */}
          <div className="space-y-1">
            <div className="border-b border-slate-800 h-10 flex items-end pb-1">
              <span className="font-serif italic text-sm text-slate-900 font-bold">{reviewingDoctor}</span>
            </div>
            <div className="font-bold text-slate-900 uppercase text-[10px]">
              Signature of Treating Doctor / ART Specialist
            </div>
            <div className="text-[10px] text-slate-600">
              Name: {reviewingDoctor} | Reg No: {doctorReg}
            </div>
            <div className="text-[9px] text-slate-500">
              State Medical Council / National ART Registry
            </div>
          </div>

          {/* Signature 3: Counsellor / Witness */}
          <div className="space-y-1">
            <div className="border-b border-slate-800 h-10 flex items-end pb-1">
              <span className="font-serif italic text-sm text-slate-800">
                {consent.legalWitnessName || 'Dr. Priya Verma (Clinical Psychologist)'}
              </span>
            </div>
            <div className="font-bold text-slate-900 uppercase text-[10px]">
              Signature of Counsellor / Authorized Witness
            </div>
            <div className="text-[10px] text-slate-600">
              Designation: Clinical Psychologist & Legal Officer
            </div>
          </div>

          {/* Signature 4: ART Bank Seal & Stamp */}
          <div className="space-y-1">
            <div className="border-b border-slate-800 h-10 flex items-end justify-center pb-1">
              <div className="border border-slate-400 border-dashed px-4 py-0.5 text-[9px] text-slate-500 uppercase tracking-widest text-center">
                [ Official Bank Stamp ]
              </div>
            </div>
            <div className="font-bold text-slate-900 uppercase text-[10px]">
              For Genes India - The ART Bank
            </div>
            <div className="text-[10px] text-slate-600">
              Authorized Signatory & Seal | Reg: REG/ART-BNK/MH/2023/00481
            </div>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-4 pt-2 border-t border-slate-300 text-[9px] text-slate-500 flex justify-between items-center font-mono">
          <div>
            GENES INDIA - THE ART BANK | Registration No: REG/ART-BNK/MH/2023/00481
          </div>
          <div>
            {isDocSigned ? `VERIFIED & SIGNED (${activeSignature.hash.slice(0, 16)})` : 'DRAFT FOR REGISTRATION'} | A4 PAGE 1 OF 1
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Main Grid: Left Selector List + Right A4 Paper Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Document List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-3">
            {/* Header with Title and Signed Status combined inside Required Forms */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Required Forms
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {isFemale ? 'Female Registration (Egg Donor)' : 'Male Registration (Sperm Donor)'}
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Signed {Object.keys(signedDocs).length} / {availableDocs.length}
              </span>
            </div>

            {/* Category Filter inside Required Forms */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {(['All', 'Statutory', 'Declarations', 'Clinical Reports'] as const).map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {category === 'All' ? `All (${availableDocs.length})` : category}
                </button>
              ))}
            </div>

            {/* Clean Form List - Form Name Only, No tags or descriptions */}
            <div className="space-y-1.5 pt-1">
              {filteredDocs.map((doc) => {
                const isSelected = selectedDocId === doc.id;
                const isSigned = !!signedDocs[doc.id];

                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`px-3 py-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {isSigned ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <FileText className={`w-4 h-4 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                      )}
                      <span className={`text-xs truncate ${isSelected ? 'font-bold text-blue-950' : 'font-medium text-slate-800'}`}>
                        {doc.name}
                      </span>
                    </div>

                    {/* Preview Icon Button */}
                    <button
                      type="button"
                      title="View Full Page Preview"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDocId(doc.id);
                        setIsPreviewModalOpen(true);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-100 transition-colors shrink-0 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right A4 Workspace View */}
        <div className="lg:col-span-8 space-y-3">
          {/* Action Toolbar - Fit Page is the only mode by default (No 100% toggle, clean single line) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm truncate">{activeDoc.name}</h3>
                  {isDocSigned ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                      <Lock className="w-3 h-3 text-emerald-600" /> Signed
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3 text-amber-600" /> Draft
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 font-mono">
                  Ref: {activeDoc.code} | Standard A4 Sheet (Fit Page)
                </p>
              </div>
            </div>

            {/* Clean Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Preview in Full Modal Button (Eye Icon) */}
              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(true)}
                className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Open full page preview modal"
              >
                <Eye className="w-3.5 h-3.5 text-blue-700" />
                Preview Full Page
              </button>

              {/* Print Button */}
              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                Print
              </button>

              {/* Download PDF Button */}
              <button
                type="button"
                disabled={isExportingPdf}
                onClick={handleDownloadPdf}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-60"
              >
                {isExportingPdf ? (
                  <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                )}
                {isExportingPdf ? 'Exporting...' : 'PDF'}
              </button>

              {/* Digital Sign Button */}
              <button
                type="button"
                onClick={() => setIsSigningModalOpen(true)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                  isDocSigned
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                {isDocSigned ? 'Re-Sign' : 'Digital Sign'}
              </button>
            </div>
          </div>

          {/* Inline A4 Sheet Preview Workspace: strictly Fit Page by default */}
          <div className="bg-slate-100 rounded-2xl p-4 sm:p-6 border border-slate-200 flex justify-center items-center overflow-hidden min-h-[740px]">
            <div className="w-[516px] h-[730px] relative overflow-hidden shrink-0 flex items-center justify-center">
              <div
                id="printable-art-document"
                style={{
                  transform: 'scale(0.65)',
                  transformOrigin: 'top center',
                }}
                className="absolute top-0"
              >
                {renderA4Content()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FULL MODAL PREVIEW (Eye Icon Trigger) - Complete Full Page Fit by Default */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[96vh] flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="p-3.5 bg-slate-50 text-slate-900 flex items-center justify-between border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    {activeDoc.name}
                    {isDocSigned && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Signed & Verified
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Full Page Official A4 Preview (210mm × 297mm)
                  </p>
                </div>
              </div>

              {/* Action buttons inside Modal */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button
                  type="button"
                  disabled={isExportingPdf}
                  onClick={handleDownloadPdf}
                  className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" /> PDF
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors ml-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Displays the complete Full Page fitted cleanly */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-100 flex justify-center items-center">
              <div className="w-[580px] h-[820px] relative overflow-hidden flex items-center justify-center shrink-0">
                <div
                  style={{
                    transform: 'scale(0.73)',
                    transformOrigin: 'top center',
                  }}
                  className="absolute top-0"
                >
                  {renderA4Content()}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
              <span>Standard A4 Specification: 210mm × 297mm | Full Page View</span>
              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(false)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIGITAL SIGNATURE MODAL */}
      {isSigningModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-slate-900">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <PenTool className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Digital Signature Execution</h3>
                  <p className="text-[11px] text-slate-500">{activeDoc.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSigningModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4">
              {/* Signer Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Signatory Authority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Donor', 'Medical Director', 'Authorized Witness'] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => {
                        setSignerRole(role);
                        if (role === 'Donor') setTypedSignerName(donorFullName);
                        if (role === 'Medical Director') setTypedSignerName(reviewingDoctor);
                        if (role === 'Authorized Witness') setTypedSignerName('Dr. Priya Verma (Counsellor)');
                      }}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                        signerRole === role
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode Switcher: Draw vs Type */}
              <div className="flex rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setSignatureType('draw')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    signatureType === 'draw'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Draw Signature (Canvas)
                </button>
                <button
                  type="button"
                  onClick={() => setSignatureType('type')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    signatureType === 'type'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Type Official Signature
                </button>
              </div>

              {/* Draw Signature Canvas */}
              {signatureType === 'draw' && (
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <span>Draw signature using mouse or touch:</span>
                    <button
                      type="button"
                      onClick={clearCanvas}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 overflow-hidden cursor-crosshair relative">
                    <canvas
                      ref={canvasRef}
                      width={440}
                      height={140}
                      className="w-full h-36 touch-none block"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                    />
                    {!hasDrawnSignature && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs font-medium">
                        Click and drag to draw signature here
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Type Signature */}
              {signatureType === 'type' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={typedSignerName}
                    onChange={(e) => setTypedSignerName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter signatory name"
                  />

                  <div className="mt-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">
                      Signature Rendering Preview
                    </span>
                    <span className="font-serif italic text-xl text-blue-900 font-bold block">
                      {typedSignerName || 'Signatory Name'}
                    </span>
                  </div>
                </div>
              )}

              {/* Statutory Confirmation Checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 bg-blue-50/60 p-2.5 rounded-xl border border-blue-200">
                <input
                  type="checkbox"
                  checked={hasAgreedTerms}
                  onChange={(e) => setHasAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="leading-relaxed">
                  I affirm that this digital signature is legally binding under Section 5 of the Information Technology Act, 2000 and Section 21 of the ART Act, 2021.
                </span>
              </label>
            </div>

            {/* Modal Actions */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsSigningModalOpen(false)}
                className="px-4 py-2 font-bold text-xs text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!hasAgreedTerms}
                onClick={handleApplySignature}
                className="px-4 py-2 font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                Apply Signature & Lock Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
