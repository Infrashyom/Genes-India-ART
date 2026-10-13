import React, { useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import api from '../../../lib/api';
import { DonorData } from '../types';

interface PersonalDetailsTabProps {
  donor: DonorData;
  onSaveSuccess: (updatedDonor: DonorData, nextTabId?: string) => void;
}

export default function PersonalDetailsTab({ donor, onSaveSuccess }: PersonalDetailsTabProps) {
  const [photoUrl, setPhotoUrl] = useState(donor.photoUrl || '');
  const [firstName, setFirstName] = useState(donor.firstName || '');
  const [lastName, setLastName] = useState(donor.lastName || '');
  const [dob, setDob] = useState(donor.dob || '');
  const [gender, setGender] = useState(
    donor.gender || (donor.donorType === 'Egg' || donor.donorType === 'Female' ? 'Female' : 'Male')
  );
  const [occupation, setOccupation] = useState(donor.occupation || 'Employed (Private Sector)');
  const [education, setEducation] = useState(donor.education || "Graduate / Bachelor's Degree");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);

  const calculateAge = (dobString: string): number => {
    if (!dobString) return donor.age || 25;
    const birthYear = new Date(dobString).getFullYear();
    const currentYear = new Date().getFullYear();
    return Math.max(18, currentYear - birthYear);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Photo size must be less than 5MB');
      return;
    }

    setUploadingPhoto(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Lazy API call for image upload only when file selected
      const res = await api.post('/upload', formData);
      setPhotoUrl(res.data.secure_url);
    } catch (err) {
      alert('Photo upload failed. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const age = calculateAge(dob);
      const updatedCompletedTabs = Array.from(
        new Set([...(donor.completedTabs || []), 'personal-details', '2'])
      );

      const payload = {
        ...donor,
        photoUrl,
        firstName,
        lastName,
        dob,
        age,
        gender,
        occupation,
        profession: occupation,
        education,
        completedTabs: updatedCompletedTabs,
      };

      const donorDbId = donor._id || donor.id;
      const res = await api.put(`/donors/${donorDbId}`, payload);

      const updated: DonorData = {
        ...donor,
        ...payload,
        _id: res.data._id || donorDbId,
        completedTabs: updatedCompletedTabs,
      };

      onSaveSuccess(updated, 'identity-docs');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to save personal details.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center mb-6">
        <div className="w-1.5 h-6 bg-blue-500 rounded-full mr-3"></div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Personal Details</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Donor identification photograph, personal profile, and educational status.
          </p>
        </div>
      </div>

      {/* Passport Photograph Section */}
      <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Photo Preview Box (3.5 x 4.5 cm) */}
          <div className="w-28 h-36 rounded-xl border-2 border-dashed border-slate-300 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-sm relative group">
            {photoUrl ? (
              <>
                <img src={photoUrl} alt="Donor Passport" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotoUrl('')}
                  className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold shadow-md cursor-pointer"
                  title="Remove photo"
                >
                  ✕
                </button>
              </>
            ) : (
              <div className="text-center p-2 text-slate-400">
                <Camera className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                <span className="text-[11px] font-medium leading-tight block text-slate-500">
                  Passport Photo
                </span>
                <span className="text-[10px] text-slate-400">3.5 × 4.5 cm</span>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              Passport Size Photograph
              <span className="text-xs font-normal text-slate-500">
                (Front facing, neutral background)
              </span>
            </h4>
            <div className="relative inline-block">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                disabled={uploadingPhoto}
                onChange={handlePhotoUpload}
              />
              <button
                type="button"
                disabled={uploadingPhoto}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
              >
                {uploadingPhoto ? (
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Upload className="w-4 h-4 text-blue-600" />
                )}
                {photoUrl ? 'Change Passport Photo' : 'Upload Passport Photo'}
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Supports JPG, PNG, WebP up to 5MB. Photo will be displayed on the clinical record.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center">
            First Name <span className="text-red-500 ml-1 text-lg leading-none">*</span>
          </label>
          <input
            required
            type="text"
            placeholder="e.g. Rahul"
            className="w-full border border-slate-300 rounded-xl p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center">
            Last Name <span className="text-red-500 ml-1 text-lg leading-none">*</span>
          </label>
          <input
            required
            type="text"
            placeholder="e.g. Sharma"
            className="w-full border border-slate-300 rounded-xl p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center">
            Date of Birth <span className="text-red-500 ml-1 text-lg leading-none">*</span>
          </label>
          <input
            required
            type="date"
            className="w-full border border-slate-300 rounded-xl p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center">
            Gender <span className="text-red-500 ml-1 text-lg leading-none">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm appearance-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                backgroundPosition: 'right 1rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.25em 1.25em',
              }}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Occupation Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center">
            Occupation <span className="text-red-500 ml-1 text-lg leading-none">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm appearance-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                backgroundPosition: 'right 1rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.25em 1.25em',
              }}
            >
              <option value="">Select Occupation...</option>
              <option value="Employed (Private Sector)">Employed (Private Sector)</option>
              <option value="Employed (Public Sector)">Employed (Public Sector)</option>
              <option value="Government Service">Government Service</option>
              <option value="Self Employed / Business">Self Employed / Business</option>
              <option value="Professional (Doctor / Engineer / Lawyer / CA)">
                Professional (Doctor / Engineer / Lawyer / CA)
              </option>
              <option value="Healthcare / Medical Field">Healthcare / Medical Field</option>
              <option value="IT & Software Services">IT & Software Services</option>
              <option value="Education / Academic">Education / Academic</option>
              <option value="Defense / Police / Security">Defense / Police / Security</option>
              <option value="Student">Student</option>
              <option value="Homemaker">Homemaker</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Education Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center">
            Education Qualification <span className="text-red-500 ml-1 text-lg leading-none">*</span>
          </label>
          <div className="relative">
            <select
              required
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm appearance-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                backgroundPosition: 'right 1rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.25em 1.25em',
              }}
            >
              <option value="">Select Education...</option>
              <option value="Secondary / 10th Standard">Secondary / 10th Standard</option>
              <option value="Higher Secondary / 12th Standard">
                Higher Secondary / 12th Standard
              </option>
              <option value="Diploma / Polytechnic / Vocational">
                Diploma / Polytechnic / Vocational
              </option>
              <option value="Graduate / Bachelor's Degree">Graduate / Bachelor's Degree</option>
              <option value="Post Graduate / Master's Degree">
                Post Graduate / Master's Degree
              </option>
              <option value="Professional Degree (MBBS, MD, LLB, CA)">
                Professional Degree (MBBS, MD, LLB, CA)
              </option>
              <option value="Doctorate / Ph.D.">Doctorate / Ph.D.</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pt-8 mt-6 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all flex items-center justify-center min-w-[160px] disabled:opacity-70 cursor-pointer"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            'Save & Next'
          )}
        </button>
      </div>
    </form>
  );
}
