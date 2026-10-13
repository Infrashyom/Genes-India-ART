import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcryptjs';
import { User } from './models/User.js';
import { Blog } from './models/Blog.js';
import { Donor } from './models/Donor.js';
import { Inventory } from './models/Inventory.js';
import { SampleRequest } from './models/SampleRequest.js';
import { Lead } from './models/Lead.js';
import { Founder } from './models/Founder.js';
import { Review } from './models/Review.js';
import { Setting } from './models/Setting.js';
import { ContactQuery } from './models/ContactQuery.js';

let mongoServer: MongoMemoryServer;

export async function connectDB() {
  try {
    let mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.warn('⚠️ MONGODB_URI is not defined. Falling back to in-memory MongoDB for development.');
      mongoServer = await MongoMemoryServer.create();
      mongoURI = mongoServer.getUri();
    }
    
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected successfully.');
    
    // Seed initial users if database is empty
    await seedDatabase();

  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
  }
}

async function seedDatabase() {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding initial database...');
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password', salt);
      
      const adminUser = new User({ name: 'Admin User', email: 'demo@admin.genesindia.com', password: hashedPassword, role: 'admin' });
      const staffUser = new User({ name: 'Staff User', email: 'demo@staff.genesindia.com', password: hashedPassword, role: 'staff' });
      const hospitalUser = new User({ name: 'City Hospital', email: 'demo@hospital.genesindia.com', password: hashedPassword, role: 'hospital' });

      await User.insertMany([adminUser, staffUser, hospitalUser]);

      const donor1 = new Donor({
        donorCode: 'DON-O-112',
        donorType: 'Sperm',
        status: 'Active',
        bloodGroup: 'O+',
        age: 24,
        height: 175,
        weight: 70,
        eyeColor: 'Brown',
        hairColor: 'Black',
        complexion: 'Fair',
        education: 'B.Tech',
        profession: 'Software Engineer',
        medicalClearance: true,
        geneticClearance: true
      });
      const donor2 = new Donor({
        donorCode: 'DON-A-098',
        donorType: 'Egg',
        status: 'Pending Review',
        bloodGroup: 'A+',
        age: 26,
        height: 160,
        weight: 55,
        eyeColor: 'Black',
        hairColor: 'Black',
        complexion: 'Medium',
        education: 'MBA',
        profession: 'Marketing',
        medicalClearance: false,
        geneticClearance: false
      });
      
      const donor3 = new Donor({
        donorCode: 'DON-B-205',
        donorType: 'Sperm',
        status: 'Active',
        bloodGroup: 'B-',
        age: 28,
        height: 180,
        weight: 78,
        eyeColor: 'Hazel',
        hairColor: 'Brown',
        complexion: 'Fair',
        skinTone: 'Fair',
        education: 'PhD',
        profession: 'Researcher',
        medicalClearance: true,
        geneticClearance: true
      });

      const donor4 = new Donor({
        donorCode: 'DON-E-314',
        donorType: 'Egg',
        status: 'Active',
        bloodGroup: 'O-',
        age: 25,
        height: 165,
        weight: 58,
        eyeColor: 'Blue',
        hairColor: 'Dark Brown',
        complexion: 'Wheatish',
        skinTone: 'Wheatish',
        education: "Master's in Biotechnology",
        profession: 'Clinical Microbiologist',
        medicalClearance: true,
        geneticClearance: true
      });

      const donor5 = new Donor({
        donorCode: 'DON-S-421',
        donorType: 'Sperm',
        status: 'Active',
        bloodGroup: 'AB+',
        age: 30,
        height: 183,
        weight: 82,
        eyeColor: 'Black',
        hairColor: 'Black',
        complexion: 'Dusky',
        skinTone: 'Dusky',
        education: "Bachelor's Degree",
        profession: 'Financial Analyst',
        medicalClearance: true,
        geneticClearance: true
      });

      const donor6 = new Donor({
        donorCode: 'DON-E-512',
        donorType: 'Egg',
        status: 'Active',
        bloodGroup: 'B+',
        age: 27,
        height: 168,
        weight: 62,
        eyeColor: 'Brown',
        hairColor: 'Black',
        complexion: 'Medium',
        skinTone: 'Medium',
        education: 'Doctorate / MD',
        profession: 'Pharmacist',
        medicalClearance: true,
        geneticClearance: true
      });

      const donor7 = new Donor({
        donorCode: 'DON-S-618',
        donorType: 'Sperm',
        status: 'Active',
        bloodGroup: 'O+',
        age: 26,
        height: 178,
        weight: 74,
        eyeColor: 'Brown',
        hairColor: 'Black',
        complexion: 'Wheatish',
        skinTone: 'Wheatish',
        education: 'Master of Technology (M.Tech)',
        profession: 'Data Architect',
        medicalClearance: true,
        geneticClearance: true
      });

      const donor8 = new Donor({
        donorCode: 'DON-E-720',
        donorType: 'Egg',
        status: 'Active',
        bloodGroup: 'A+',
        age: 25,
        height: 162,
        weight: 54,
        eyeColor: 'Black',
        hairColor: 'Black',
        complexion: 'Fair',
        skinTone: 'Fair',
        education: 'Chartered Accountant (CA)',
        profession: 'Senior Financial Auditor',
        medicalClearance: true,
        geneticClearance: true
      });

      const donor9 = new Donor({
        donorCode: 'DON-S-833',
        donorType: 'Sperm',
        status: 'Active',
        bloodGroup: 'A+',
        age: 29,
        height: 182,
        weight: 79,
        eyeColor: 'Brown',
        hairColor: 'Dark Brown',
        complexion: 'Fair',
        skinTone: 'Fair',
        education: 'Master of Science (M.Sc Biochemistry)',
        profession: 'Biotechnology Consultant',
        medicalClearance: true,
        geneticClearance: true
      });

      const donor10 = new Donor({
        donorCode: 'DON-E-945',
        donorType: 'Egg',
        status: 'Active',
        bloodGroup: 'O+',
        age: 24,
        height: 166,
        weight: 56,
        eyeColor: 'Brown',
        hairColor: 'Black',
        complexion: 'Wheatish',
        skinTone: 'Wheatish',
        education: 'Bachelor of Architecture',
        profession: 'Architectural Designer',
        medicalClearance: true,
        geneticClearance: true
      });

      const donor11 = new Donor({
        donorCode: 'DON-S-955',
        donorType: 'Sperm',
        status: 'Active',
        bloodGroup: 'B+',
        age: 27,
        height: 176,
        weight: 72,
        eyeColor: 'Black',
        hairColor: 'Black',
        complexion: 'Medium',
        skinTone: 'Medium',
        education: 'Master of Business Administration (MBA)',
        profession: 'Investment Banker',
        medicalClearance: true,
        geneticClearance: true
      });

      const donor12 = new Donor({
        donorCode: 'DON-E-962',
        donorType: 'Egg',
        status: 'Active',
        bloodGroup: 'AB-',
        age: 28,
        height: 170,
        weight: 60,
        eyeColor: 'Hazel',
        hairColor: 'Brown',
        complexion: 'Fair',
        skinTone: 'Fair',
        education: 'Doctor of Philosophy (PhD Genetics)',
        profession: 'Genomics Scientist',
        medicalClearance: true,
        geneticClearance: true
      });
      
      await Donor.insertMany([
        donor1, donor2, donor3, donor4, donor5, donor6,
        donor7, donor8, donor9, donor10, donor11, donor12
      ]);

      const vial1 = new Inventory({
        vialId: 'VIAL-2026-001',
        donor: donor1._id,
        tank: 'A1',
        canister: 'C2',
        cane: 'CA1',
        colorCode: 'Blue/White',
        status: 'Available',
        freezeDate: new Date()
      });
      
      const vial2 = new Inventory({
        vialId: 'VIAL-2026-002',
        donor: donor1._id,
        tank: 'A1',
        canister: 'C2',
        cane: 'CA1',
        colorCode: 'Blue/White',
        status: 'Reserved',
        freezeDate: new Date()
      });

      const vial3 = new Inventory({
        vialId: 'VIAL-2026-005',
        donor: donor3._id,
        tank: 'B2',
        canister: 'C4',
        cane: 'CA2',
        colorCode: 'Red/Yellow',
        status: 'Dispatched',
        freezeDate: new Date()
      });

      const vial4 = new Inventory({
        vialId: 'VIAL-2026-006',
        donor: donor3._id,
        tank: 'B2',
        canister: 'C4',
        cane: 'CA2',
        colorCode: 'Red/Yellow',
        status: 'Available',
        freezeDate: new Date()
      });

      const vial5 = new Inventory({
        vialId: 'VIAL-2026-007',
        donor: donor4._id,
        tank: 'CryoTank-01',
        canister: 'C1',
        cane: 'CA3',
        colorCode: 'Green/White',
        status: 'Available',
        freezeDate: new Date()
      });

      const vial6 = new Inventory({
        vialId: 'VIAL-2026-008',
        donor: donor4._id,
        tank: 'CryoTank-01',
        canister: 'C1',
        cane: 'CA3',
        colorCode: 'Green/White',
        status: 'Quarantine',
        freezeDate: new Date()
      });

      const vial7 = new Inventory({
        vialId: 'VIAL-2026-009',
        donor: donor5._id,
        tank: 'A1',
        canister: 'C3',
        cane: 'CA4',
        colorCode: 'Purple/Yellow',
        status: 'Available',
        freezeDate: new Date()
      });

      const vial8 = new Inventory({
        vialId: 'VIAL-2026-010',
        donor: donor6._id,
        tank: 'CryoTank-02',
        canister: 'C5',
        cane: 'CA5',
        colorCode: 'Orange/White',
        status: 'Available',
        freezeDate: new Date()
      });

      await Inventory.insertMany([vial1, vial2, vial3, vial4, vial5, vial6, vial7, vial8]);

      const req1 = new SampleRequest({
        requestId: 'REQ-2026-101',
        hospital: hospitalUser._id,
        doctorName: 'Dr. Smith',
        patientName: 'Jane Doe',
        patientAge: 32,
        donor: donor1._id,
        procedureType: 'IVF',
        quantity: 1,
        status: 'Under Review',
        documents: [
          { name: 'Recipient Aadhaar Card', type: 'PDF', status: 'Pending Review' },
          { name: 'Patient Consent Form', type: 'PDF', status: 'Pending Review' }
        ]
      });

      const req2 = new SampleRequest({
        requestId: 'REQ-2026-102',
        hospital: hospitalUser._id,
        doctorName: 'Dr. Rajiv Singh',
        patientName: 'Kavita Verma',
        patientAge: 28,
        donor: donor3._id,
        procedureType: 'IUI',
        quantity: 2,
        status: 'Documents Requested',
        documents: [
          { name: 'Recipient Aadhaar Card', type: 'PDF', status: 'Approved' },
          { name: 'Patient Consent Form', type: 'PDF', status: 'Rejected' },
          { name: 'Doctor Prescription', type: 'PDF', status: 'Approved' }
        ],
        remarks: 'Please re-upload consent form with patient and spouse signatures.'
      });

      const req3 = new SampleRequest({
        requestId: 'REQ-2026-103',
        hospital: hospitalUser._id,
        doctorName: 'Dr. Neha Mehta',
        patientName: 'Priya Sharma',
        patientAge: 35,
        donor: donor1._id,
        procedureType: 'ICSI',
        quantity: 1,
        status: 'Pending',
        documents: []
      });

      const req4 = new SampleRequest({
        requestId: 'REQ-2026-095',
        hospital: hospitalUser._id,
        doctorName: 'Dr. Amit Patel',
        patientName: 'Anita Desai',
        patientAge: 30,
        donor: donor3._id,
        procedureType: 'IVF',
        quantity: 1,
        status: 'Approved',
        documents: [
          { name: 'Recipient Aadhaar Card', type: 'PDF', status: 'Approved' },
          { name: 'Patient Consent Form', type: 'PDF', status: 'Approved' },
          { name: 'Doctor Prescription', type: 'PDF', status: 'Approved' }
        ],
        shippingDetails: {
          carrier: 'CryoPort Cold Chain Logistics',
          shipperId: 'DS-LN2-412',
          trackingNumber: 'CP-44102-IN',
          tempLog: '-196°C LN2 Vapor Phase',
          currentLocation: 'ART Cryo Vault - Dry Shipper Nitrogen Charging',
          eta: '2 Business Days'
        },
        remarks: 'All documents verified. Ready for dispatch.'
      });

      const req5 = new SampleRequest({
        requestId: 'REQ-2026-090',
        hospital: hospitalUser._id,
        doctorName: 'Dr. Sunita Rao',
        patientName: 'Meera Reddy',
        patientAge: 29,
        donor: donor1._id,
        procedureType: 'IUI',
        quantity: 1,
        status: 'Delivered',
        documents: [
          { name: 'Recipient Aadhaar Card', type: 'JPG', status: 'Approved' },
          { name: 'Patient Consent Form', type: 'PDF', status: 'Approved' }
        ],
        shippingDetails: {
          carrier: 'CryoPort Cold Chain Logistics',
          shipperId: 'DS-LN2-308',
          trackingNumber: 'CP-77120-IN',
          tempLog: '-196°C Validated',
          currentLocation: 'Received & Logged at Hospital IVF Laboratory',
          deliveredAt: new Date(Date.now() - 86400000 * 2)
        },
        clinicalOutcome: {
          cycleStatus: 'Pregnancy Confirmed',
          pregnancyConfirmed: true,
          reportedAt: new Date(Date.now() - 86400000),
          notes: 'Successful single embryo transfer. Beta hCG positive.'
        },
        remarks: 'Delivered via cold chain logistics.'
      });

      const req6 = new SampleRequest({
        requestId: 'REQ-2026-088',
        hospital: hospitalUser._id,
        doctorName: 'Dr. Vikram Malhotra',
        patientName: 'Pooja Hegde',
        patientAge: 31,
        donor: donor5._id,
        procedureType: 'IVF',
        quantity: 2,
        status: 'Dispatched',
        documents: [
          { name: 'Recipient Aadhaar Card', type: 'PDF', status: 'Approved' },
          { name: 'Patient Consent Form', type: 'PDF', status: 'Approved' },
          { name: 'Doctor Prescription', type: 'PDF', status: 'Approved' }
        ],
        shippingDetails: {
          carrier: 'CryoPort Cold Chain Express',
          shipperId: 'DS-LN2-520',
          trackingNumber: 'CP-89214-IN',
          tempLog: '-196°C LN2 Vapor Phase',
          currentLocation: 'In Transit - Out for Final Hospital Delivery',
          eta: 'Today by 16:30 hrs',
          dispatchedAt: new Date(Date.now() - 86400000)
        },
        remarks: 'Cryo dry shipper dispatched with continuous data logger.'
      });

      await SampleRequest.insertMany([req1, req2, req3, req4, req5, req6]);

      
      const lead1 = new Lead({
        hospitalName: 'Apollo Fertility', contactPerson: 'Dr. R. Sharma', email: 'r.sharma@apollo.in', phone: '+91 9876543210', location: 'Mumbai', status: 'New', message: 'Interested in bulk donor samples.'
      });
      const lead2 = new Lead({
        hospitalName: 'Nova IVF', contactPerson: 'Dr. P. Patel', email: 'p.patel@novaivf.in', phone: '+91 8765432109', location: 'Ahmedabad', status: 'In Progress', message: 'Would like to partner for exclusive egg donors.'
      });
      const lead3 = new Lead({
        hospitalName: 'Cloudnine', contactPerson: 'A. Gupta', email: 'admin@cloudnine.in', phone: '+91 7654321098', location: 'Bengaluru', status: 'Onboarded', message: 'Requesting onboarding process details.'
      });
      await Lead.insertMany([lead1, lead2, lead3]);

      const query1 = new ContactQuery({
        name: 'Rahul Desai', email: 'rahul.d@example.com', subject: 'Donor Process Query', message: 'How long does the donor screening take?', status: 'Unread'
      });
      const query2 = new ContactQuery({
        name: 'Simran Kaur', email: 'simran.k@example.com', subject: 'Partnership', message: 'Can we schedule a call to discuss clinic integration?', status: 'Read'
      });
      const query3 = new ContactQuery({
        name: 'Dr. Iyer', email: 'iyer@fertility.com', subject: 'Report Access', message: 'I need access to the latest genetic reports.', status: 'Responded'
      });
      await ContactQuery.insertMany([query1, query2, query3]);
      
            const blogCount = await Blog.countDocuments();
      if (blogCount === 0) {
        const mockBlogs = [
          { title: 'Understanding Male Infertility', content: 'Infertility affects...', author: 'Dr. R. Sharma', status: 'Published', date: '28 Jul 2026', views: 1250 },
          { title: 'The Importance of Genetic Screening', content: 'Genetic screening is...', author: 'Dr. P. Patel', status: 'Published', date: '20 Jul 2026', views: 890 },
          { title: 'How to Support a Partner Through IVF', content: 'IVF can be a...', author: 'A. Gupta', status: 'Draft', date: '-', views: 0 },
        ];
        await Blog.insertMany(mockBlogs);
      }
      
      // Seed Founders
      const founderCount = await Founder.countDocuments();
      if (founderCount === 0) {
        const founder1 = new Founder({
          name: "Mrs. Mrunal Joshi",
          title: "Proprietor",
          qualifications: "MA (Psychology), Diploma in ART counselling",
          experience: "Expert ART Counselor",
          description: "Mrs. Mrunal Joshi is the Proprietor of Genes India. With her profound background in Psychology and a specialized Diploma in ART counseling, she ensures that all donors are carefully selected, counseled, and educated, adhering to the highest ethical and psychological standards in assisted reproduction.",
          displayOrder: 1
        });
        const founder2 = new Founder({
          name: "Dr. Charudutt Joshi",
          title: "Director",
          qualifications: "Ph.D., PGDCE",
          experience: "30+ Years Experience in Assisted Reproduction",
          description: "Dr. Charudutt Joshi is a highly experienced ART professional with over 30 years of expertise in the field of Assisted Reproduction. His extensive scientific knowledge and leadership guarantee that Genes India fulfills all norms of the national ART registry and maintains unparalleled laboratory standards.",
          displayOrder: 2
        });
        await Founder.insertMany([founder1, founder2]);
      }

      // Seed Reviews
      const reviewCount = await Review.countDocuments();
      if (reviewCount === 0) {
        await Review.insertMany([
          { patientName: "Sana Khan", reviewText: "Dr Sonil Srivastava is best gynaecologist for IVF.despite multiple IVF failure s we got success here. She is most talented,lovely and caring and honest doctor. Bhopal is lucky to have doctor like her.", rating: 5 },
          { patientName: "Divyanshu Yadav", reviewText: "She is excellent surgeon. With most advanced equipment and team. She treated me for fibroid. Saved my uterus. If any one is thinking of surgery for fibroid. She is the best surgeon. Excellent staff with homely care. Very small recovery time. Her laparoscopic skills is best in India. Bhopal is really lucky. To have her.", rating: 5 },
          { patientName: "zeba khan", reviewText: "Dr. Sonil mem is best gynnic laparoscopic surgeon..she operate my 10 cm fibroid very easily.. now today i complete 3 month in my surgery ..no pain no scar ..lots of happiness and very thankful to sonali mem and their team", rating: 5 }
        ]);
      }
      
      console.log('✅ Database seeded successfully.');

    }
  } catch (err) {
    console.error('❌ Failed to seed database:', err);
  }
}
