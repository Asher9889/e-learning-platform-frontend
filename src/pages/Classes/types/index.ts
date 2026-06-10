// // types/index.ts
// export interface CreateSectionInput {
//   classId: string;
//   name: string;
//   strength: number
// }
export interface Section {
  _id: string;
  name: string;
  strength: number;
  classId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Class {
  id: string;
  name: string;
  description: string;
  grade: string;
  academicYear: string;
  sections: Section[];
  totalStrength: number;
  createdAt: string;
  updatedAt: string;
}


// export interface Class {
//   id: string;
//   name: string;
//   description: string;
//   grade: string;
//   academicYear: string;
//   totalStrength: number;
//   createdAt: string;
//   updatedAt: string;
//   sections: Section[];
// }






export type DialogMode = 'create' | 'edit';