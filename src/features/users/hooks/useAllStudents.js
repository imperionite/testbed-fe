import { useQuery } from "@tanstack/react-query";
import api from "../../../api/axios";
import { endpoints } from "../../../config";

export function useAllStudents() {
  return useQuery({
    queryKey: ["allStudents"],
    queryFn: async () => {
      const response = await api.get(endpoints.users.role("student"));
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}
