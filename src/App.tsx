import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout, DashboardLayout } from './layouts';

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[55vh] p-8 text-slate-400 gap-3 animate-in fade-in duration-150">
      <div className="w-9 h-9 border-3 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Loading tab...</span>
    </div>
  );
}

// Lazy Loaded Public Pages
const PublicHome = lazy(() => import('./pages/public/PublicHome'));
const About = lazy(() => import('./pages/public/About'));
const Founder = lazy(() => import('./pages/public/Founder'));
const Services = lazy(() => import('./pages/public/Services'));
const MaleFertility = lazy(() => import('./pages/public/MaleFertility'));
const DonorEligibility = lazy(() => import('./pages/public/DonorEligibility'));
const MaleDonorEligibility = lazy(() => import('./pages/public/MaleDonorEligibility'));
const FemaleDonorEligibility = lazy(() => import('./pages/public/FemaleDonorEligibility'));
const HospitalPartnership = lazy(() => import('./pages/public/HospitalPartnership'));
const Blogs = lazy(() => import('./pages/public/Blogs'));
const BlogDetail = lazy(() => import('./pages/public/BlogDetail'));
const Contact = lazy(() => import('./pages/public/Contact'));
const FaqsPage = lazy(() => import('./pages/public/FaqsPage'));
const PrivacyPolicy = lazy(() => import('./pages/public/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/public/TermsConditions'));
const Login = lazy(() => import('./pages/public/Login'));
const GalleryPage = lazy(() => import('./pages/shared/GalleryPage'));

// Lazy Loaded Shared / User Pages
const ProfilePage = lazy(() => import('./pages/shared/ProfilePage'));

// Lazy Loaded Admin Portal Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const LeadsList = lazy(() => import('./pages/admin/LeadsList'));
const InventoryList = lazy(() => import('./pages/admin/InventoryList'));
const SampleRequestsAdmin = lazy(() => import('./pages/admin/SampleRequestsAdmin'));
const ContactQueries = lazy(() => import('./pages/admin/ContactQueries'));
const BlogManagement = lazy(() => import('./pages/admin/BlogManagement'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const Settings = lazy(() => import('./pages/admin/Settings'));
const ReviewsManagement = lazy(() => import('./pages/admin/ReviewsManagement'));

// Lazy Loaded Staff Portal Pages
const DonorList = lazy(() => import('./pages/staff/DonorList'));
const DonorProfile = lazy(() => import('./pages/staff/DonorProfile'));

// Lazy Loaded Hospital Portal Pages
const HospitalDashboard = lazy(() => import('./pages/hospital/HospitalDashboard'));
const HospitalSearch = lazy(() => import('./pages/hospital/HospitalSearch'));
const HospitalSampleRequests = lazy(() => import('./pages/hospital/HospitalSampleRequests'));
const HospitalNewRequest = lazy(() => import('./pages/hospital/HospitalNewRequest'));
const HospitalReservations = lazy(() => import('./pages/hospital/HospitalReservations'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<PublicHome />} />
            <Route path="about" element={<About />} />
            <Route path="founder" element={<Founder />} />
            <Route path="services" element={<Services />} />
            <Route path="male-fertility" element={<MaleFertility />} />
            <Route path="donor-eligibility" element={<DonorEligibility />} />
            <Route path="gallery" element={<GalleryPage isPublic={true} />} />
            <Route path="male-donor-eligibility" element={<MaleDonorEligibility />} />
            <Route path="female-donor-eligibility" element={<FemaleDonorEligibility />} />
            <Route path="hospital-partnership" element={<HospitalPartnership />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="blogs/:id" element={<BlogDetail />} />          
            <Route path="contact" element={<Contact />} />
            <Route path="faqs" element={<FaqsPage />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms-conditions" element={<TermsConditions />} />
          </Route>
          
          <Route path="/login" element={<Login />} />
          
          {/* Admin Portal */}
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="leads" element={<LeadsList />} />
            <Route path="contacts" element={<ContactQueries />} />
            <Route path="reviews" element={<ReviewsManagement />} />
            <Route path="blogs" element={<BlogManagement />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="inventory" element={<InventoryList />} />
            <Route path="donors/:id" element={<DonorProfile />} />
            <Route path="requests" element={<SampleRequestsAdmin />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<div className="p-8 text-slate-500">Page under construction in demo</div>} />
          </Route>

          {/* Staff Portal */}
          <Route path="/staff" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/staff/donors" replace />} />
            <Route path="donors" element={<DonorList />} />
            <Route path="donors/:id" element={<DonorProfile />} />
            <Route path="inventory" element={<InventoryList />} />
            <Route path="requests" element={<SampleRequestsAdmin />} />
            <Route path="leads" element={<LeadsList />} />
            <Route path="contacts" element={<ContactQueries />} />
            <Route path="reviews" element={<ReviewsManagement />} />
            <Route path="blogs" element={<BlogManagement />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<div className="p-8 text-slate-500">Page under construction in demo</div>} />
          </Route>

          {/* Hospital Partner Portal */}
          <Route path="/hospital" element={<DashboardLayout />}>
            <Route index element={<HospitalDashboard />} />
            <Route path="search" element={<HospitalSearch />} />
            <Route path="requests" element={<HospitalSampleRequests />} />
            <Route path="requests/new/:donorId" element={<HospitalNewRequest />} />
            <Route path="reservations" element={<HospitalReservations />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<div className="p-8 text-slate-500">Page under construction in demo</div>} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
