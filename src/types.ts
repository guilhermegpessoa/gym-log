export interface ExerciseTemplate {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight: string;
}

export interface Routine {
  id: string;
  user_id: string;
  name: string;
  exercises: ExerciseTemplate[];
  is_archived?: boolean;
}

export type ActivityLog = {
  id: string;
  date: string; // YYYY-MM-DD
  activity_ids: string[]; // ['chest', 'triceps']
  is_cardio: boolean;
  cardio_time?: number;
  cardio_distance?: number;
  exercises_done?: any;
};
