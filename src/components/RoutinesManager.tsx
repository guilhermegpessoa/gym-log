import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import type { Routine, ExerciseTemplate } from '../types';

export default function RoutinesManager() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [viewArchived, setViewArchived] = useState(false);

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

  const toggleArchiveRoutine = async (
    id: string,
    currentStatus: boolean = false,
  ) => {
    const confirmMessage = currentStatus
      ? 'Unarchive this worksheet?'
      : 'Archive this worksheet? It will be hidden from the active list.';

    if (window.confirm(confirmMessage)) {
      await supabase
        .from('routines')
        .update({ is_archived: !currentStatus })
        .eq('id', id);
      fetchRoutines();
    }
  };

  const deleteRoutine = async (id: string) => {
    if (window.confirm('Delete this routine permanently?')) {
      await supabase.from('routines').delete().eq('id', id);
      fetchRoutines();
    }
  };

  if (isLoading)
    return (
      <div className="text-center p-4 text-gray-500">Loading Worksheets...</div>
    );

  // Filter routines based on the view state
  const displayedRoutines = routines.filter((r) =>
    viewArchived ? r.is_archived : !r.is_archived,
  );

  // VIEW MODE
  if (!isEditing) {
    return (
      <div className="space-y-6 animate-fade-in pb-8">
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setViewArchived(false)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${!viewArchived ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Active
          </button>
          <button
            onClick={() => setViewArchived(true)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${viewArchived ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Archived
          </button>
        </div>

        {!viewArchived && (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700"
          >
            + Create New Worksheet
          </button>
        )}

        <div className="space-y-4">
          {displayedRoutines.map((routine) => (
            <div
              key={routine.id}
              className={`bg-white p-4 rounded-xl border shadow-sm ${routine.is_archived ? 'border-gray-300 opacity-80' : 'border-gray-200'}`}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg text-gray-800">
                  {routine.name}
                  {routine.is_archived && (
                    <span className="ml-2 text-[10px] bg-gray-200 text-gray-600 px-2 py-1 rounded-full uppercase tracking-wider">
                      Archived
                    </span>
                  )}
                </h3>
                <div className="flex gap-2">
                  {!routine.is_archived && (
                    <button
                      onClick={() => editRoutine(routine)}
                      className="text-blue-600 font-medium text-sm hover:underline"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() =>
                      toggleArchiveRoutine(routine.id, routine.is_archived)
                    }
                    className="text-orange-600 font-medium text-sm hover:underline"
                  >
                    {routine.is_archived ? 'Unarchive' : 'Archive'}
                  </button>
                  <button
                    onClick={() => deleteRoutine(routine.id)}
                    className="text-red-600 font-medium text-sm hover:underline"
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

          {displayedRoutines.length === 0 && (
            <p className="text-center text-gray-400 py-8">
              {viewArchived
                ? 'No archived worksheets.'
                : 'No active worksheets created yet.'}
            </p>
          )}
        </div>
      </div>
    );
  }

  // EDIT/CREATE MODE
  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-xl">
          {currentRoutineId ? 'Edit' : 'New'} Worksheet
        </h2>
        <button
          onClick={resetForm}
          className="text-gray-500 font-bold hover:text-gray-800"
        >
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
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Exercises
        </label>

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
                className="text-red-500 text-xs font-bold hover:underline"
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
                      parseInt(e.target.value) || 0,
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
          className="w-full py-2 mt-2 bg-blue-50 text-blue-600 font-bold rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
        >
          + Add Exercise
        </button>
      </div>

      <button
        onClick={handleSaveRoutine}
        className="w-full py-3 bg-green-600 text-white font-bold rounded-xl shadow-md hover:bg-green-700 transition-colors"
      >
        Save Worksheet
      </button>
    </div>
  );
}
