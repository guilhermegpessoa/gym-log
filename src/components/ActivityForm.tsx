import { useState } from 'react';

// We define the available activities here for easy editing later
const ACTIVITY_OPTIONS = [
  { id: 'abs', label: 'Abs' },
  { id: 'back', label: 'Back' },
  { id: 'biceps', label: 'Biceps' },
  { id: 'chest', label: 'Chest' },
  { id: 'legs', label: 'Legs' },
  { id: 'shoulders', label: 'Shoulders' },
  { id: 'triceps', label: 'Triceps' },
];

export default function ActivityForm() {
  // State for the form fields
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [isCardio, setIsCardio] = useState(false);
  const [cardioTime, setCardioTime] = useState('');
  const [cardioDistance, setCardioDistance] = useState('');

  // Handle checking/unchecking activities
  const handleActivityToggle = (id: string) => {
    setSelectedActivities(
      (prev) =>
        prev.includes(id)
          ? prev.filter((item) => item !== id) // Remove if already checked
          : [...prev, id] // Add if not checked
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // We will hook this up to the database later
    console.log({
      date,
      selectedActivities,
      isCardio,
      cardioTime,
      cardioDistance,
    });
    alert('Check the console to see the data object!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Date Picker */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* 2. Activity Type (Checkboxes) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Muscles Worked
        </label>
        <div className="grid grid-cols-2 gap-2">
          {ACTIVITY_OPTIONS.map((option) => (
            <label
              key={option.id}
              className="flex items-center space-x-2 bg-white p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selectedActivities.includes(option.id)}
                onChange={() => handleActivityToggle(option.id)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 3. Cardio Section */}
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
        <label className="flex items-center space-x-2 cursor-pointer mb-2">
          <input
            type="checkbox"
            checked={isCardio}
            onChange={(e) => setIsCardio(e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="font-medium text-blue-800">I did Cardio</span>
        </label>

        {/* Conditional rendering: Only show if isCardio is true */}
        {isCardio && (
          <div className="grid grid-cols-2 gap-4 mt-3 animate-fade-in">
            <div>
              <label className="block text-xs text-blue-600 mb-1">
                Time (min)
              </label>
              <input
                type="number"
                value={cardioTime}
                onChange={(e) => setCardioTime(e.target.value)}
                placeholder="30"
                className="w-full p-2 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-blue-600 mb-1">
                Distance (km)
              </label>
              <input
                type="number"
                value={cardioDistance}
                onChange={(e) => setCardioDistance(e.target.value)}
                placeholder="5"
                className="w-full p-2 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-colors"
      >
        Log Workout
      </button>
    </form>
  );
}
