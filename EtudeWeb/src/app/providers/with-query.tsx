import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});

export const withQuery = (component: () => React.ReactNode) => () => {
  return (
    <QueryClientProvider client={queryClient}>
      {component()}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};