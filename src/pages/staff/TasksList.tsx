import { CheckSquare, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function TasksList() {
  const navigate = useNavigate();
  const tasks = [
    { id: 1, title: 'Verify Identity Documents', donor: 'DON-2026-00120', type: 'Verification', priority: 'High', due: 'Today', status: 'Pending' },
    { id: 2, title: 'Upload Genetic Screening PDF', donor: 'DON-2026-00085', type: 'Lab Results', priority: 'Medium', due: 'Tomorrow', status: 'Pending' },
    { id: 3, title: 'Schedule Psychologist Assessment', donor: 'DON-2026-00142', type: 'Scheduling', priority: 'Low', due: 'Next Week', status: 'Pending' },
    { id: 4, title: 'Process Cryo Vials (6)', donor: 'DON-2026-00099', type: 'Laboratory', priority: 'High', due: 'Today', status: 'In Progress' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {['High Priority', 'Due Today', 'Completed (This Week)'].map((label, i) => (
           <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${i === 0 ? 'bg-red-50 text-red-600' : i === 1 ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
                {i === 0 ? <AlertCircle className="w-6 h-6" /> : i === 1 ? <Clock className="w-6 h-6" /> : <CheckSquare className="w-6 h-6" />}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <h3 className="text-2xl font-bold text-slate-900">{[2, 5, 14][i]}</h3>
              </div>
           </div>
         ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
      >
        <div className="p-4 border-b border-slate-200 bg-slate-50 font-semibold text-slate-700">
          Pending Tasks
        </div>
        <ul className="divide-y divide-slate-100">
          {tasks.map(task => (
            <li key={task.id} className="p-4 hover:bg-slate-50 flex items-start justify-between group">
              <div className="flex items-start gap-4">
                <button onClick={() => alert('Task marked as complete.')} className="mt-1 w-5 h-5 rounded border-2 border-slate-300 text-transparent hover:border-blue-500 hover:text-blue-500 flex items-center justify-center transition-colors">
                  <CheckSquare className="w-4 h-4" />
                </button>
                <div>
                  <h4 className="font-medium text-slate-900">{task.title}</h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                    <span className="font-medium text-blue-600 cursor-pointer hover:underline" onClick={() => navigate(`/staff/donors/${task.donor}`)}>{task.donor}</span>
                    <span>•</span>
                    <span>{task.type}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Due: {task.due}
                    </span>
                  </div>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                task.priority === 'High' ? 'bg-red-100 text-red-700' : 
                task.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
              }`}>
                {task.priority} Priority
              </span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
