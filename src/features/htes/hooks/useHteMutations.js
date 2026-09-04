import { useMutation, useQueryClient } from "@tanstack/react-query";

import { htesApi } from "../../../api/htes";

export function useHteMutations() {
  const queryClient = useQueryClient();
  const invalidateHtes = () =>
    queryClient.invalidateQueries({ queryKey: ["htes"] });

  const createHte = useMutation({
    mutationFn: (payload) => htesApi.createHte(payload),
    onSuccess: invalidateHtes,
  });

  const updateHte = useMutation({
    mutationFn: ({ id, payload }) => htesApi.updateHte(id, payload),
    onSuccess: invalidateHtes,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, isActive }) =>
      htesApi.updateStatus(id, { isActive }),
    onSuccess: invalidateHtes,
  });

  const updateHteSupervisor = useMutation({
    mutationFn: ({ id, supervisorId }) =>
      htesApi.updateHteSupervisor(id, { supervisorId }),
    onSuccess: invalidateHtes,
  });

  const bulkUpdateStatus = useMutation({
    mutationFn: ({ ids, isActive }) =>
      Promise.all(
        ids.map((id) => htesApi.updateStatus(id, { isActive })),
      ),
    onSuccess: invalidateHtes,
  });

  return {
    createHte,
    updateHte,
    updateHteSupervisor,
    updateStatus,
    bulkUpdateStatus,
  };
}
