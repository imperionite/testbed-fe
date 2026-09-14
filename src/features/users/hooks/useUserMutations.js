import { useMutation, useQueryClient } from "@tanstack/react-query";

import { usersApi } from "../../../api/users";

export function useUserMutations() {
  const queryClient = useQueryClient();
  const invalidateUsers = () =>
    queryClient.invalidateQueries({ queryKey: ["users"] });

  const updateRole = useMutation({
    mutationFn: ({ id, role }) => usersApi.updateUserRole(id, { role }),
    onSuccess: invalidateUsers,
  });

  const createUser = useMutation({
    mutationFn: (payload) => usersApi.createUser(payload),
    onSuccess: invalidateUsers,
  });

  const updateUser = useMutation({
    mutationFn: ({ id, payload }) => usersApi.updateUser(id, payload),
    onSuccess: invalidateUsers,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, isActive }) =>
      usersApi.updateStatus(id, { isActive }),
    onSuccess: invalidateUsers,
  });

  const bulkUpdateRole = useMutation({
    mutationFn: ({ ids, role }) =>
      Promise.all(ids.map((id) => usersApi.updateUserRole(id, { role }))),
    onSuccess: invalidateUsers,
  });

  const bulkUpdateStatus = useMutation({
    mutationFn: ({ ids, isActive }) =>
      Promise.all(
        ids.map((id) => usersApi.updateStatus(id, { isActive })),
      ),
    onSuccess: invalidateUsers,
  });

  return {
    createUser,
    updateUser,
    updateRole,
    updateStatus,
    bulkUpdateRole,
    bulkUpdateStatus,
  };
}
