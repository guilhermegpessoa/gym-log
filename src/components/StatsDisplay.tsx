import type { ActivityLog } from '../types';

interface StatsDisplayProps {
  logs: ActivityLog[];
}

export default function StatsDisplay({ logs }: StatsDisplayProps) {
  // 1. Calculate General Stats
  const uniqueDays = new Set(logs.map((log) => log.date)).size;
  const totalActivities = logs.length;

  // 2. Calculate Muscle Breakdown
  const breakdown: Record<string, number> = {};

  // 3. Calculate Cardio Stats
  let cardioSessions = 0;
  let totalCardioTime = 0;
  let totalCardioDistance = 0;

  logs.forEach((log) => {
    // Muscle Breakdown
    log.activity_ids.forEach((activity) => {
      const name = activity.charAt(0).toUpperCase() + activity.slice(1);
      breakdown[name] = (breakdown[name] || 0) + 1;
    });

    // Cardio Stats
    if (log.is_cardio) {
      cardioSessions++;
      if (log.cardio_time) totalCardioTime += Number(log.cardio_time);
      if (log.cardio_distance)
        totalCardioDistance += Number(log.cardio_distance);
    }
  });

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Top Cards: General Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
          <p className="text-gray-500 text-xs font-bold uppercase">
            Active Days
          </p>
          <p className="text-3xl font-extrabold text-blue-600">{uniqueDays}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
          <p className="text-gray-500 text-xs font-bold uppercase">
            Activities
          </p>
          <p className="text-3xl font-extrabold text-green-600">
            {totalActivities}
          </p>
        </div>
      </div>

      {/* Muscle Breakdown */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">
          Muscle Breakdown
        </h3>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {Object.entries(breakdown).length === 0 ? (
            <p className="p-4 text-center text-gray-400 text-sm">
              No muscle data yet.
            </p>
          ) : (
            Object.entries(breakdown).map(([name, count], index) => (
              <div
                key={name}
                className={`flex justify-between items-center p-3 ${
                  index !== 0 ? 'border-t border-gray-100' : ''
                }`}
              >
                <span className="font-medium text-gray-700">{name}</span>
                <span className="bg-gray-100 text-gray-600 py-1 px-3 rounded-full text-xs font-bold">
                  {count}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Cardio Stats Section */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">Cardio Stats</h3>
        <div className="bg-orange-50 rounded-xl border border-orange-100 p-4 space-y-4">
          <div className="flex justify-between items-center border-b border-orange-200 pb-3">
            <span className="text-orange-900 font-medium">Sessions</span>
            <span className="text-2xl font-bold text-orange-600">
              {cardioSessions}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-orange-800 uppercase font-bold opacity-70">
                Total Time
              </p>
              <p className="text-xl font-bold text-orange-700">
                {totalCardioTime}{' '}
                <span className="text-sm font-normal">min</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-orange-800 uppercase font-bold opacity-70">
                Total Distance
              </p>
              <p className="text-xl font-bold text-orange-700">
                {totalCardioDistance}{' '}
                <span className="text-sm font-normal">km</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
