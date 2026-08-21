import { useQuery } from "@tanstack/react-query";

import { usersApi } from "../../../api/users";

export function useUsers(options = {}) {
  return useQuery({
    queryKey: ["users"],
    queryFn: usersApi.listUsers,
    ...options,
  });
}
