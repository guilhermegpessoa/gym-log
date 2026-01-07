import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import type { ActivityLog } from '../types';

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
  initialData?: ActivityLog | null;
  onCancel?: () => void;
}

export default function ActivityForm({
  onSuccess,
  initialData,
  onCancel,
}: ActivityFormProps) {
  const getLocalDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [date, setDate] = useState(getLocalDate());
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [isCardio, setIsCardio] = useState(false);
  const [cardioTime, setCardioTime] = useState('');
  const [cardioDistance, setCardioDistance] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setDate(initialData.date);
      setSelectedActivities(initialData.activity_ids);
      setIsCardio(initialData.is_cardio);
      setCardioTime(initialData.cardio_time?.toString() || '');
      setCardioDistance(initialData.cardio_distance?.toString() || '');
    } else {
      setDate(getLocalDate());
      setSelectedActivities([]);
      setIsCardio(false);
      setCardioTime('');
      setCardioDistance('');
    }
  }, [initialData?.id]);

  const handleActivityToggle = (id: string) => {
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedActivities.length === ACTIVITY_OPTIONS.length) {
      setSelectedActivities([]);
    } else {
      setSelectedActivities(ACTIVITY_OPTIONS.map((opt) => opt.id));
    }
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
      const result = await supabase
        .from('activities')
        .update(payload)
        .eq('id', initialData.id);
      error = result.error;
    } else {
      const result = await supabase.from('activities').insert([payload]);
      error = result.error;
    }

    setIsSubmitting(false);

    if (error) {
      alert('Error: ' + error.message);
    } else {
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
          className="block w-full min-w-0 box-border p-3 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white appearance-none"
          style={{ WebkitAppearance: 'none' }}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Muscles Worked
          </label>
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
          >
            {selectedActivities.length === ACTIVITY_OPTIONS.length
              ? 'Deselect All'
              : 'Select All'}
          </button>
        </div>

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
