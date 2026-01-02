// Hook to fetch experience from Firestore
import { useQuery } from "@tanstack/react-query";
import { getExperiences } from "@/lib/admin/experience";

export const useExperience = () => {
  return useQuery({
    queryKey: ["experience"],
    queryFn: getExperiences,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};


