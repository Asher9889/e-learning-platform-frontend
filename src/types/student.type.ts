// types.ts

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  batch: string;
  rollNumber: string;
  status: "active" | "inactive";
}