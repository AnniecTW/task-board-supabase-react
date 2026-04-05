import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createTeamMember } from "../services/apiTeamMembers";

export const useCreateTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, color }: { name: string; color: string }) =>
      createTeamMember(name, color),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to add member");
    },
  });
};
