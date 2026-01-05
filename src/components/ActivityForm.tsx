import { useState } from 'react';
import { supabase } from '../supabase';

const ACTIVITY_OPTIONS = [
  { id: 'abs', label: 'Abs' },
  { id: 'back', label: 'Back' },
  { id: 'biceps', label: 'Biceps' },
  { id: 'chest', label: 'Chest' },
  { id: 'legs', label: 'Legs' },
  { id: 'shoulders', label: 'Shoulders' },
  { id: 'triceps', label: 'Triceps' },
];

// Optional: define a prop to notify the parent component when a new log is added
interface ActivityFormProps {
  onSuccess?: () => void;
}

export default function ActivityForm({ onSuccess }: ActivityFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [isCardio, setIsCardio] = useState(false);
  const [cardioTime, setCardioTime] = useState('');
  const [cardioDistance, setCardioDistance] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleActivityToggle = (id: string) => {
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. Prepare data for Supabase (matching the SQL table column names)
    const payload = {
      date: date,
      activity_ids: selectedActivities,
      is_cardio: isCardio,
      // Convert string inputs to numbers, or null if empty
      cardio_time: cardioTime ? parseFloat(cardioTime) : null,
      cardio_distance: cardioDistance ? parseFloat(cardioDistance) : null,
    };

    // 2. Send to Supabase
    const { error } = await supabase.from('activities').insert([payload]);

    setIsSubmitting(false);

    if (error) {
      alert('Error saving data: ' + error.message);
      console.error(error);
    } else {
      alert('Workout saved successfully! 💪');

      // Reset form (optional, but good UX)
      setSelectedActivities([]);
      setIsCardio(false);
      setCardioTime('');
      setCardioDistance('');

      // Notify parent to refresh list
      if (onSuccess) onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 px-4 text-white font-bold rounded-xl shadow-lg transition-colors ${
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isSubmitting ? 'Saving...' : 'Log Workout'}
      </button>
    </form>
  );
}
