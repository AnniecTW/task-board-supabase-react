import type { Database } from "./supabase";

type Tables = Database["public"]["Tables"];

export type Task = Tables["tasks"]["Row"];
export type TaskInsert = Tables["tasks"]["Insert"];
export type TaskUpdate = Tables["tasks"]["Update"];

export type TeamMember = Tables["team_members"]["Row"];
