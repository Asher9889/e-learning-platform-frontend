
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createGrade } from "../api/grades.api";
import { sileo } from "sileo";
import type { AxiosError } from "axios";

export function useCreateGrade() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createGrade,

        onSuccess: (response) => {
            console.log(response, "APIawdaw Response");

            queryClient.invalidateQueries({
                queryKey: ["grades"],
            });

            sileo.success({
                title: "Grade Created",
                description: "Grade created successfully",
            });
        },
        onError: (error: AxiosError<any>) => {
            console.log(error, "anubhav")
            const message =
                error.response?.data?.message ||
                error.message ||
                "Something went wrong";
            sileo.error({
                title: "Error",
                description: message
            })
        }
    });

    return {
        createGradeAsync:
            mutation.mutateAsync,

        isCreating:
            mutation.isPending,

        error: mutation.error,
    };
}