import { APP_NAME, CONTACT_INFO } from '../../constants';

export default function PrivacyPolicy() {
  return (
    <div className="w-full bg-white py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
          <p>
            At {APP_NAME}, we take your privacy very seriously. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
          </p>
          
          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">1. Information We Collect</h2>
          <p>
            We may collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, or otherwise contact us.
            The personal information that we collect depends on the context of your interactions with us and the website, the choices you make and the products and features you use.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">2. How We Use Your Information</h2>
          <p>
            We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To facilitate account creation and logon process.</li>
            <li>To send you marketing and promotional communications.</li>
            <li>To fulfill and manage your orders and requests.</li>
            <li>To protect our Services and ensure compliance.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">3. Data Security</h2>
          <p>
            We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">4. Contact Us</h2>
          <p>
            If you have questions or comments about this notice, you may email us at {CONTACT_INFO.email} or by post to:
          </p>
          <p className="font-medium text-slate-900">
            {APP_NAME}<br />
            {CONTACT_INFO.address}
          </p>
        </div>
      </div>
    </div>
  );
}
