export type DonorStatus = 
  | 'New Registration' | 'Documents Pending' | 'Identity Verified' 
  | 'Counselling Pending' | 'Consent Pending' | 'Medical Screening Pending' 
  | 'Laboratory Tests Pending' | 'Genetic Test Pending' | 'Psychological Assessment Pending' 
  | 'Doctor Review Pending' | 'Approved' | 'Rejected' | 'On Hold' 
  | 'Sample Collection Pending' | 'Sample Collected' | 'Cryopreserved' 
  | 'Active Inventory' | 'Reserved' | 'Dispatched' | 'Completed' | 'Archived';

// Shared donor master table
export interface DonorMaster {
  id: string; // e.g., DON-2026-000145
  registrationDate: string;
  staffAssigned: string;
  branch: string;
  status: DonorStatus;
  
  // Basic & Personal
  donorType: 'Male' | 'Female' | '';
  firstName: string;
  lastName: string;
  dob: string;
  age: number;
  nationality: string;
  religion: string;
  occupation: string;
  education: string;
  languages: string;
  maritalStatus: string;
  
  // Identity
  aadhaar: string;
  pan: string;
  photoUrl?: string;
  
  // Contact
  phone: string;
  email: string;
  address: string;
  emergencyContact?: string;
  
  // Physical/General
  height: number; // cm
  weight: number; // kg
  bloodGroup: string;
  skinTone: string;
  eyeColor: string;
  
  // Progress
  completionScore: number;
}

export interface MaleDonorDetails {
  donorId: string; // References DonorMaster.id
  children: string;
  fertilityHistory: string;
  sexualHealthHistory: string;
  
  // Semen Analysis
  abstinencePeriod: string;
  sampleVolume: string;
  concentration: string;
  totalCount: string;
  progressiveMotility: string;
  totalMotility: string;
  morphology: string;
  vitality: string;
  liquefactionTime: string;
  ph: string;
  whiteBloodCells: string;
  dnaFragmentationIndex: string;
  marTest: string;
  
  // Hormonal
  testosterone: string;
  fsh: string;
  lh: string;
  prolactin: string;
  tsh: string;
  estradiol: string;
  
  // Physical Exam
  bloodPressure: string;
  pulse: string;
  varicoceleAssessment: string;
  genitalExamination: string;
  generalPhysicalExamination: string;
  
  // Lab Tests
  hiv: string;
  hbsag: string;
  hcv: string;
  vdrl: string;
  cmv: string;
  cbc: string;
  bloodSugar: string;
  urineTest: string;
  
  // Genetic Tests
  karyotyping: string;
  yChromosomeMicrodeletion: string;
  carrierScreening: string;
  dnaAnalysis: string;
  
  // Collection & Cryo
  collectionDate: string;
  collectionTime: string;
  collectionRoom: string;
  sampleBarcode: string;
  sampleQuality: string;
  cryogenicTank: string;
  storagePosition: string;
}

export interface FemaleDonorDetails {
  donorId: string; // References DonorMaster.id
  numberOfPregnancies: string;
  liveBirths: string;
  miscarriages: string;
  previousEggDonations: string;
  previousIvfTreatments: string;
  
  // Menstrual History
  ageAtMenarche: string;
  cycleLength: string;
  cycleRegularity: string;
  lastMenstrualPeriod: string;
  dysmenorrhea: string;
  menstrualDisorders: string;
  
  // Ovarian Assessment
  amh: string;
  afc: string;
  ovarianReserve: string;
  ultrasoundFindings: string;
  dominantFollicle: string;
  endometrialThickness: string;
  
  // Hormonal Profile
  fsh: string;
  lh: string;
  estradiol: string;
  progesterone: string;
  prolactin: string;
  tsh: string;
  
  // Lab Tests
  hiv: string;
  hbsag: string;
  hcv: string;
  vdrl: string;
  cmv: string;
  cbc: string;
  bloodGroup: string;
  bloodSugar: string;
  
  // Genetic Tests
  karyotyping: string;
  carrierScreening: string;
  dnaAnalysis: string;
  
  // Retrieval & Cryo
  stimulationProtocol: string;
  triggerDate: string;
  retrievalDate: string;
  numberOfOocytesRetrieved: string;
  matureOocytes: string;
  frozenOocytes: string;
  cryogenicTank: string;
  storagePosition: string;
}

// We can type the active DonorDetails in memory as a combination of Master + Gender Specific
export type DonorDetails = DonorMaster & Partial<MaleDonorDetails> & Partial<FemaleDonorDetails> & { gender?: string };

export interface DashboardStats {
  website: { totalVisitors: number; pageViews: number; leads: number; };
  operational: { totalDonors: number; activeDonors: number; underScreening: number; };
  hospital: { activeHospitals: number; requestsReceived: number; samplesDispatched: number; };
  laboratory: { samplesCollected: number; cryoCapacityPercent: number; tempAlerts: number; };
  financial: { monthlyRevenue: number; outstanding: number; };
  ai: { totalSearches: number; successfulMatches: number; accuracyPercent: number; };
}
