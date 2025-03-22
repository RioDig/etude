import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSessionStore } from '../model/session.store.ts';
import { sessionApi } from '../api/sessionApi';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated, setUser, logout: clearSession } = useSessionStore();

  const { isLoading: isCheckingAuth } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: sessionApi.getCurrentUser,
    onSuccess: (user) => setUser(user),
    onError: () => clearSession(),
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: sessionApi.login,
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(['auth', 'me'], user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: sessionApi.logout,
    onSuccess: () => {
      clearSession();
      queryClient.clear();
    },
  });

  return {
    user,
    isAuthenticated,
    isLoading: isCheckingAuth,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
  };
};