import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "../services/apiTasks";
import type { Task } from "../types/database";

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,
    // Optimistic Update
    onMutate: async (newUpdate) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData(["tasks"]);

      // manually update cache
      queryClient.setQueryData<Task[]>(["tasks"], (old) => {
        if (!old) return [];
        return old.map((t) =>
          t.id === newUpdate.taskId ? { ...t, status: newUpdate.status } : t,
        );
      });

      return { previousTasks };
    },
    onError: (err, newUpdate, context) => {
      // fallback
      queryClient.setQueryData(["tasks"], context?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
