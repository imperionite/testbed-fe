import { useQuery } from "@tanstack/react-query";
import { evaluationsApi } from "../../../api/evaluations";

export function useEvaluations(options = {}) {
  return useQuery({
    queryKey: ["evaluations"],
    queryFn: evaluationsApi.listMyEvaluations,
    ...options,
  });
}

export function useInternEvaluations(id, options = {}) {
  return useQuery({
    queryKey: ["evaluations", "intern", id],
    queryFn: () => evaluationsApi.listInternEvaluations(id),
    enabled: !!id,
    ...options,
  });
}

export function useEvaluation(id, options = {}) {
  return useQuery({
    queryKey: ["evaluations", id],
    queryFn: () => evaluationsApi.getEvaluation(id),
    enabled: !!id,
    ...options,
  });
}
