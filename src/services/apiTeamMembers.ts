import { supabase } from "../lib/supabase";
import type { TeamMember } from "../types/database";

export async function getAllTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from("team_members")
    .select("id, name, avatar_url, color")
    .order("name");

  if (error) throw new Error("Team members could not be loaded");
  return data || [];
}
