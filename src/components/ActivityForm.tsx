import { useState, useEffect } from 'react'; // Added useEffect
import { supabase } from '../supabase';
import type { ActivityLog } from '../types'; // Added Import

const ACTIVITY_OPTIONS = [
  { id: 'abs', label: 'Abs' },
  { id: 'back', label: 'Back' },
  { id: 'biceps', label: 'Biceps' },
  { id: 'chest', label: 'Chest' },
  { id: 'legs', label: 'Legs' },
  { id: 'shoulders', label: 'Shoulders' },
  { id: 'triceps', label: 'Triceps' },
];

interface ActivityFormProps {
  onSuccess?: () => void;
  initialData?: ActivityLog | null; // NEW PROP
  onCancel?: () => void; // NEW PROP
}

export default function ActivityForm({
  onSuccess,
  initialData,
  onCancel,
}: ActivityFormProps) {
  // Initialize state with default OR initialData if editing
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [isCardio, setIsCardio] = useState(false);
  const [cardioTime, setCardioTime] = useState('');
  const [cardioDistance, setCardioDistance] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // When "initialData" changes (user clicked Edit), fill the form
  useEffect(() => {
    if (initialData) {
      setDate(initialData.date);
      setSelectedActivities(initialData.activity_ids);
      setIsCardio(initialData.is_cardio);
      setCardioTime(initialData.cardio_time?.toString() || '');
      setCardioDistance(initialData.cardio_distance?.toString() || '');
    }
  }, [initialData]);

  const handleActivityToggle = (id: string) => {
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      date,
      activity_ids: selectedActivities,
      is_cardio: isCardio,
      cardio_time: cardioTime ? parseFloat(cardioTime) : null,
      cardio_distance: cardioDistance ? parseFloat(cardioDistance) : null,
    };

    let error;

    if (initialData) {
      // UPDATE existing row
      const result = await supabase
        .from('activities')
        .update(payload)
        .eq('id', initialData.id); // Must match ID
      error = result.error;
    } else {
      // INSERT new row
      const result = await supabase.from('activities').insert([payload]);
      error = result.error;
    }

    setIsSubmitting(false);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      // Clear form ONLY if creating new. If editing, we usually close the form.
      if (!initialData) {
        setSelectedActivities([]);
        setIsCardio(false);
        setCardioTime('');
        setCardioDistance('');
        alert('Saved successfully! 💪');
      }
      if (onSuccess) onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header showing if we are Editing */}
      {initialData && (
        <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg text-sm flex justify-between items-center">
          <span>
            ⚠️ Editing workout from{' '}
            <b>{initialData.date.split('-').reverse().join('/')}</b>
          </span>
          <button
            type="button"
            onClick={onCancel}
            className="underline font-bold"
          >
            Cancel
          </button>
        </div>
      )}

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
        {isSubmitting
          ? 'Saving...'
          : initialData
          ? 'Update Workout'
          : 'Log Workout'}
      </button>
    </form>
  );
}
