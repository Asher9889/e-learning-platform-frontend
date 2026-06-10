import { api, apiEndPoints } from "@/config";

async function logout(){
    const { url, method } = apiEndPoints.AUTH.LOGOUT;
    await api.request({
        url, method
    })
}

export const authApi = {
    logout,
}