import { api } from "@/config";
import type {
  Profile,
} from "../types/profile.types";

export interface UpdateNamePayload {
  name: string;
}

class ProfileApi {
  async getProfile() {
    const response = await api.get<Profile>(
      "/auth/me"
    );

    return response.data;
  }

  async updateName(payload: UpdateNamePayload) {
    const response = await api.patch<Profile>(
      "/users/profile/name",
      payload
    );

    return response.data;
  }
}

export default new ProfileApi();