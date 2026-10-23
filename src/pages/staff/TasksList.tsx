import { useState, useEffect } from 'react';
import { CheckSquare, Clock, AlertCircle, Plus, Loader2, X, Check, Calendar, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

export default function TasksList() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    type: 'General',
    priority: 'Medium',
    dueDate: '',
    description: ''
  });
  const [creating, setCreating] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tasks');
      setTasks(res.data || []);
    } catch (err) {
      console.error('Failed to load tasks', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggleComplete = async (task: any) => {
    const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      await api.patch(`/tasks/${task._id}/status`, { status: nextStatus });
      setTasks(prev => prev.map(t => t._id === task._id ? { ...t, status: nextStatus } : t));
    } catch (err) {
      console.error('Failed to update task status', err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    setCreating(true);
    try {
      await api.post('/tasks', newTask);
      setShowAddModal(false);
      setNewTask({ title: '', type: 'General', priority: 'Medium', dueDate: '', description: '' });
      fetchTasks();
    } catch (err) {
      console.error('Failed to create task', err);
      alert('Failed to create task');
    } finally {
      setCreating(false);
    }
  };

  const highPriorityCount = tasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length;
  const pendingCount = tasks.filter(t => t.status !== 'Completed').length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Staff Operational Tasks</h1>
          <p className="text-sm text-slate-500 mt-1">Manage clinical checklists, donor reviews, and laboratory verifications.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-sm shadow-blue-600/20 text-sm cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" /> Add New Task
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">High Priority</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{highPriorityCount}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Action</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{pendingCount}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{completedCount}</h3>
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden"
      >
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 font-semibold text-slate-800 text-sm flex items-center justify-between">
          <span>Action Checklist</span>
          <span className="text-xs font-normal text-slate-500">{tasks.length} total tasks recorded</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
            <p className="text-sm">Loading tasks from database...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <CheckSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="font-semibold text-slate-800">No Operational Tasks</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              You are all caught up! Create a new checklist item to schedule donor screenings or laboratory steps.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create first task
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {tasks.map(task => {
              const isCompleted = task.status === 'Completed';
              return (
                <li key={task._id} className="p-4 hover:bg-slate-50 flex items-start justify-between group transition-colors">
                  <div className="flex items-start gap-3.5">
                    <button 
                      onClick={() => handleToggleComplete(task)} 
                      className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                        isCompleted 
                          ? 'bg-emerald-600 border-emerald-600 text-white' 
                          : 'border-slate-300 text-transparent hover:border-blue-500'
                      }`}
                      title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                    <div>
                      <h4 className={`font-semibold text-sm ${isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-xs text-slate-500 mt-0.5">{task.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-2.5 mt-1.5 text-xs text-slate-500">
                        {task.relatedDonor?.donorCode && (
                          <>
                            <span 
                              className="font-mono font-medium text-blue-600 hover:underline cursor-pointer" 
                              onClick={() => navigate(`/staff/donor/${task.relatedDonor._id}`)}
                            >
                              {task.relatedDonor.donorCode}
                            </span>
                            <span>•</span>
                          </>
                        )}
                        <span className="font-medium text-slate-600">{task.type || 'General'}</span>
                        {task.dueDate && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-slate-600">
                              <Calendar className="w-3 h-3 text-slate-400" /> 
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                      task.priority === 'High' 
                        ? 'bg-rose-50 text-rose-700 border-rose-200' 
                        : task.priority === 'Medium'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                      {task.priority}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </motion.div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-5"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">Create Operational Task</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Task Title <span className="text-rose-500">*</span></label>
                  <input 
                    required
                    type="text"
                    placeholder="e.g., Review infectious disease screening results"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Task Type</label>
                    <select
                      value={newTask.type}
                      onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
                      className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="General">General</option>
                      <option value="Document Review">Document Review</option>
                      <option value="Lab Results">Lab Results</option>
                      <option value="Approval">Approval</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Priority</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Due Date</label>
                  <input 
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Description / Clinical Notes</label>
                  <textarea 
                    rows={3}
                    placeholder="Provide additional details or checklist points..."
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={creating}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {creating ? 'Saving...' : 'Create Task'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
