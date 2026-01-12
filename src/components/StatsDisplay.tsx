import { useState, useEffect } from 'react';
import type { ActivityLog } from '../types';
import { ACTIVITY_OPTIONS } from '../constants';

interface StatsDisplayProps {
  logs: ActivityLog[];
  onDelete: (id: string) => void;
  onEdit: (log: ActivityLog) => void;
}

export default function StatsDisplay({
  logs,
  onDelete,
  onEdit,
}: StatsDisplayProps) {
  // 1. Setup Default Dates (Current Year)
  const currentYear = new Date().getFullYear();
  const [startDate, setStartDate] = useState(`${currentYear}-01-01`);
  const [endDate, setEndDate] = useState(`${currentYear}-12-31`);

  // Pagination State
  const [visibleCount, setVisibleCount] = useState(5);

  // 2. Filter Logs based on Date Range
  const filteredLogs = logs.filter((log) => {
    return log.date >= startDate && log.date <= endDate;
  });

  // Reset pagination when dates change
  useEffect(() => {
    setVisibleCount(5);
  }, [startDate, endDate, logs]);

  // STATS CALCULATIONS
  const uniqueDays = new Set(filteredLogs.map((log) => log.date)).size;
  const totalActivities = filteredLogs.length;

  const breakdown: Record<string, number> = {};
  let cardioSessions = 0;
  let totalCardioTime = 0;
  let totalCardioDistance = 0;

  filteredLogs.forEach((log) => {
    // Muscle Breakdown
    log.activity_ids.forEach((activityId) => {
      const option = ACTIVITY_OPTIONS.find((opt) => opt.id === activityId);
      const name = option ? option.label : activityId;

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

  // Calculate Average Pace (Time / Distance)
  const averagePace =
    totalCardioDistance > 0
      ? (totalCardioTime / totalCardioDistance).toFixed(2)
      : '0.00';

  // Helper to change 2023-12-25 -> 25/12/2023
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  // Slice the logs for display
  const displayedLogs = filteredLogs.slice(0, visibleCount);

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Responsive Date Filter Section */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">
          Filter Period
        </h3>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="w-full">
            <label className="block text-xs text-gray-400 mb-1">From</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="block w-full max-w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50 appearance-none box-border"
              style={{ WebkitAppearance: 'none' }}
            />
          </div>

          <div className="w-full">
            <label className="block text-xs text-gray-400 mb-1">To</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="block w-full max-w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50 appearance-none box-border"
              style={{ WebkitAppearance: 'none' }}
            />
          </div>
        </div>
      </div>

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
              No data in this period.
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
      {cardioSessions > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3">Cardio Stats</h3>
          <div className="bg-orange-50 rounded-xl border border-orange-100 p-4 space-y-4">
            <div className="flex justify-between items-center border-b border-orange-200 pb-3">
              <span className="text-orange-900 font-medium">Sessions</span>
              <span className="text-2xl font-bold text-orange-600">
                {cardioSessions}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-orange-800 uppercase font-bold opacity-70">
                  Total Time
                </p>
                <p className="text-xl font-bold text-orange-700">
                  {parseFloat(totalCardioTime.toFixed(2))}{' '}
                  <span className="text-sm font-normal">min</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-orange-800 uppercase font-bold opacity-70">
                  Total Dist
                </p>
                <p className="text-xl font-bold text-orange-700">
                  {parseFloat(totalCardioDistance.toFixed(2))}{' '}
                  <span className="text-sm font-normal">km</span>
                </p>
              </div>
              {/* Average Pace */}
              <div className="col-span-2 sm:col-span-1">
                <p className="text-xs text-orange-800 uppercase font-bold opacity-70">
                  Avg Pace
                </p>
                <p className="text-xl font-bold text-orange-700">
                  {averagePace} <span className="text-sm font-normal">/km</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent History List */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">
          History ({filteredLogs.length})
        </h3>
        <div className="space-y-3">
          {displayedLogs.length === 0 ? (
            <p className="text-gray-400 text-sm italic">
              No logs found for this period.
            </p>
          ) : (
            displayedLogs.map((log) => {
              const logPace =
                log.is_cardio && log.cardio_distance && log.cardio_time
                  ? (
                      Number(log.cardio_time) / Number(log.cardio_distance)
                    ).toFixed(2)
                  : null;

              return (
                <div
                  key={log.id}
                  className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      {formatDate(log.date)}
                    </p>
                    <p className="font-bold text-gray-800 capitalize">
                      {log.activity_ids.join(', ') || 'Cardio'}
                    </p>
                    {log.is_cardio && (
                      <p className="text-xs text-orange-600 mt-1">
                        🏃 {log.cardio_time}min / {log.cardio_distance}km
                        {logPace && (
                          <span className="font-bold ml-1">
                            (@ {logPace}/km)
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(log)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => onDelete(log.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {visibleCount < filteredLogs.length && (
            <button
              onClick={() => setVisibleCount((prev) => prev + 5)}
              className="w-full py-3 text-sm font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
            >
              Show More ({filteredLogs.length - visibleCount} remaining)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
