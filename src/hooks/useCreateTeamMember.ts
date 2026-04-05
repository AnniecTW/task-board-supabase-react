import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTeamMember } from "../services/apiTeamMembers";

export const useCreateTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, color }: { name: string; color: string }) =>
      createTeamMember(name, color),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
    },
  });
};
