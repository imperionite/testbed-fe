import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { authApi } from "../api/auth";

import { authStorage } from "../auth";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,

    onSuccess: (session) => {
      authStorage.setTokens({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      });

      authStorage.setUser(session.user);

      queryClient.setQueryData(["currentUser"], session.user);
    },
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.getMe,
    enabled: authStorage.hasSession(),
    initialData: authStorage.getUser(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,

    onSettled: () => {
      authStorage.clearSession();
      queryClient.clear();
    },
  });
}

export function useChangePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.changePassword,

    onSuccess: () => {
      authStorage.clearSession();
      queryClient.clear();
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: authApi.forgotPassword,
  });
}

/**
 * Completes application-level password reset.
 *
 * Supabase already changed the password.
 *
 * Backend only:
 * - clears must_change_password
 * - updates profile state
 */
export function useCompletePasswordReset() {
  return useMutation({
    mutationFn: authApi.completePasswordReset,
  });
}

export default function useAuth() {
  const { data: user, isLoading, isError } = useCurrentUser();

  const logoutMutation = useLogout();

  useEffect(() => {
    if (isError) {
      authStorage.clearSession();
    }
  }, [isError]);

  return {
    user,
    isLoading,
    isAuthenticated: Boolean(user),

    logout: logoutMutation.mutate,
  };
}
