import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateTaskFull } from "../services/apiTasks";
import type { Task, TaskUpdate } from "../types/database";

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      updates,
    }: {
      taskId: string;
      updates: TaskUpdate;
    }) => updateTaskFull(taskId, updates),

    onMutate: async ({ taskId, updates }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData(["tasks"]);

      queryClient.setQueryData<Task[]>(["tasks"], (old) => {
        if (!old) return [];
        return old.map((t) =>
          t.id === taskId ? { ...t, ...updates } : t,
        );
      });

      return { previousTasks };
    },
    onError: (err, _vars, context) => {
      queryClient.setQueryData(["tasks"], context?.previousTasks);
      toast.error(err instanceof Error ? err.message : "Failed to save changes");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
