import { useQuery } from "@tanstack/react-query";

import { profileQueryKeys } from "../constants/profile.query-keys";
import profileApi from "../api/profile.api";

export function useProfile() {
  return useQuery({
    queryKey: profileQueryKeys.me(),

    queryFn: profileApi.getProfile,
  });
}