import { useMutation } from "@tanstack/react-query";

import { useQueryClient } from "@tanstack/react-query";


import { profileQueryKeys } from "../constants/profile.query-keys";
import profileApi from "../api/profile.api";

export function useUpdateName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileApi.updateName,

    onSuccess: (profile) => {
      queryClient.setQueryData(
        profileQueryKeys.me(),
        profile
      );
    },
  });
}