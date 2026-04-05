import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTeamMember } from "../services/apiTeamMembers";
import type { TeamMember } from "../types/database";

export const useDeleteTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) => deleteTeamMember(memberId),
    onMutate: async (memberId) => {
      await queryClient.cancelQueries({ queryKey: ["teamMembers"] });
      const previousMembers = queryClient.getQueryData<TeamMember[]>(["teamMembers"]);
      queryClient.setQueryData<TeamMember[]>(["teamMembers"], (old = []) =>
        old.filter((m) => m.id !== memberId),
      );
      return { previousMembers };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["teamMembers"], context?.previousMembers);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
    },
  });
};
