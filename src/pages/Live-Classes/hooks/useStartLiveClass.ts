import { useMutation } from "@tanstack/react-query";

import type { TStartLiveClassInput } from "../schema/live.class.schema";
import { startLiveClass } from "../api/live.classes.api";

export function useStartLiveClass() {
  const { mutate, isPending } = useMutation({
    mutationFn: (data: TStartLiveClassInput) => startLiveClass(data),
  });
  return { mutate, isPending };
}