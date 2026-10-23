import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Building2, TestTube, Loader2, Calendar, Award, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import api from '../../lib/api';

interface AnalyticsData {
  activeHospitals: number;
  verifiedDonors: number;
  sampleRequests: number;
  selectedYear: number;
  availableYears: number[];
  chartData: { name: string; requests: number; matches: number }[];
  mostRequestedTrait: {
    trait: string;
    stat: string;
    description: string;
  };
}

export default function AdminDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const fetchAnalytics = async (year: number) => {
    try {
      setLoading(true);
      const response = await api.get(`/analytics/admin-overview?year=${year}`);
      setData(response.data);
      if (response.data.selectedYear) {
        setSelectedYear(response.data.selectedYear);
      }
    } catch (err) {
      console.error("Failed to load analytics", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(selectedYear);
  }, [selectedYear]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const stats = [
    { label: 'Active Hospitals', value: data?.activeHospitals.toString() || '0', icon: Building2 },
    { label: 'Verified Donors', value: data?.verifiedDonors.toString() || '0', icon: Users },
    { label: 'Samples Requested', value: data?.sampleRequests.toString() || '0', icon: TestTube },
  ];

  const totalYearRequests = data?.chartData?.reduce((acc, curr) => acc + curr.requests, 0) || 0;
  const totalYearMatches = data?.chartData?.reduce((acc, curr) => acc + curr.matches, 0) || 0;

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="flex items-center text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                Live Data
              </span>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Full Year Request Volume Overview with Year Filter */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Request Volume Overview</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Full 12-month annual cycle requisition and fulfillment volume
              </p>
            </div>

            {/* Year Filter Dropdown */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold text-slate-600">Year:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-transparent text-xs font-bold text-blue-600 focus:outline-none cursor-pointer pr-1"
              >
                {data?.availableYears && data.availableYears.length > 0 ? (
                  data.availableYears.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))
                ) : (
                  <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                )}
              </select>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.chartData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#F1F5F9' }} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Bar dataKey="requests" name="Sample Requests" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="matches" name="Approved / Fulfilled" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-blue-600 inline-block" /> Requisitions ({totalYearRequests})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" /> Fulfilled Allocations ({totalYearMatches})
              </span>
            </div>
            <span className="font-medium text-slate-400">Jan – Dec {selectedYear}</span>
          </div>
        </div>

        {/* Most Requested Trait Card (AI Match Pipeline section removed) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Clinical Demand</span>
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-2">Most Requested Trait</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Real-time donor phenotype preference analysis across hospital partner inquiries and cycle requisitions.
            </p>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white rounded-2xl p-6 border border-blue-100/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-800">Top Phenotype</span>
              </div>
              <h4 className="text-2xl font-black text-blue-900 tracking-tight">
                {data?.mostRequestedTrait?.trait || 'Blood Group O+'}
              </h4>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold shadow-xs">
                <TrendingUp className="w-3.5 h-3.5" />
                {data?.mostRequestedTrait?.stat || 'High Hospital Demand'}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                {data?.mostRequestedTrait?.description || 'Frequently requested donor phenotype for hospital allocations.'}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Requisitions in {selectedYear}:</span>
              <span className="font-bold text-slate-800">{totalYearRequests} Cycles</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Allocation Rate:</span>
              <span className="font-bold text-emerald-600">
                {totalYearRequests > 0 ? Math.round((totalYearMatches / totalYearRequests) * 100) : 100}%
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Registry Donors:</span>
              <span className="font-bold text-slate-800">{data?.verifiedDonors || 0} Screened</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
