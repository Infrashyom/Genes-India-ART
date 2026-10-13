import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Building2, TestTube, ArrowUpRight, CheckCircle2, Loader2 } from 'lucide-react';
import api from '../../lib/api';

interface AnalyticsData {
  activeHospitals: number;
  verifiedDonors: number;
  sampleRequests: number;
  chartData: any[];
  aiMatchPipeline: { stage: string; count: number; percentage: number }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/analytics/admin-overview');
        setData(response.data);
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const stats = [
    { label: 'Active Hospitals', value: data.activeHospitals.toString(), icon: Building2, trend: '+12%' },
    { label: 'Verified Donors', value: data.verifiedDonors.toString(), icon: Users, trend: '+5.4%' },
    { label: 'Samples Requested', value: data.sampleRequests.toString(), icon: TestTube, trend: '+22%' },
  ];

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
              <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                {stat.trend}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Row */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Request Volume Overview</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                <Tooltip cursor={{fill: '#F1F5F9'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="requests" name="Sample Requests" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="matches" name="Successful Matches" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Match Pipeline */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-6">AI Match Pipeline</h3>
          <div className="space-y-6 flex-1">
            {data.aiMatchPipeline.map((item, i) => (
              <div key={i} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                    <span className="text-slate-600 font-medium">{item.stage}</span>
                  </div>
                  <span className="text-slate-900 font-bold">{item.count}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-blue-50 rounded-xl p-4 border border-blue-100">
            <h4 className="text-sm font-semibold text-blue-900 mb-1">Most Requested Trait</h4>
            <p className="text-2xl font-bold text-blue-700">Blood Group O+</p>
            <p className="text-xs text-blue-600 mt-2">Appeared in 42% of hospital searches this week.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
