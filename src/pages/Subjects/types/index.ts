export interface Subject {
  id: string;
  programId: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  program?: { id: string; name: string };
}
