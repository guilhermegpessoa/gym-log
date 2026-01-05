import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import ActivityForm from './components/ActivityForm';
import StatsDisplay from './components/StatsDisplay';
import type { ActivityLog } from './types';

function App() {
  const [view, setView] = useState<'log' | 'stats'>('log');
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to get data from Supabase
  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching logs:', error);
    } else {
      setLogs(data as ActivityLog[]);
    }
    setLoading(false);
  };

  // Run this when the app starts
  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden flex flex-col min-h-[600px]">
        {/* Header */}
        <div className="p-6 pb-2">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Gym Log 💪
          </h1>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setView('log')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              view === 'log'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Log Workout
          </button>
          <button
            onClick={() => setView('stats')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              view === 'stats'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Stats
          </button>
        </div>

        {/* Main Content Area */}
        <div className="p-6 flex-1">
          {loading ? (
            <div className="text-center py-10 text-gray-500">
              Loading history...
            </div>
          ) : (
            <>
              {view === 'log' ? (
                // We pass fetchLogs as 'onSuccess' so the stats update after saving
                <ActivityForm onSuccess={fetchLogs} />
              ) : (
                <StatsDisplay logs={logs} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
