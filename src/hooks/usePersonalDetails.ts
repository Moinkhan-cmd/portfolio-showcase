// Hook to fetch and manage personal details from Firestore
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPersonalDetails, savePersonalDetails, PersonalDetails } from "@/lib/admin/personalDetails";

export const usePersonalDetails = () => {
  return useQuery({
    queryKey: ["personalDetails"],
    queryFn: getPersonalDetails,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSavePersonalDetails = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (details: Omit<PersonalDetails, "updatedAt">) => savePersonalDetails(details),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personalDetails"] });
    },
  });
};
