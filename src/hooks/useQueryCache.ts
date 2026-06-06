import { useQueryClient } from '@tanstack/react-query';

export const useQueryCache = <T = unknown>(key: string[]) => {
  const queryClient = useQueryClient();

  return {
    get: () => queryClient.getQueryData<T>(key),

    set: (data: T) => queryClient.setQueryData(key, data),

    remove: () => queryClient.removeQueries({ queryKey: key }),

    invalidate: () =>
      queryClient.invalidateQueries({ queryKey: key }),

    key,
  };
};