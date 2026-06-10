// types/index.ts

export interface Section {
  id: string;
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

export interface CreateClassInput {
  name: string;
  description: string;
  grade: string;
  academicYear: string;
}

export interface UpdateClassInput extends Partial<CreateClassInput> {
  id: string;
}

export interface CreateSectionInput {
  name: string;
  strength: number;
  classId: string;
}

export interface UpdateSectionInput extends Partial<Omit<CreateSectionInput, 'classId'>> {
  id: string;
  classId: string;
}

export type DialogMode = 'create' | 'edit';
