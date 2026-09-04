import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { internshipsApi } from "../../../api/internships";

export function useInternships(options = {}) {
  return useQuery({
    queryKey: ["internships"],
    queryFn: () => {
      console.log("Fetching internships...");
      return internshipsApi.listInternships();
    },
    ...options,
  });
}

export function useInternshipMutations() {
  const queryClient = useQueryClient();
  const invalidateInternships = () =>
    queryClient.invalidateQueries({ queryKey: ["internships"] });

  const createInternship = useMutation({
    mutationFn: (payload) => internshipsApi.createInternship(payload),
    onSuccess: invalidateInternships,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) =>
      internshipsApi.updateInternshipStatus(id, status),
    onSuccess: invalidateInternships,
  });

  return {
    createInternship,
    updateStatus,
  };
}
