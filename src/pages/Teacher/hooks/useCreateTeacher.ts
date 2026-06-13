import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  teacherEnrollSchema,
  type TeacherEnrollFormInput,
  type TeacherEnrollFormOutput,
} from "../schema/teacher.schema";

import { createTeacher } from "../api/teacher.api";
import { queryClient } from "@/config";

export function useCreateTeacher() {
  const {
    handleSubmit,
    formState,
    setValue,
    register,
    control,
    watch,
    trigger,
    reset,
  } = useForm<
    TeacherEnrollFormInput,
    unknown,
    TeacherEnrollFormOutput
  >({
    resolver: zodResolver(teacherEnrollSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const mutate = useMutation({
    mutationKey: ["create-teacher"],
    mutationFn: (data: TeacherEnrollFormOutput) =>
      createTeacher(data),

    onSuccess: (data) => {
      console.log(
        "Teacher created successfully",
        data
      );
queryClient.invalidateQueries({
        queryKey: ["teachers"],
      });
      reset();
    },

    onError: (error) => {
      console.error(
        "Teacher creation failed:",
        error
      );
    },
  });

  function handleCreateTeacher(
    data: TeacherEnrollFormOutput
  ) {
    mutate.mutate(data);
  }

  return {
     mutate: mutate.mutate,
    handleCreateTeacher,

    handleSubmit,
    formState,

    register,
    setValue,
    control,
    watch,
    trigger,
    reset,
  };
}