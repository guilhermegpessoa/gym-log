import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import type { Routine, ExerciseTemplate } from '../types';

export default function RoutinesManager() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentRoutineId, setCurrentRoutineId] = useState<string | null>(null);
  const [routineName, setRoutineName] = useState('');
  const [exercises, setExercises] = useState<ExerciseTemplate[]>([]);

  useEffect(() => {
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    const { data, error } = await supabase
      .from('routines')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data) {
      setRoutines(data);
    }
    setIsLoading(false);
  };

  const handleAddExercise = () => {
    setExercises([
      ...exercises,
      {
        id: Math.random().toString(36).substring(2, 9),
        name: '',
        sets: 3,
        reps: '12',
        weight: '',
      },
    ]);
  };

  const handleExerciseChange = (
    id: string,
    field: keyof ExerciseTemplate,
    value: any,
  ) => {
    setExercises(
      exercises.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex)),
    );
  };

  const handleRemoveExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id));
  };

  const handleSaveRoutine = async () => {
    if (!routineName.trim())
      return alert("Please name your routine (e.g., 'Segunda')");

    const payload = {
      name: routineName,
      exercises: exercises,
    };

    const user = (await supabase.auth.getUser()).data.user;

    if (currentRoutineId) {
      await supabase
        .from('routines')
        .update(payload)
        .eq('id', currentRoutineId);
    } else {
      await supabase
        .from('routines')
        .insert([{ ...payload, user_id: user?.id }]);
    }

    resetForm();
    fetchRoutines();
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentRoutineId(null);
    setRoutineName('');
    setExercises([]);
  };

  const editRoutine = (routine: Routine) => {
    setRoutineName(routine.name);
    setExercises(routine.exercises || []);
    setCurrentRoutineId(routine.id);
    setIsEditing(true);
  };

  const deleteRoutine = async (id: string) => {
    if (window.confirm('Delete this routine?')) {
      await supabase.from('routines').delete().eq('id', id);
      fetchRoutines();
    }
  };

  if (isLoading)
    return <div className="text-center p-4">Loading Worksheets...</div>;

  // VIEW MODE
  if (!isEditing) {
    return (
      <div className="space-y-6 animate-fade-in">
        <button
          onClick={() => setIsEditing(true)}
          className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700"
        >
          + Create New Worksheet
        </button>

        <div className="space-y-4">
          {routines.map((routine) => (
            <div
              key={routine.id}
              className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg text-gray-800">
                  {routine.name}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => editRoutine(routine)}
                    className="text-blue-600 font-medium text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteRoutine(routine.id)}
                    className="text-red-600 font-medium text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                {routine.exercises?.map((ex, i) => (
                  <div
                    key={i}
                    className="flex justify-between border-b border-gray-50 py-1"
                  >
                    <span>{ex.name}</span>
                    <span className="font-mono text-xs text-gray-400">
                      {ex.sets}x{ex.reps} | {ex.weight}kg
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {routines.length === 0 && (
            <p className="text-center text-gray-400 py-8">
              No worksheets created yet.
            </p>
          )}
        </div>
      </div>
    );
  }

  // EDIT/CREATE MODE
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-xl">
          {currentRoutineId ? 'Edit' : 'New'} Worksheet
        </h2>
        <button onClick={resetForm} className="text-gray-500 font-bold">
          Cancel
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Worksheet Name
        </label>
        <input
          type="text"
          placeholder="e.g., Segunda"
          value={routineName}
          onChange={(e) => setRoutineName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">
            Exercises
          </label>
        </div>

        {exercises.map((ex, index) => (
          <div
            key={ex.id}
            className="bg-gray-50 p-3 rounded-lg border border-gray-200"
          >
            <div className="flex justify-between mb-2">
              <span className="text-xs font-bold text-gray-400">
                EXERCISE {index + 1}
              </span>
              <button
                onClick={() => handleRemoveExercise(ex.id)}
                className="text-red-500 text-xs font-bold"
              >
                Remove
              </button>
            </div>

            <input
              type="text"
              placeholder="Name (e.g., Banco Extensor)"
              value={ex.name}
              onChange={(e) =>
                handleExerciseChange(ex.id, 'name', e.target.value)
              }
              className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 mb-2"
            />

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-gray-500 uppercase font-bold">
                  Série
                </label>
                <input
                  type="number"
                  value={ex.sets}
                  onChange={(e) =>
                    handleExerciseChange(
                      ex.id,
                      'sets',
                      parseInt(e.target.value),
                    )
                  }
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase font-bold">
                  Repetição
                </label>
                <input
                  type="text"
                  value={ex.reps}
                  onChange={(e) =>
                    handleExerciseChange(ex.id, 'reps', e.target.value)
                  }
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase font-bold">
                  Carga (kg)
                </label>
                <input
                  type="text"
                  value={ex.weight}
                  onChange={(e) =>
                    handleExerciseChange(ex.id, 'weight', e.target.value)
                  }
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={handleAddExercise}
          className="w-full py-2 bg-blue-50 text-blue-600 font-bold rounded-lg border border-blue-100 hover:bg-blue-100"
        >
          + Add Exercise
        </button>
      </div>

      <button
        onClick={handleSaveRoutine}
        className="w-full py-3 bg-green-600 text-white font-bold rounded-xl shadow-md hover:bg-green-700"
      >
        Save Worksheet
      </button>
    </div>
  );
}
