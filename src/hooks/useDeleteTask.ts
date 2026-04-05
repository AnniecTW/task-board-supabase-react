import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteTask } from "../services/apiTasks";
import type { Task } from "../types/database";

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);
      queryClient.setQueryData<Task[]>(["tasks"], (old = []) =>
        old.filter((t) => t.id !== taskId),
      );
      return { previousTasks };
    },
    onSuccess: () => {
      toast.success("Task deleted");
    },
    onError: (err, _vars, context) => {
      queryClient.setQueryData(["tasks"], context?.previousTasks);
      toast.error(err instanceof Error ? err.message : "Failed to delete task");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
