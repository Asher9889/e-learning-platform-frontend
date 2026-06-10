// lib/mock-api.ts
import type { Class, Section, CreateClassInput, CreateSectionInput, UpdateClassInput, UpdateSectionInput } from "./types/index";

// Simulated delay for realistic feel
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

// Initial seed data
let classes: Class[] = [
  {
    id: "cls-1",
    name: "Computer Science",
    description: "Core computer science curriculum covering algorithms, data structures, and software engineering principles.",
    grade: "10th Grade",
    academicYear: "2025-2026",
    totalStrength: 85,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sections: [
      { id: "sec-1", name: "Section A", strength: 35, classId: "cls-1", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: "sec-2", name: "Section B", strength: 30, classId: "cls-1", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: "sec-3", name: "Section C", strength: 20, classId: "cls-1", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ]
  },
  {
    id: "cls-2",
    name: "Mathematics",
    description: "Advanced mathematics including calculus, linear algebra, and discrete mathematics.",
    grade: "11th Grade",
    academicYear: "2025-2026",
    totalStrength: 60,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sections: [
      { id: "sec-4", name: "Section A", strength: 30, classId: "cls-2", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: "sec-5", name: "Section B", strength: 30, classId: "cls-2", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ]
  }
];

export const mockApi = {
  // Get all classes
  getClasses: async (): Promise<Class[]> => {
    await delay(600);
    return [...classes];
  },

  // Get single class
  getClass: async (id: string): Promise<Class | undefined> => {
    await delay(300);
    return classes.find(c => c.id === id);
  },

  // Create class
  createClass: async (input: CreateClassInput): Promise<Class> => {
    await delay(800);
    const newClass: Class = {
      id: generateId(),
      ...input,
      sections: [],
      totalStrength: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    classes.push(newClass);
    return newClass;
  },

  // Update class
  updateClass: async (input: UpdateClassInput): Promise<Class> => {
    await delay(600);
    const index = classes.findIndex(c => c.id === input.id);
    if (index === -1) throw new Error("Class not found");

    const updated = {
      ...classes[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    classes[index] = updated;
    return updated;
  },

  // Delete class
  deleteClass: async (id: string): Promise<void> => {
    await delay(500);
    classes = classes.filter(c => c.id !== id);
  },

  // Create section
  createSection: async (input: CreateSectionInput): Promise<Section> => {
    await delay(600);
    const classIndex = classes.findIndex(c => c.id === input.classId);
    if (classIndex === -1) throw new Error("Class not found");

    const newSection: Section = {
      id: generateId(),
      ...input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    classes[classIndex].sections.push(newSection);
    classes[classIndex].totalStrength += input.strength;
    classes[classIndex].updatedAt = new Date().toISOString();

    return newSection;
  },

  // Update section
  updateSection: async (input: UpdateSectionInput): Promise<Section> => {
    await delay(600);
    const classIndex = classes.findIndex(c => c.id === input.classId);
    if (classIndex === -1) throw new Error("Class not found");

    const sectionIndex = classes[classIndex].sections.findIndex(s => s.id === input.id);
    if (sectionIndex === -1) throw new Error("Section not found");

    const oldStrength = classes[classIndex].sections[sectionIndex].strength;
    const updated = {
      ...classes[classIndex].sections[sectionIndex],
      ...input,
      updatedAt: new Date().toISOString(),
    };

    classes[classIndex].sections[sectionIndex] = updated;
    classes[classIndex].totalStrength = classes[classIndex].totalStrength - oldStrength + (input.strength ?? oldStrength);
    classes[classIndex].updatedAt = new Date().toISOString();

    return updated;
  },

  // Delete section
  deleteSection: async (classId: string, sectionId: string): Promise<void> => {
    await delay(500);
    const classIndex = classes.findIndex(c => c.id === classId);
    if (classIndex === -1) throw new Error("Class not found");

    const section = classes[classIndex].sections.find(s => s.id === sectionId);
    if (section) {
      classes[classIndex].totalStrength -= section.strength;
    }
    classes[classIndex].sections = classes[classIndex].sections.filter(s => s.id !== sectionId);
    classes[classIndex].updatedAt = new Date().toISOString();
  },
};
