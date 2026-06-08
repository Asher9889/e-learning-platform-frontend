import { api } from "@/config"
import { apiEndPoints} from "@/config"
import type { TLoginSchema } from "../schema/login.schema";

export async function login(loginData: TLoginSchema){

        const {url, method} = apiEndPoints.AUTH.LOGIN
        const res = await api.request({
            url: url,
            method: method,
            data: loginData
        })
        return res.data;
}