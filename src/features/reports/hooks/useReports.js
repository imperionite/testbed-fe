import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "../../../api/reports";

export function useInternshipReport(filters = {}, options = {}) {
  return useQuery({
    queryKey: ["reports", "internships", filters],
    queryFn: () => reportsApi.getInternshipReport(filters),
    ...options,
  });
}

export function useInternshipReportSummary(filters = {}, options = {}) {
  return useQuery({
    queryKey: ["reports", "summary", filters],
    queryFn: () => reportsApi.getInternshipReportSummary(filters),
    ...options,
  });
}
