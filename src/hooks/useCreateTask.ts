import { useMutation, useQueryClient } from "@tanstack/react-query";
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
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["tasks"], context?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
