// Hook to fetch certifications from Firestore
import { useQuery } from "@tanstack/react-query";
import { getCertifications } from "@/lib/admin/certifications";

export const useCertifications = () => {
  return useQuery({
    queryKey: ["certifications"],
    queryFn: getCertifications,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};






