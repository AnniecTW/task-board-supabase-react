import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateTaskStatus } from "../services/apiTasks";
import type { Task } from "../types/database";

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTaskStatus,
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
    onError: (err, _vars, context) => {
      queryClient.setQueryData(["tasks"], context?.previousTasks);
      toast.error(err instanceof Error ? err.message : "Failed to move task");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
