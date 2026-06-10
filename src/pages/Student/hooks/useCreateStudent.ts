import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import { createStudent } from "../api/student.api";
import { studentEnrollSchema, type StudentEnrollFormInput, type StudentEnrollFormOutput } from "../schema/student.schema";
import { sileo } from "sileo";


export function useCreateStudent() {
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
    StudentEnrollFormInput,
    unknown,
    StudentEnrollFormOutput
  >({
    resolver: zodResolver(studentEnrollSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const mutate = useMutation({
    mutationKey: ["create-teacher"],
    mutationFn: (data: StudentEnrollFormOutput) =>
      createStudent(data),

    onSuccess: (data) => {
      console.log(
        "Student created successfully",
        data
      );

      reset();
    },

    onError: (error) => {
      console.error(
        "Teacher creation failed:",
        error
      );
      sileo.error(
       {
        title: "Student creation failed",
        description:
          error.message || "An error occurred while creating the student. Please try again.",
       }
      );
    },
  });

  function handleCreateStudent(
    data: StudentEnrollFormOutput
  ) {
    mutate.mutate(data);
  }

  return {
    mutate,
    handleCreateStudent,

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