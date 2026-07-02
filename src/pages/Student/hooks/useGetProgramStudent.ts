import { useQuery } from "@tanstack/react-query";
import { getProgramStudents } from "../api/student.api";
import { useMemo } from "react";
import type { StudentDataFromApi } from "../schema/student.schema";


// useGetProgramStudent.ts

export interface ProgramStudent {
  id: string;
  personalInfo?: {
    name?: string;
  };
}
export const useProgramStudents = (batchId?: string) => {
  const query = useQuery({
    queryKey: ["program-students", batchId],
    queryFn: () => getProgramStudents(batchId!),
    enabled: !!batchId,

  });
  const studentOptions = useMemo(
    () =>
      ( query?.data?.students ?? []).map((student: StudentDataFromApi) => ({
        value: student.id,
        label: student.personalInfo?.name ?? "Unknown Student",
      })),
    [query.data]
  );

  return {
    ...query,
    studentOptions,
  };
};