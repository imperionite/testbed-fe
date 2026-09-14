import { useQuery } from "@tanstack/react-query";

import { htesApi } from "../../../api/htes";

export function useHtes(options = {}) {
  return useQuery({
    queryKey: ["htes"],
    queryFn: htesApi.listHtes,
    ...options,
  });
}
