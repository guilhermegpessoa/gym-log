import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import ActivityForm from './components/ActivityForm';
import StatsDisplay from './components/StatsDisplay';
import RoutinesManager from './components/RoutinesManager';
import Login from './components/Login';
import type { ActivityLog } from './types';
import type { Session } from '@supabase/supabase-js';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [view, setView] = useState<'log' | 'routines' | 'stats'>('log');
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingLog, setEditingLog] = useState<ActivityLog | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchLogs();
      else setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchLogs();
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('date', { ascending: false });

    if (error) console.error('Error fetching logs:', error);
    else setLogs(data as ActivityLog[]);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLogs([]);
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(
      'Are you sure you want to delete this workout?',
    );
    if (!confirm) return;

    const { error } = await supabase.from('activities').delete().eq('id', id);

    if (error) {
      alert('Error deleting: ' + error.message);
    } else {
      // Remove locally to look fast
      setLogs((prev) => prev.filter((log) => log.id !== id));
    }
  };

  const handleEdit = (log: ActivityLog) => {
    setEditingLog(log); // Save the log to state
    setView('log'); // Switch to form view
  };

  const handleSuccess = () => {
    setEditingLog(null); // Clear editing mode
    setView('stats'); // Go to stats to see the result
    fetchLogs(); // Refresh data
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <Login />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden flex flex-col min-h-[600px]">
        <div className="p-6 pb-2 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Gym Log 💪</h1>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-500 hover:text-red-500 underline"
          >
            Sign Out
          </button>
        </div>

        <div className="flex border-b border-gray-200 mb-6 bg-white">
          <button
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${view === 'log' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
            onClick={() => setView('log')}
          >
            Log Workout
          </button>
          <button
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${view === 'routines' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
            onClick={() => setView('routines')}
          >
            Worksheets
          </button>
          <button
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${view === 'stats' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'}`}
            onClick={() => setView('stats')}
          >
            My Stats
          </button>
        </div>

        <div className="p-6 flex-1">
          {loading ? (
            <div className="text-center py-10 text-gray-500">
              Loading your history...
            </div>
          ) : (
            <>
              {view === 'log' && (
                <ActivityForm onSuccess={() => setView('stats')} />
              )}
              {view === 'routines' && <RoutinesManager />}
              {view === 'stats' && (
                <StatsDisplay
                  logs={logs}
                  onDelete={deleteLog}
                  onEdit={handleEditLog}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
