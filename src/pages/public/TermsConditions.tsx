import { APP_NAME, CONTACT_INFO } from '../../constants';

export default function TermsConditions() {
  return (
    <div className="w-full bg-white py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Terms and Conditions</h1>
        
        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
          <p>
            These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and {APP_NAME} ("we," "us" or "our"), concerning your access to and use of our website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.
          </p>
          
          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">1. Agreement to Terms</h2>
          <p>
            By accessing the website, you agree that you have read, understood, and agree to be bound by all of these Terms and Conditions. If you do not agree with all of these Terms and Conditions, then you are expressly prohibited from using the site and you must discontinue use immediately.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">2. Medical Disclaimer</h2>
          <p>
            The information provided on the Site is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation. All medical and clinical procedures described are strictly B2B and subject to relevant health regulations and compliance protocols.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">3. User Representations</h2>
          <p>
            By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Terms and Conditions.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">4. Contact Information</h2>
          <p>
            In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
          </p>
          <p className="font-medium text-slate-900">
            {APP_NAME}<br />
            {CONTACT_INFO.address}<br />
            {CONTACT_INFO.phone}<br />
            {CONTACT_INFO.email}
          </p>
        </div>
      </div>
    </div>
  );
}
