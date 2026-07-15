import { api, apiEndPoints } from "@/config";

import type {
  AssessmentApiResponse,
  AssessmentsResponse,
} from "../types/assessment.types";
import { assessmentsResponseSchema } from "../schema/assessment.schema";

export async function getAssessments() {
  const { url, method } =
    apiEndPoints.ASSESSMENTS.LIST;

  const res =
    await api.request<AssessmentApiResponse>({
      url,
      method,
    });
console.log(res.data,"apidatajkj api data table assessments uppar rowStudents")

 try {
  const parsedData =
    assessmentsResponseSchema.parse(res.data);

  console.log(
    res.data,
    "apidatajkj api data table assessments rowStudents",
    parsedData
  );

  return parsedData as AssessmentsResponse;
} catch (error) {
  console.error("Schema validation failed:", error);
}

}