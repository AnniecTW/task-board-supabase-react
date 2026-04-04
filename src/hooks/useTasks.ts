import { useQuery } from "@tanstack/react-query";
import { getAllTasks } from "../services/apiTasks";

export const useTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: getAllTasks,

    staleTime: 1000 * 60,
  });
};
