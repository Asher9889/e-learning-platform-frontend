// data/students.ts

import type { Student } from "@/types/student.type";


export const students: Student[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    phone: "9876543210",
    batch: "BCA 2025",
    rollNumber: "BCA001",
    status: "active",
  },
  {
    id: "2",
    name: "Aman Verma",
    email: "aman@gmail.com",
    phone: "9876543211",
    batch: "BCA 2025",
    rollNumber: "BCA002",
    status: "active",
  },
  {
    id: "3",
    name: "Priya Singh",
    email: "priya@gmail.com",
    phone: "9876543212",
    batch: "MCA 2025",
    rollNumber: "MCA001",
    status: "inactive",
  },
];

// constants.ts

export const ENROLL_STEPS = [
  "Account",
  "Personal",
  "Address",
  "Student",
  "Guardian",
  "Review",
];