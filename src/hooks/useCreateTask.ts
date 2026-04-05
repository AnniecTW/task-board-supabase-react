import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { Task } from "../types/database";
import { createTask } from "../services/apiTasks";

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      queryClient.setQueryData<Task[]>(["tasks"], (old = []) => [
        ...old,
        {
          ...newTask,
          id: "temp-id-" + Math.random(), // temporary ID
          created_at: new Date().toISOString(),
        } as Task,
      ]);

      return { previousTasks };
    },
    onError: (err, _vars, context) => {
      queryClient.setQueryData(["tasks"], context?.previousTasks);
      toast.error(err instanceof Error ? err.message : "Failed to create task");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
