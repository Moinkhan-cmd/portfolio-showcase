// Hook to fetch projects from Firestore
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/lib/admin/projects";

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};





