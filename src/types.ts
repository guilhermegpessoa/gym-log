export type ActivityLog = {
  id: string;
  date: string; // YYYY-MM-DD
  activity_ids: string[]; // ['chest', 'triceps']
  is_cardio: boolean;
  cardio_time?: number;
  cardio_distance?: number;
};
