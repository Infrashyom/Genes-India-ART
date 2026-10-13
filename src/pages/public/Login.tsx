import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../../context/BrandContext';
import api from '../../lib/api';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [role, setRole] = useState<'admin' | 'staff' | 'hospital'>('admin');
  const [email, setEmail] = useState(`demo@admin.genesindia.com`);
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (selectedRole: 'admin' | 'staff' | 'hospital') => {
    setRole(selectedRole);
    setEmail(`demo@${selectedRole}.genesindia.com`);
    setPassword('password');
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      
      const { token, user } = response.data;
      login(token, user);

      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'staff') navigate('/staff/donors');
      else if (user.role === 'hospital') navigate('/hospital');
      else navigate('/');
      
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <Link 
        to="/" 
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Portal
      </Link>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center mt-12 md:mt-0">
        <BrandLogo variant="dark" size="lg" className="justify-center mb-3" />
        <h2 className="text-center text-xl font-bold text-slate-900 tracking-tight">
          Portal Management Access
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          Secure access for authorized personnel and partner clinics.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Quick Roles (Demo)
              </label>
              <div className="mt-2 grid grid-cols-3 gap-3">
                {(['admin', 'staff', 'hospital'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRoleSelect(r)}
                    className={`py-2 px-3 flex items-center justify-center text-sm font-medium rounded-lg border transition-all ${
                      role === r 
                        ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' 
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign in to Dashboard'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">
                  Protected by 2FA & Biometrics
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
