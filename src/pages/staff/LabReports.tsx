import { FlaskConical, Search, Filter, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function LabReports() {
  const navigate = useNavigate();
  const reports = [
    { id: 'LR-9921', donor: 'DON-2026-00045', test: 'Infectious Disease Panel', date: '28 Jul 2026', status: 'Completed', result: 'Normal/Negative' },
    { id: 'LR-9922', donor: 'DON-2026-00045', test: 'Semen Analysis', date: '28 Jul 2026', status: 'Completed', result: 'Normozoospermia' },
    { id: 'LR-9923', donor: 'DON-2026-00088', test: 'Karyotyping', date: '27 Jul 2026', status: 'Pending', result: '--' },
    { id: 'LR-9924', donor: 'DON-2026-00102', test: 'Hormone Profile', date: '26 Jul 2026', status: 'Completed', result: 'Review Required' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        
        <button onClick={() => alert('Opening batch report upload dialog...')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2">
          <FileText className="w-4 h-4" /> Upload Batch Reports
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-200"
      >
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Report ID, Donor ID, Test Name..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Report ID</th>
                <th className="px-6 py-4">Test Name</th>
                <th className="px-6 py-4">Donor ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Result Summary</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div className="flex items-center gap-2">
                      <FlaskConical className="w-4 h-4 text-blue-500" />
                      {report.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">{report.test}</td>
                  <td className="px-6 py-4">
                    <span 
                      onClick={() => navigate(`/staff/donors/${report.donor}`)}
                      className="text-blue-600 hover:underline cursor-pointer font-medium"
                    >
                      {report.donor}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{report.date}</td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${report.result === 'Review Required' ? 'text-amber-600' : 'text-slate-700'}`}>
                      {report.result}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium w-fit ${
                      report.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {report.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button onClick={() => alert('Opening PDF viewer...')} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                      View PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
