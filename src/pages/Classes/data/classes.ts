import type { IClass } from "@/constants/user/user.constant";

export const dummyClasses: IClass[] = [
  {
    id: "1",
    className: "Class 10",
    strength: 60,
    sections: [
      {
        id: "1",
        sectionName: "A",
        strength: 30,
      },
      {
        id: "2",
        sectionName: "B",
        strength: 30,
      },
    ],
  },
  {
    id: "2",
    className: "Class 11",
    strength: 90,
    sections: [
      {
        id: "3",
        sectionName: "A",
        strength: 30,
      },
      {
        id: "4",
        sectionName: "B",
        strength: 30,
      },
      {
        id: "5",
        sectionName: "C",
        strength: 30,
      },
    ],
  },
];