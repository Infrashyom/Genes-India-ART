
import { MapPin } from 'lucide-react';
import { APP_NAME, CONTACT_INFO, MAP_EMBED_URL } from '../../constants';

export function LocationSection() {
  return (
    <section className="py-16 lg:py-20 bg-slate-50 border-t border-slate-200" id="location">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Visit Our Centre</h2>
              <p className="text-slate-500">Accessible location in the heart of the city.</p>
            </div>
          </div>
          <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#53102a] hover:bg-[#3f0c20] text-white px-6 py-3 rounded-xl font-medium transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            Get Directions
          </a>
        </div>

        <div className="w-full max-w-4xl mx-auto h-[400px] bg-slate-200 rounded-3xl border border-slate-200 overflow-hidden relative shadow-inner">
          <iframe 
            src={MAP_EMBED_URL} 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 z-0"
          ></iframe>
          
          <div className="absolute bottom-6 left-6 z-10 bg-white p-6 rounded-2xl shadow-xl max-w-sm border border-slate-100">
            <h3 className="text-xl font-bold text-[#53102a] mb-2">{APP_NAME} Main Lab</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              {CONTACT_INFO.address}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
