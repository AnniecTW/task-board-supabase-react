import { useQuery } from "@tanstack/react-query";
import { getAllTeamMembers } from "../services/apiTeamMembers";

export const useTeamMembers = () => {
  return useQuery({
    queryKey: ["teamMembers"],
    queryFn: getAllTeamMembers,
    staleTime: 1000 * 60 * 5,
  });
};
