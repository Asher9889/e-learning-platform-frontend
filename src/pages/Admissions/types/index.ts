export type Gender = "MALE" | "FEMALE" | "OTHER";

export type AdmissionStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface AdmissionPersonal {
  fullName: string;
  fatherName: string;
  motherName: string;
  email: string;
  mobile: string;
  gender: Gender;
  dob: string;
  address: {
    line1:string,
    city: string;
    state: string;
    zipCode:string;
  }
}

export interface AdmissionAcademic {
  qualification: string;
  institutionName: string;
  boardOrUniversity: string;
  passingYear: string;
  percentage: string;
}

export interface AdmissionDocuments {
  photo: string;
  aadhaar: string;
  marksheet: string;
}

export interface Admission {
  id: string;
  personal: AdmissionPersonal;
  academics: AdmissionAcademic[];
  documents: AdmissionDocuments;
  programId:string;
  status: AdmissionStatus;
  createdAt: string;
  updatedAt: string;
}