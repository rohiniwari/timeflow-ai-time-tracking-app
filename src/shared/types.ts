import z from "zod";

export const ActivitySchema = z.object({
  id: z.number().optional(),
  user_id: z.string(),
  activity_name: z.string().min(1, "Activity name is required"),
  category: z.enum(["Work", "Study", "Sleep", "Exercise", "Entertainment"]),
  duration_minutes: z.number().min(1, "Duration must be at least 1 minute"),
  activity_date: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const CreateActivitySchema = ActivitySchema.omit({
  id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
});

export const UpdateActivitySchema = CreateActivitySchema.partial();

export type Activity = z.infer<typeof ActivitySchema>;
export type CreateActivity = z.infer<typeof CreateActivitySchema>;
export type UpdateActivity = z.infer<typeof UpdateActivitySchema>;

export interface DayAnalytics {
  total_minutes: number;
  activity_count: number;
  categories: {
    category: string;
    total_minutes: number;
    activity_count: number;
  }[];
  activities: Activity[];
}
