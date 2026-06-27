import type { AdmissionStatus } from "../types";

export interface UpdateAdmissionStatusInput {
  id: string;
  status: AdmissionStatus;
}