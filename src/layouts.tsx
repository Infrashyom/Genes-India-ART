import React, { useState, useEffect, Suspense } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { BrandLogo } from './context/BrandContext';

function LayoutOutletLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] p-8 text-slate-400 gap-2.5 animate-in fade-in duration-100">
      <div className="w-8 h-8 border-2 border-blue-600/25 border-t-blue-600 rounded-full animate-spin" />
      <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">Loading tab...</span>
    </div>
  );
}
import { 
  Building2, 
  Menu, 
  X, 
  LayoutDashboard,
  MapPin, 
  Users, 
  Stethoscope, 
  TestTube, 
  Settings, 
  LogOut,
  ChevronRight,
  Search,
  MessageSquare,
  FileText,
  Star,
  Truck
} from 'lucide-react';
import { cn } from './lib/utils';
import { APP_NAME, APP_TAGLINE, APP_DESCRIPTION, CONTACT_INFO, SOCIAL_LINKS } from './constants';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Image as ImageIcon } from 'lucide-react';

import api from './lib/api';

export function PublicLayout() {
  const [socialLinks, setSocialLinks] = useState(SOCIAL_LINKS);
  
  useEffect(() => {
    api.get('/settings').then(res => {
      if (res.data) {
        setSocialLinks({
          facebook: res.data.facebookUrl || SOCIAL_LINKS.facebook,
          twitter: res.data.twitterUrl || SOCIAL_LINKS.twitter,
          instagram: res.data.instagramUrl || SOCIAL_LINKS.instagram,
          linkedin: res.data.linkedinUrl || SOCIAL_LINKS.linkedin,
        });
      }
    }).catch(console.error);
  }, []);

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Founder', href: '/founder' },
    { name: 'Services', href: '/services' },
    { name: 'Male Fertility', href: '/male-fertility' },
    { name: 'Donor Eligibility', href: '/donor-eligibility' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header 
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300 border-b",
          isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-slate-200 py-3" : "bg-white border-transparent py-5"
        )}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <BrandLogo variant="dark" size="md" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.href} className={cn("text-sm font-medium hover:text-blue-600 transition-colors", location.pathname === link.href ? "text-blue-600 font-bold" : "text-slate-600")}>
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden xl:flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600">
              Management System
            </Link>
            <Link to="/hospital-partnership" className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors">
              Partner With Us
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="xl:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="xl:hidden absolute top-full left-0 w-full max-h-[80vh] overflow-y-auto bg-white border-b border-slate-200 shadow-lg py-4 px-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.href} className={cn("text-base font-medium", location.pathname === link.href ? "text-blue-600 font-bold" : "text-slate-600")} onClick={() => setMobileMenuOpen(false)}>
                {link.name}
              </Link>
            ))}
            <hr />
            <Link to="/login" className="text-base font-medium text-slate-900" onClick={() => setMobileMenuOpen(false)}>Management System</Link>
          </div>
        )}
      </header>
      
      <main className="pt-[72px]">
        <Suspense fallback={<LayoutOutletLoader />}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand & Description */}
          <div>
            <div className="mb-6">
              <BrandLogo variant="light" size="md" />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              {APP_DESCRIPTION}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-blue-400 transition-colors">Services</Link></li>
              <li><Link to="/hospital-partnership" className="hover:text-blue-400 transition-colors">Hospital Partnership</Link></li>
              <li><Link to="/blogs" className="hover:text-blue-400 transition-colors">Blogs</Link></li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div>
            <h4 className="text-white font-semibold mb-6">Contact & Social</h4>
            <ul className="space-y-4 text-sm text-slate-400 mb-8">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 shrink-0 text-blue-500" />
                <span>{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                <span className="text-white font-medium">{CONTACT_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <a href={"mailto:" + CONTACT_INFO.email} className="hover:text-blue-400 transition-colors">{CONTACT_INFO.email}</a>
              </li>
            </ul>
            
            <div className="flex gap-4">
              <a href={socialLinks.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-pink-600 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-700 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
          <div>
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms-conditions" className="hover:text-slate-300 transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a 
        href={`https://wa.me/${CONTACT_INFO.phone.replace(/[^0-9]/g, '')}`}
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50 hover:shadow-xl"
        aria-label="Chat on WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
      </a>
    </div>
  );
}

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const getRole = () => {
    if (location.pathname.startsWith('/admin')) return 'Super Admin';
    if (location.pathname.startsWith('/staff')) return 'Internal Staff';
    if (location.pathname.startsWith('/hospital')) return 'Hospital Partner';
    return 'User';
  };

  const navItems = getRole() === 'Super Admin' ? [
    { name: 'Analytics Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Sample Requests', href: '/admin/requests', icon: TestTube },
    { name: 'Donor Inventory', href: '/admin/inventory', icon: Users },
    { name: 'Partnership Requests', href: '/admin/leads', icon: Building2 },
    { name: 'Contact Responses', href: '/admin/contacts', icon: MessageSquare },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Blog Management', href: '/admin/blogs', icon: FileText },
    { name: 'Gallery Management', href: '/admin/gallery', icon: ImageIcon },
    { name: 'Reviews Management', href: '/admin/reviews', icon: Star },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
    { name: 'My Profile', href: '/admin/profile', icon: Users },
  ] : getRole() === 'Hospital Partner' ? [
    { name: 'Dashboard', href: '/hospital', icon: LayoutDashboard },
    { name: 'Donor Search', href: '/hospital/search', icon: Search },
    { name: 'Sample Requests', href: '/hospital/requests', icon: TestTube },
    { name: 'Reservations', href: '/hospital/reservations', icon: Truck },
    { name: 'My Profile', href: '/hospital/profile', icon: Users },
  ] : [
    { name: 'Donor Records (EDR)', href: '/staff/donors', icon: Users },
    { name: 'Donor Inventory', href: '/staff/inventory', icon: Users },
    { name: 'Sample Requests', href: '/staff/requests', icon: TestTube },
    { name: 'Partnership Requests', href: '/staff/leads', icon: Building2 },
    { name: 'Contact Responses', href: '/staff/contacts', icon: MessageSquare },
    { name: 'Reviews Management', href: '/staff/reviews', icon: Star },
    { name: 'Blog Management', href: '/staff/blogs', icon: FileText },
    { name: 'Gallery Management', href: '/staff/gallery', icon: ImageIcon },
    { name: 'My Profile', href: '/staff/profile', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
            {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      <aside className={`w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-30 transition-transform duration-300 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 sm:p-5 flex items-center justify-between text-white border-b border-slate-800">
          <BrandLogo variant="light" size="sm" />
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setMobileSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive ? "bg-blue-600 text-white" : "hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 shrink-0">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout to Website
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen overflow-x-hidden">
        <div className="lg:hidden p-3.5 px-4 flex items-center justify-between border-b border-slate-200 bg-white">
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer" onClick={() => setMobileSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <BrandLogo variant="dark" size="sm" />
          <div className="w-8" />
        </div>
        
        <div className="flex-1 p-4 sm:p-5 lg:p-6">
          <Suspense fallback={<LayoutOutletLoader />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
