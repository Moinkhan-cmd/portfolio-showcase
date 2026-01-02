// Hook to fetch skills from Firestore
import { useQuery } from "@tanstack/react-query";
import { getSkills } from "@/lib/admin/skills";

export const useSkills = () => {
  return useQuery({
    queryKey: ["skills"],
    queryFn: getSkills,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};



