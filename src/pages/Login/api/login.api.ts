import { api } from "@/config"
import { apiEndPoints} from "@/config"
import type { TLoginSchema } from "../schema/login.schema";

export async function login(loginData: TLoginSchema){
    try {
        const {url, method} = apiEndPoints.AUTH.LOGIN
        const res = await api.request({
            url: url,
            method: method,
            data: loginData
        })
        return res.data?.data || [];
    } catch (error:any) {
        throw new Error(error.response?.data?.message || error.response?.data?.errors || "Network Error");
    }
}