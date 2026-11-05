import type { Activity } from "@/features/activities/ActivitiesContext";

export interface ActivityDB {
  id: string;
  created_at: string;
  title: string;
  estimation: number;
  completed: number;
  focus_minutes: number;
  done: boolean;
  completed_at: string | null;
}

export function toSnake(activity: Partial<Activity>) {
  return {
    id: activity.id,
    title: activity.title,
    created_at: activity.createdAt,
    estimation: activity.estimation,
    completed: activity.completed,
    focus_minutes: activity.focusMinutes,
    done: activity.done,
    completed_at: activity.completedAt,
  };
}
export function toCamel(activity: ActivityDB) {
  return {
    id: activity.id,
    title: activity.title,
    createdAt: activity.created_at,
    estimation: activity.estimation,
    completed: activity.completed,
    focusMinutes: activity.focus_minutes,
    done: activity.done,
    completedAt: activity.completed_at,
  };
}
