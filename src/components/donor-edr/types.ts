import { LucideIcon } from 'lucide-react';

export interface TabItem {
  id: string;
  name: string;
  icon: LucideIcon;
  numericAlias?: string;
}

export interface DonorData {
  _id?: string;
  id: string;
  registrationDate: string;
  staffAssigned: string;
  branch: string;
  status: string;
  photoUrl?: string;
  firstName: string;
  lastName: string;
  donorType: 'Sperm' | 'Egg' | 'Male' | 'Female';
  gender: string;
  dob: string;
  age: number;
  nationality: string;
  religion?: string;
  occupation: string;
  education: string;
  languages?: string;
  maritalStatus?: string;
  children?: string;
  
  // Documents
  primaryDocType: string;
  primaryDocNumber: string;
  primaryDocUrl: string;
  secondaryDocType?: string;
  secondaryDocNumber?: string;
  secondaryDocUrl?: string;
  aadhaar?: string;
  pan?: string;
  voterId?: string;
  aadhaarDoc?: string;
  panDoc?: string;
  
  // Contact
  phone: string;
  alternatePhone?: string;
  address: string;
  
  // Physical
  height: number;
  weight: number;
  bloodGroup: string;
  skinTone: string;
  eyeColor: string;
  hairColor?: string;
  hairType?: string;
  bodyType?: string;

  // EDR sections data & completion tracking
  completedTabs: string[];
  completionScore?: number;
  edrData?: Record<string, any>;
}
