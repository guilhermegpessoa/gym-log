import { useState } from 'react';
import ActivityForm from './components/ActivityForm';
import StatsDisplay from './components/StatsDisplay';
import type { ActivityLog } from './types';

// DUMMY DATA FOR TESTING
// We will replace this with real Database data later
const DUMMY_LOGS: ActivityLog[] = [
  {
    id: '1',
    date: '2023-10-01',
    activity_ids: ['chest', 'triceps'],
    is_cardio: false,
  },
  {
    id: '2',
    date: '2023-10-03',
    activity_ids: ['back', 'biceps'],
    is_cardio: true,
    cardio_time: 20,
    cardio_distance: 3,
  },
  { id: '3', date: '2023-10-05', activity_ids: ['legs'], is_cardio: false },
  { id: '4', date: '2023-10-05', activity_ids: ['chest'], is_cardio: false }, // Double session day
];

function App() {
  // Simple state to toggle views
  const [view, setView] = useState<'log' | 'stats'>('log');

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden flex flex-col min-h-[500px]">
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
          {view === 'log' ? (
            <ActivityForm />
          ) : (
            <StatsDisplay logs={DUMMY_LOGS} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
