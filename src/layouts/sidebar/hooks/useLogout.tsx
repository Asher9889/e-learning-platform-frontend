import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/sidebar.api";
import { queryClient } from "@/config";

export const useLogout = () => {
    const mutation = useMutation({
        mutationFn: authApi.logout,

        onSuccess: async () => {
            queryClient.clear();

            window.location.href = "/login";
        },
    });
    return mutation;
};