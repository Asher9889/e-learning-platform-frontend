import { useMutation } from "@tanstack/react-query";
import { login } from "../api/login.api";
import loginSchema, { type TLoginSchema } from "../schema/login.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { authenticated } from "@/store/slices/auth.slice";
import { useGetUser } from "@/pages/dashboard/hooks/useGetUser";
// import { authCheckedAuthenticated } from "@/store/slices/auth.slice";
export function useLogin() {

    const dispatch = useDispatch();
    const getUserMutation = useGetUser();
    const { handleSubmit, formState, setValue, register } = useForm<TLoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        },
        reValidateMode: "onChange",
        mode: "onChange"
    });


    const mutate = useMutation({
        mutationFn: (data: TLoginSchema) => login(data),
        mutationKey: ["login"],
        onSuccess: async () => {
            dispatch(authenticated());
             try {
                await getUserMutation.mutateAsync();
             } catch (error) {
                 console.log(error);
             }
        },
        onError: (error) => {
            console.error("Login failed:", error);
        }
    })

    function handleLogin(data: TLoginSchema) {
        mutate.mutate(data);
    }

    return { mutate, handleLogin, handleSubmit, formState, setValue, register };
}