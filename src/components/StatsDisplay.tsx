import type { ActivityLog } from '../types';

interface StatsDisplayProps {
  logs: ActivityLog[];
}

export default function StatsDisplay({ logs }: StatsDisplayProps) {
  // 1. Calculate Active Days (Unique dates)
  const uniqueDays = new Set(logs.map((log) => log.date)).size;

  // 2. Calculate Total Activities (Sum of all selected muscle groups)
  const totalActivities = logs.reduce(
    (sum, log) => sum + log.activity_ids.length,
    0
  );

  // 3. Calculate Breakdown (Count per muscle group)
  const breakdown: Record<string, number> = {};
  logs.forEach((log) => {
    log.activity_ids.forEach((activity) => {
      // Capitalize first letter for display
      const name = activity.charAt(0).toUpperCase() + activity.slice(1);
      breakdown[name] = (breakdown[name] || 0) + 1;
    });
  });

  return (
    <div className="space-y-6 animate-fade-in">
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

      {/* List: Breakdown by Muscle Group */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">Breakdown</h3>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {Object.entries(breakdown).length === 0 ? (
            <p className="p-4 text-center text-gray-400 text-sm">
              No data yet.
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
                  {count} {count === 1 ? 'day' : 'days'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
