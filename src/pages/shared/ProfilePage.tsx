import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, KeyRound, ShieldCheck, Mail, Phone, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../lib/api';

export default function ProfilePage() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/change-password', { currentPassword, newPassword });
      setSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-6">
      <div className="flex items-center mb-4">
        <div className="w-1.5 h-7 bg-blue-500 rounded-full mr-3"></div>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* User Info Card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs text-center">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <h2 className="text-lg font-bold text-slate-900">{user?.name}</h2>
            <p className="text-slate-500 font-medium text-xs mt-0.5 mb-4 capitalize">{user?.role} Portal User</p>
            
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Email Address</div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-800 break-all leading-snug mt-0.5 select-all" title={user?.email}>
                    {user?.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Access Level</div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-800 capitalize mt-0.5">{user?.role}</div>
                </div>
              </div>

              {user?.phone && (
                <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Phone Number</div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-800 break-all mt-0.5">{user?.phone}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Change Password</h3>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="font-medium text-sm">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="font-medium text-sm">{success}</p>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Current Password</label>
                <input 
                  type="password" 
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">New Password</label>
                  <input 
                    type="password" 
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Confirm New Password</label>
                  <input 
                    type="password" 
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all flex items-center justify-center min-w-[180px] disabled:opacity-70 disabled:pointer-events-none"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
