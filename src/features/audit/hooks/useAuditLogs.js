import { useQuery } from "@tanstack/react-query";
import { auditApi } from "../../../api/audit";

export function useAuditLogs(filters = {}, options = {}) {
  return useQuery({
    queryKey: ["audit", filters],
    queryFn: () => auditApi.listLogs(filters),
    ...options,
  });
}
