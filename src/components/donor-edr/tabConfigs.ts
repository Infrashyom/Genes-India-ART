import { DynamicFormField } from './tabs/DynamicFormTab';

export interface TabConfig {
  title: string;
  description: string;
  fields: DynamicFormField[];
  nextTabId?: string;
}

const RAW_CONFIGS: Record<string, TabConfig> = {
  // Male Specific Tabs
  'reproductive-info': {
    title: 'Male Reproductive History',
    description: 'Prior biological paternity, children details, previous gamete donations, and urological history.',
    nextTabId: 'semen-analysis',
    fields: [
      { name: 'provenFertility', label: 'Proven Biological Paternity', type: 'select', options: ['Yes', 'No', 'Not Tested'], required: true },
      { name: 'yearOfMarriage', label: 'Year of Marriage (if married)', type: 'text', placeholder: 'e.g. 2019 or Unmarried / N/A' },
      { name: 'childrenCount', label: 'Total Number of Biological Children', type: 'number', placeholder: '0' },
      { name: 'boysCount', label: 'Number of Boys (Sons)', type: 'number', placeholder: '0' },
      { name: 'girlsCount', label: 'Number of Girls (Daughters)', type: 'number', placeholder: '0' },
      { name: 'childrenAges', label: 'Age(s) of Children', type: 'text', placeholder: 'e.g. Son: 5 yrs, Daughter: 2 yrs' },
      { name: 'priorDonations', label: 'Prior Gamete Donations', type: 'select', options: ['None (First Time)', '1 Donation', '2 Donations', 'Max Limit Reached'], required: true },
      { name: 'erectileEjaculatoryFunction', label: 'Erectile & Ejaculatory Function', type: 'select', options: ['Normal', 'Occasional Dysfunction', 'Abnormal'] },
      { name: 'testicularTrauma', label: 'History of Testicular Trauma or Mumps', type: 'text', placeholder: 'e.g. None or specify year' },
    ],
  },
  'semen-analysis': {
    title: 'Semen Analysis & Spermogram',
    description: 'WHO 6th Edition guidelines compliant semen examination baseline.',
    nextTabId: 'male-hormones',
    fields: [
      { name: 'testDate', label: 'Date of Semen Analysis Test', type: 'date', required: true },
      { name: 'abstinencePeriod', label: 'Abstinence Period (Days)', type: 'number', placeholder: '3 to 5 days', required: true },
      { name: 'semenVolume', label: 'Ejaculate Volume (mL)', type: 'text', placeholder: 'e.g. 2.8 mL (Normal >= 1.4)' },
      { name: 'spermConcentration', label: 'Sperm Concentration (M/mL)', type: 'text', placeholder: 'e.g. 65 M/mL (Normal >= 16)' },
      { name: 'totalMotility', label: 'Total Motility (%)', type: 'text', placeholder: 'e.g. 72% (Normal >= 42)' },
      { name: 'progressiveMotility', label: 'Progressive Motility PR (%)', type: 'text', placeholder: 'e.g. 58% (Normal >= 30)' },
      { name: 'normalMorphology', label: 'Normal Morphology Kruger (%)', type: 'text', placeholder: 'e.g. 7% (Normal >= 4)' },
      { name: 'vitality', label: 'Viability / Vitality (%)', type: 'text', placeholder: 'e.g. 84%' },
      { name: 'liquefactionTime', label: 'Liquefaction Time (min)', type: 'text', placeholder: 'e.g. 20 min (< 30 min)' },
    ],
  },
  'male-hormones': {
    title: 'Male Endocrine & Hormone Profile',
    description: 'Hypothalamic-pituitary-gonadal axis hormonal assessment.',
    nextTabId: 'physical-exam',
    fields: [
      { name: 'serumTestosterone', label: 'Serum Total Testosterone (ng/dL)', type: 'text', placeholder: 'e.g. 580 ng/dL (Normal: 300-1000)' },
      { name: 'serumFsh', label: 'Serum FSH (mIU/mL)', type: 'text', placeholder: 'e.g. 3.4 mIU/mL (Normal: 1.5-12.4)' },
      { name: 'serumLh', label: 'Serum LH (mIU/mL)', type: 'text', placeholder: 'e.g. 4.1 mIU/mL (Normal: 1.7-8.6)' },
      { name: 'serumProlactin', label: 'Serum Prolactin (ng/mL)', type: 'text', placeholder: 'e.g. 8.2 ng/mL (Normal: 4.0-15.2)' },
      { name: 'serumTsh', label: 'Serum TSH (uIU/mL)', type: 'text', placeholder: 'e.g. 1.8 uIU/mL (Normal: 0.4-4.2)' },
    ],
  },
  'physical-exam': {
    title: 'Physical & Andrological Examination',
    description: 'Clinical examination of external genitalia and andrological evaluation.',
    nextTabId: 'laboratory-tests',
    fields: [
      { name: 'testisVolumeRight', label: 'Right Testicular Volume (mL)', type: 'text', placeholder: 'e.g. 18 mL' },
      { name: 'testisVolumeLeft', label: 'Left Testicular Volume (mL)', type: 'text', placeholder: 'e.g. 18 mL' },
      { name: 'varicocele', label: 'Varicocele Assessment', type: 'select', options: ['None / Absent', 'Grade 1 (Palpable with Valsalva)', 'Grade 2', 'Grade 3'] },
      { name: 'vasDeferens', label: 'Bilateral Vas Deferens Palpation', type: 'select', options: ['Bilateral Intact & Normal', 'Unilateral Agenesis', 'Bilateral Absence'] },
      { name: 'gynaecomastia', label: 'Secondary Sexual Characteristics / Gynaecomastia', type: 'text', placeholder: 'e.g. Normal male virilization, no gynaecomastia' },
    ],
  },
  'laboratory-tests': {
    title: 'Laboratory & Infectious Disease Screening',
    description: 'Statutory Serological Viral & Microbial Screening under ART Act and Urine Routine.',
    nextTabId: 'genetic-screening',
    fields: [
      { name: 'hivScreening', label: 'HIV 1 & 2 Antibody / p24 Ag', type: 'select', options: ['Non-Reactive / Negative', 'Reactive / Positive'], required: true },
      { name: 'hbsAg', label: 'HBsAg (Hepatitis B Surface Ag)', type: 'select', options: ['Non-Reactive / Negative', 'Reactive / Positive'], required: true },
      { name: 'hcvAb', label: 'Anti-HCV (Hepatitis C Antibody)', type: 'select', options: ['Non-Reactive / Negative', 'Reactive / Positive'], required: true },
      { name: 'vdrlSyphilis', label: 'VDRL / RPR (Syphilis Screening)', type: 'select', options: ['Non-Reactive / Negative', 'Reactive / Positive'], required: true },
      { name: 'urineRoutine', label: 'Urine Routine & Microscopy Examination (R/M)', type: 'select', options: ['Normal / Nil Albumin & Sugar (Pus cells 0-2/hpf)', 'Normal - No Abnormality Detected', 'Mild Pus Cells (3-5/hpf)', 'Albumin / Protein Positive', 'Microscopic Hematuria', 'Infection / Culture Advised'] },
      { name: 'urineMicroscopyNotes', label: 'Urine Analysis Detailed Findings / Notes', type: 'text', placeholder: 'e.g. Color Pale Yellow, Sp. Gr 1.015, Pus cells 1-2, Sugar Nil' },
      { name: 'chlamydiaGonorrhea', label: 'Chlamydia & Gonorrhea NAAT', type: 'select', options: ['Negative', 'Positive'] },
      { name: 'cmvIgGIgM', label: 'CMV IgG / IgM Serology', type: 'text', placeholder: 'e.g. IgG Positive / IgM Negative' },
    ],
  },
  'genetic-screening': {
    title: 'Genetic Screening & Karyotyping',
    description: 'Cytogenetic analysis and monogenic carrier gene screening (Non-Mandatory / Optional).',
    nextTabId: 'psychological-assessment',
    fields: [
      { name: 'karyotypeResult', label: 'Chromosomal Karyotype', type: 'text', placeholder: 'e.g. 46,XY (Normal Male Karyotype)' },
      { name: 'thalassemiaCarrier', label: 'Beta Thalassemia Hb HPLC', type: 'select', options: ['Negative / Normal HbA2', 'Carrier / Elevated HbA2', 'Not Tested'] },
      { name: 'smaScreening', label: 'Spinal Muscular Atrophy (SMN1 Exon 7/8)', type: 'select', options: ['Normal (2 Copies)', 'Carrier (1 Copy)', 'Not Screened'] },
      { name: 'g6pdStatus', label: 'G6PD Enzyme Deficiency', type: 'select', options: ['Normal', 'Deficient', 'Not Screened'] },
      { name: 'expandedCarrierPanel', label: 'Expanded NGS Genetic Carrier Screening', type: 'textarea', placeholder: 'Details of multi-gene NGS panel results or negative mutations' },
    ],
  },

  // Female Specific Tabs
  'reproductive-history': {
    title: 'Female Reproductive History (Obstetric & Gynecological)',
    description: 'Parity records, children details, previous successful deliveries, and ART donation history.',
    nextTabId: 'menstrual-history',
    fields: [
      { name: 'gravida', label: 'Gravida (Total Pregnancies)', type: 'number', placeholder: 'e.g. 2', required: true },
      { name: 'para', label: 'Para (Live Deliveries)', type: 'number', placeholder: 'e.g. 2', required: true },
      { name: 'yearOfMarriage', label: 'Year of Marriage (if married)', type: 'text', placeholder: 'e.g. 2018 or Unmarried / N/A' },
      { name: 'livingChildren', label: 'Living Children Count', type: 'number', placeholder: 'e.g. 2', required: true },
      { name: 'boysCount', label: 'Number of Boys (Sons)', type: 'number', placeholder: '0' },
      { name: 'girlsCount', label: 'Number of Girls (Daughters)', type: 'number', placeholder: '0' },
      { name: 'childrenAges', label: 'Age(s) of Children', type: 'text', placeholder: 'e.g. Son: 4 yrs, Daughter: 1 yr' },
      { name: 'miscarriages', label: 'Spontaneous Abortions / Miscarriages', type: 'number', placeholder: '0' },
      { name: 'priorEggDonations', label: 'Prior Oocyte Donation Cycles', type: 'select', options: ['None (First Time Donor)', '1 Prior Cycle', '2 Prior Cycles', 'Maximum 1 Lifetime Cycle (ART Act)'], required: true },
    ],
  },
  'menstrual-history': {
    title: 'Menstrual Cycle & Ovulatory Profile',
    description: 'Cycle regularity, intervals, duration, and dysmenorrhea assessment.',
    nextTabId: 'ovarian-assessment',
    fields: [
      { name: 'cycleRegularity', label: 'Menstrual Regularity', type: 'select', options: ['Regular (28-30 days)', 'Mildly Irregular', 'Oligomenorrhea', 'Amenorrhea'], required: true },
      { name: 'cycleLength', label: 'Average Cycle Length (Days)', type: 'text', placeholder: 'e.g. 28 days' },
      { name: 'bleedingDuration', label: 'Bleeding Duration (Days)', type: 'text', placeholder: 'e.g. 4-5 days' },
      { name: 'lastMenstrualPeriod', label: 'Last Menstrual Period (LMP)', type: 'date' },
      { name: 'dysmenorrhea', label: 'Dysmenorrhea / Pelvic Pain', type: 'select', options: ['None / Mild', 'Moderate', 'Severe (Endometriosis suspected)'] },
    ],
  },
  'ovarian-assessment': {
    title: 'Ovarian Reserve & Ultrasound Examination',
    description: 'Antral Follicle Count (AFC), pelvic anatomy, and bilateral ovarian ultrasound.',
    nextTabId: 'female-hormones',
    fields: [
      { name: 'afcRightOvary', label: 'Right Ovary AFC', type: 'number', placeholder: 'e.g. 8' },
      { name: 'afcLeftOvary', label: 'Left Ovary AFC', type: 'number', placeholder: 'e.g. 7' },
      { name: 'totalAfc', label: 'Total Antral Follicle Count (AFC)', type: 'number', placeholder: 'e.g. 15', required: true },
      { name: 'amhValue', label: 'Serum Anti-Müllerian Hormone AMH (ng/mL)', type: 'text', placeholder: 'e.g. 3.2 ng/mL (Optimal: 2.0-4.0)', required: true },
      { name: 'pelvicUltrasoundSummary', label: 'Pelvic Anatomy & Endometrial Findings', type: 'textarea', placeholder: 'Normal uterus, bilateral ovaries clear of endometrioma or cysts' },
    ],
  },
  'female-hormones': {
    title: 'Female Endocrine & Hormone Profile',
    description: 'Day 2/3 basal endocrine panel for ovarian responsiveness.',
    nextTabId: 'female-laboratory-tests',
    fields: [
      { name: 'day2Fsh', label: 'Day 2/3 FSH (mIU/mL)', type: 'text', placeholder: 'e.g. 5.8 mIU/mL (Optimal < 8.0)' },
      { name: 'day2Lh', label: 'Day 2/3 LH (mIU/mL)', type: 'text', placeholder: 'e.g. 4.6 mIU/mL' },
      { name: 'day2Estradiol', label: 'Day 2/3 Estradiol E2 (pg/mL)', type: 'text', placeholder: 'e.g. 38 pg/mL (< 50 pg/mL)' },
      { name: 'serumProlactin', label: 'Serum Prolactin (ng/mL)', type: 'text', placeholder: 'e.g. 12 ng/mL (< 25 ng/mL)' },
      { name: 'serumTsh', label: 'Serum TSH (uIU/mL)', type: 'text', placeholder: 'e.g. 1.9 uIU/mL (Optimal < 2.5)' },
    ],
  },
  'female-laboratory-tests': {
    title: 'Laboratory & Infectious Disease Screening',
    description: 'Mandatory statutory serology panel under ART regulatory guidelines and Urine Routine.',
    nextTabId: 'female-genetic-screening',
    fields: [
      { name: 'hivScreening', label: 'HIV 1 & 2 Antibody / p24 Ag', type: 'select', options: ['Non-Reactive / Negative', 'Reactive / Positive'], required: true },
      { name: 'hbsAg', label: 'HBsAg (Hepatitis B Surface Ag)', type: 'select', options: ['Non-Reactive / Negative', 'Reactive / Positive'], required: true },
      { name: 'hcvAb', label: 'Anti-HCV (Hepatitis C Antibody)', type: 'select', options: ['Non-Reactive / Negative', 'Reactive / Positive'], required: true },
      { name: 'vdrlSyphilis', label: 'VDRL / Syphilis', type: 'select', options: ['Non-Reactive / Negative', 'Reactive / Positive'], required: true },
      { name: 'urineRoutine', label: 'Urine Routine & Microscopy Examination (R/M)', type: 'select', options: ['Normal / Nil Albumin & Sugar (Pus cells 0-2/hpf)', 'Normal - No Abnormality Detected', 'Mild Pus Cells (3-5/hpf)', 'Albumin / Protein Positive', 'Microscopic Hematuria', 'Infection / Culture Advised'] },
      { name: 'urineMicroscopyNotes', label: 'Urine Analysis Detailed Findings / Notes', type: 'text', placeholder: 'e.g. Color Pale Yellow, Sp. Gr 1.015, Pus cells 1-2, Sugar Nil' },
      { name: 'rubellaIgg', label: 'Rubella IgG Antibody', type: 'select', options: ['Immune / Positive IgG', 'Non-Immune / Negative'] },
    ],
  },
  'female-genetic-screening': {
    title: 'Genetic Screening & Karyotyping',
    description: 'Cytogenetic analysis and monogenic carrier screening for oocyte donors (Non-Mandatory / Optional).',
    nextTabId: 'egg-retrieval',
    fields: [
      { name: 'karyotypeResult', label: 'Chromosomal Karyotype', type: 'text', placeholder: 'e.g. 46,XX (Normal Female Karyotype)' },
      { name: 'thalassemiaCarrier', label: 'Beta Thalassemia Hb HPLC', type: 'select', options: ['Negative / Normal HbA2', 'Carrier / Elevated HbA2', 'Not Tested'] },
      { name: 'fragileX', label: 'Fragile X (FMR1 CGG Repeats)', type: 'select', options: ['Normal (< 45 repeats)', 'Premutation', 'Not Screened'] },
      { name: 'smaScreening', label: 'Spinal Muscular Atrophy (SMN1)', type: 'select', options: ['Normal (2 Copies)', 'Carrier', 'Not Screened'] },
    ],
  },
  'egg-retrieval': {
    title: 'Controlled Ovarian Stimulation & Retrieval',
    description: 'Clinical stimulation protocol and oocyte retrieval yield documentation.',
    nextTabId: 'psychological-assessment',
    fields: [
      { name: 'stimulationProtocol', label: 'Protocol Type', type: 'select', options: ['GnRH Antagonist Protocol', 'GnRH Agonist Long Protocol', 'Mild Stimulation Protocol'] },
      { name: 'totalGonadotropinDose', label: 'Total Gonadotropin Units (IU)', type: 'text', placeholder: 'e.g. 1800 IU rFSH' },
      { name: 'triggerType', label: 'Ovulatory Trigger Administered', type: 'select', options: ['GnRH Agonist (Leuprolide / Decapeptyl)', 'Recombinant hCG', 'Dual Trigger'] },
      { name: 'totalOocytesRetrieved', label: 'Total Oocytes Retrieved (Cumulus Complexes)', type: 'number', placeholder: 'e.g. 14' },
      { name: 'matureOocytesMII', label: 'Mature Metaphase-II (M-II) Oocytes Yield', type: 'number', placeholder: 'e.g. 11' },
      { name: 'retrievalComplications', label: 'Post-Retrieval OHSS / Complications', type: 'select', options: ['None / Uneventful Recovery', 'Mild OHSS (Conservative)', 'Moderate OHSS'] },
    ],
  },

  // Common Clinical & Administrative Tabs
  'psychological-assessment': {
    title: 'Clinical Psychological Assessment',
    description: 'Certified psychological counseling and donor cognitive evaluation under ART Act.',
    nextTabId: 'consent-legal',
    fields: [
      { name: 'counselingDate', label: 'Counseling Session Date', type: 'date', required: true },
      { name: 'counselorName', label: 'Clinical Psychologist / Counsellor Name', type: 'text', placeholder: 'e.g. Dr. Priya Verma', required: true },
      { name: 'psychologicalStability', label: 'Emotional & Psychological Stability', type: 'select', options: ['Stable & Coherent', 'Mild Anxiety / Clarified', 'Unstable / Deferred'], required: true },
      { name: 'understandingOfGameteDonation', label: 'Understanding of Anonymity & Non-Parentage', type: 'select', options: ['Full Comprehension & Agreement', 'Requires Further Counseling'], required: true },
      { name: 'psychologicalClearance', label: 'Psychological Clearance Recommendation', type: 'select', options: ['Recommended / Cleared', 'Conditional', 'Rejected'], required: true },
      { name: 'counselorRemarks', label: 'Detailed Counselor Notes', type: 'textarea', placeholder: 'Donor shows high altruistic motivation, fully understands relinquishment of parental rights under ART Act 2021.' },
    ],
  },
  'consent-legal': {
    title: 'Statutory Consent & Legal Documentation',
    description: 'Statutory Form 10, Form 11 (Male), Form 13 (Female), and ART Act mandatory consent verification (No consent expiry).',
    nextTabId: 'doctor-review',
    fields: [
      { name: 'statutoryConsentStatus', label: 'Statutory Consent Form Execution Status', type: 'select', options: ['Signed & Digitally Verified', 'Awaiting Physical Signature', 'Not Executed'], required: true },
      { name: 'artActDeclarationSigned', label: 'ART Act 2021 Declaration of Anonymity & Non-Parentage', type: 'select', options: ['Signed & Witnessed', 'Pending'], required: true },
      { name: 'spouseConsent', label: 'Spousal Consent (if legally married)', type: 'select', options: ['Signed & Attached', 'Not Applicable (Unmarried/Divorced)'] },
      { name: 'legalWitnessName', label: 'Authorized Clinic Witness Name', type: 'text', placeholder: 'e.g. S. Sen (Legal Officer)' },
      { name: 'notarizedAffidavitNumber', label: 'Notarized Legal Affidavit Number', type: 'text', placeholder: 'e.g. AFF-2026-9812' },
    ],
  },
  'doctor-review': {
    title: 'Treating Doctor / Specialist Medical Review',
    description: 'Final clinical clearance and signing authority by the Medical Director.',
    nextTabId: 'sample-collection',
    fields: [
      { name: 'reviewingDoctorName', label: 'Reviewing ART Specialist / Clinician', type: 'text', placeholder: 'e.g. Dr. A. K. Banerjee (MD, FRCOG)', required: true },
      { name: 'clinicalDecision', label: 'Final Clinical Decision', type: 'select', options: ['Medically Fit & Cleared for Donation', 'Temporary Medical Quarantine', 'Medically Ineligible / Rejected'], required: true },
      { name: 'clearanceDate', label: 'Medical Clearance Date', type: 'date', required: true },
      { name: 'doctorRegistrationNumber', label: 'Doctor State Medical Council Reg No.', type: 'text', placeholder: 'e.g. MCI-48291' },
      { name: 'clinicalNotes', label: 'Clinical Rationale & Notes', type: 'textarea', placeholder: 'Donor meets all statutory criteria under the Assisted Reproductive Technology Regulation Act 2021.' },
    ],
  },
  'sample-collection': {
    title: 'Gamete Sample Collection Protocol',
    description: 'Barcoded chain-of-custody collection procedures, freezing details, and dual-witness verification.',
    nextTabId: 'cryobank-inventory',
    fields: [
      { name: 'collectionDate', label: 'Sample Collection Date & Time', type: 'text', placeholder: 'e.g. 2026-09-24 09:30 AM', required: true },
      { name: 'collectionStaff', label: 'Collecting Andrologist / Nurse', type: 'text', placeholder: 'e.g. Nurse Sunita M.' },
      { name: 'sampleContainerBarcode', label: 'Sample Barcode / UID', type: 'text', placeholder: 'e.g. SMP-9921-A' },
      { name: 'numberOfVialsCollected', label: 'Number of Vials / Straws Collected', type: 'number', placeholder: 'e.g. 6' },
      { name: 'freezingMethod', label: 'Freezing / Cryopreservation Method', type: 'select', options: ['Vitrification (Rapid Freezing)', 'Slow Programmable Freezing', 'Vapor Phase Nitrogen Freezing'] },
      { name: 'witnessVerification', label: 'Dual-Witness Verification', type: 'select', options: ['Completed & Confirmed', 'Single Witness'] },
    ],
  },
  'cryobank-inventory': {
    title: 'Cryobank Storage & Inventory Allocation',
    description: 'Freezing details: number of vials, container location, vitrification / cryopreservation canister, tank, goblet, and straw allocation.',
    nextTabId: 'hospital-allocation',
    fields: [
      { name: 'tankId', label: 'Liquid Nitrogen (LN2) Tank ID', type: 'text', placeholder: 'e.g. CryoTank-02', required: true },
      { name: 'containerLocation', label: 'Location of Container / Storage Location', type: 'text', placeholder: 'e.g. Tank-02 / Canister-04 / Goblet-Yellow / Rack-1 / Slot-5', required: true },
      { name: 'numberOfVials', label: 'Number of Vials / Straws Stored', type: 'number', placeholder: 'e.g. 6', required: true },
      { name: 'canisterNumber', label: 'Canister Number', type: 'text', placeholder: 'e.g. CAN-04' },
      { name: 'gobletColor', label: 'Goblet Color Identifier', type: 'text', placeholder: 'e.g. Yellow' },
      { name: 'freezingDate', label: 'Date & Time of Freezing / Cryostorage', type: 'text', placeholder: 'e.g. 2026-09-24 10:30 AM' },
      { name: 'cryoPreservativeUsed', label: 'Cryoprotectant Media / Protocol', type: 'text', placeholder: 'e.g. SpermFreeze / Vitrification Kit' },
      { name: 'quarantineStatus', label: '6-Month Quarantine Mandatory Window', type: 'select', options: ['In Quarantine (Window Period)', 'Quarantine Cleared (Repeat Serology Negative)'], required: true },
    ],
  },
  'hospital-allocation': {
    title: 'Hospital & ART Clinic Allocation',
    description: 'Traceable dispatch record to registered ART clinics/hospitals.',
    nextTabId: 'financial-insurance',
    fields: [
      { name: 'recipientClinicName', label: 'Allocated Registered ART Clinic', type: 'text', placeholder: 'e.g. Apex Fertility Center' },
      { name: 'clinicNationalRegNo', label: 'Clinic National ART Registry ID', type: 'text', placeholder: 'e.g. ART-CL-UP-2024-0012' },
      { name: 'dispatchDate', label: 'Dispatch Date', type: 'date' },
      { name: 'dryShipperId', label: 'Dry Shipper Liquid Nitrogen ID', type: 'text', placeholder: 'e.g. DS-03' },
      { name: 'dispatchStatus', label: 'Allocation Status', type: 'select', options: ['Available in Bank', 'Reserved for Clinic', 'Dispatched / In Transit', 'Utilized'] },
    ],
  },
  'financial-insurance': {
    title: 'Financial & Statutory Insurance Records',
    description: 'Mandatory donor health insurance policy and expense reimbursement tracking.',
    nextTabId: 'document-generation',
    fields: [
      { name: 'insurancePolicyNumber', label: 'Statutory Health Insurance Policy No.', type: 'text', placeholder: 'e.g. HDFC-ERGO-ART-9921', required: true },
      { name: 'insuranceSumInsured', label: 'Sum Insured Amount (INR)', type: 'text', placeholder: 'e.g. Rs. 5,00,000' },
      { name: 'policyValidityMonths', label: 'Policy Coverage Term', type: 'text', placeholder: 'e.g. 12 Months' },
      { name: 'reimbursementStatus', label: 'Direct Expense Reimbursement', type: 'select', options: ['Processed via Bank Transfer', 'Pending Submission', 'Completed'] },
      { name: 'transactionReference', label: 'NEFT / RTGS Transaction Ref ID', type: 'text', placeholder: 'e.g. UTR-982187391' },
    ],
  },
};

// Aliases for backward compatibility with legacy numeric codes
const ALIAS_MAP: Record<string, string> = {
  m1: 'reproductive-info',
  m2: 'semen-analysis',
  m3: 'male-hormones',
  m4: 'physical-exam',
  m5: 'laboratory-tests',
  m6: 'genetic-screening',
  f1: 'reproductive-history',
  f2: 'menstrual-history',
  f3: 'ovarian-assessment',
  f4: 'female-hormones',
  f5: 'female-laboratory-tests',
  f6: 'female-genetic-screening',
  f7: 'egg-retrieval',
  '10': 'psychological-assessment',
  '11': 'consent-legal',
  '12': 'doctor-review',
  '13': 'sample-collection',
  '14': 'cryobank-inventory',
  '15': 'hospital-allocation',
  '16': 'financial-insurance',
};

export const CLINICAL_TAB_CONFIGS: Record<string, TabConfig> = {
  ...RAW_CONFIGS,
  ...Object.fromEntries(
    Object.entries(ALIAS_MAP).map(([alias, slug]) => [alias, RAW_CONFIGS[slug]])
  ),
};
