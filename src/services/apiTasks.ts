import { supabase } from "../lib/supabase";
import type { Task, TaskInsert } from "../types/database";

export async function getAllTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("due_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error("Tasks could not be loaded");
  return data || [];
}

export async function updateTask({
  taskId,
  status,
}: {
  taskId: string;
  status: string;
}) {
  const { error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", taskId);
  if (error) throw new Error("The task could not be updated");
}

export async function createTask(newTask: TaskInsert): Promise<Task> {
  const cleanData = {
    ...newTask,
    assignee_id: newTask.assignee_id || null,
  };

  const { data, error } = await supabase
    .from("tasks")
    .insert(cleanData)
    .select()
    .single();

  if (error) throw new Error("The task could not be created");
  return data;
}
