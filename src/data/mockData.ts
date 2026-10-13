import { DonorDetails, DonorStatus } from '../types';

const firstNames = ['Rahul', 'Amit', 'Vikram', 'Priya', 'Neha', 'Sneha', 'Arjun', 'Ravi', 'Anjali', 'Kiran', 'Suresh', 'Ramesh', 'Pooja', 'Kavita', 'Manish'];
const lastNames = ['Sharma', 'Patel', 'Singh', 'Gupta', 'Kumar', 'Verma', 'Reddy', 'Desai', 'Joshi', 'Mehta', 'Iyer', 'Das', 'Bose', 'Chaudhary'];
const cities = ['Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'];
const occupations = ['Software Engineer', 'Teacher', 'Banker', 'Business Analyst', 'Freelancer', 'Accountant', 'Nurse', 'Marketing Executive'];
const educations = ['B.Tech', 'B.Sc', 'M.A', 'MBA', 'B.Com', 'M.Sc', 'Ph.D'];
const statuses: DonorStatus[] = [
  'New Registration', 'Identity Verified', 'Laboratory Tests Pending', 'Doctor Review Pending', 
  'Approved', 'Rejected', 'Cryopreserved', 'Active Inventory', 'Reserved'
];
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const generateDonors = (count: number): DonorDetails[] => {
  return Array.from({ length: count }).map((_, i) => {
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const age = Math.floor(Math.random() * 15) + 21; // 21 to 35
    const regDate = new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0];
    
    return {
      id: `DON-2026-${String(i + 1).padStart(5, '0')}`,
      registrationDate: regDate,
      staffAssigned: 'Priya Sharma',
      branch: cities[Math.floor(Math.random() * cities.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      firstName: fn,
      lastName: ln,
      donorType: ['Rahul', 'Amit', 'Vikram', 'Arjun', 'Ravi', 'Suresh', 'Ramesh', 'Manish'].includes(fn) ? 'Male' : 'Female',
      gender: ['Rahul', 'Amit', 'Vikram', 'Arjun', 'Ravi', 'Suresh', 'Ramesh', 'Manish'].includes(fn) ? 'Male' : 'Female',
      dob: `${2026 - age}-06-15`,
      age,
      nationality: 'Indian',
      religion: 'Hindu',
      occupation: occupations[Math.floor(Math.random() * occupations.length)],
      education: educations[Math.floor(Math.random() * educations.length)],
      languages: 'Hindi, English',
      maritalStatus: Math.random() > 0.5 ? 'Single' : 'Married',
      children: Math.random() > 0.8 ? 'Yes' : 'No',
      aadhaar: `${Math.floor(Math.random() * 9000 + 1000)} ${Math.floor(Math.random() * 9000 + 1000)} ${Math.floor(Math.random() * 9000 + 1000)}`,
      pan: `ABCDE${Math.floor(Math.random() * 9000 + 1000)}F`,
      phone: `+91 9${Math.floor(Math.random() * 900000000 + 100000000)}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@example.com`,
      address: `123, Sample Street, ${cities[Math.floor(Math.random() * cities.length)]}`,
      height: Math.floor(Math.random() * 30) + 150,
      weight: Math.floor(Math.random() * 30) + 50,
      bloodGroup: bloodGroups[Math.floor(Math.random() * bloodGroups.length)],
      skinTone: 'Wheatish',
      eyeColor: 'Brown',
      completionScore: Math.floor(Math.random() * 100)
    };
  });
};

export const mockDonors = generateDonors(100);
