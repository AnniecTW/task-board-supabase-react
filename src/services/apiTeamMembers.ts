import { supabase } from "../lib/supabase";
import type { TeamMember } from "../types/database";

export async function getAllTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .order("name");

  if (error) throw new Error("Team members could not be loaded");
  return data || [];
}

export async function createTeamMember(
  name: string,
  color: string,
): Promise<TeamMember> {
  const { data, error } = await supabase
    .from("team_members")
    .insert({ name, color })
    .select()
    .single();
  if (error) throw new Error("Team member could not be created");
  return data;
}

export async function deleteTeamMember(memberId: string): Promise<void> {
  const { error } = await supabase
    .from("team_members")
    .delete()
    .eq("id", memberId);
  if (error) throw new Error("Team member could not be deleted");
}
